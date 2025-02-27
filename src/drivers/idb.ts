import { DEFAULT_CONFIG, IDB_MODE } from '../constants';
import { DroppedError } from '../errors';
import { ConfigOptions, IDriver } from '../interface';
import { getIDB, once, workInVersionChange } from '../utils';
import { ExpirationItem, ExpirationItemJSON } from '../value-objects/expiration-item';

const idbDriverMap = new Map<string, IDBDriver[]>();

class IDBDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private db!: IDBDatabase;
  private isDropped = false;
  driverName = 'IndexedDBStorage';
  config(options: ConfigOptions = {}): void {
    this.options = { ...this.options, ...options };
  }

  private assertNotDropped(): void {
    if (this.isDropped) {
      throw new DroppedError(
        `IndexedDB: ${this.options.name}/${this.options.storeName} is dropped`
      );
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    this.assertNotDropped();
    await this.ready();
    return new Promise<T | null>(resolve => {
      const getRequest = this.db
        .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
        .objectStore(this.options.storeName)
        .get(key);
      getRequest.onsuccess = () => {
        const item = getRequest.result as ExpirationItemJSON<T>;
        if (!item) {
          resolve(null);
          return;
        }
        resolve(ExpirationItem.fromJSON(item).value);
      };
    });
  }

  setItem<T>(key: string, value: T, expiration?: number): Promise<T> {
    this.assertNotDropped();
    const item = new ExpirationItem<T>(value, expiration);
    return new Promise<T>(resolve => {
      this.ready().then(() => {
        const putRequest = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
          .objectStore(this.options.storeName)
          .put(item.toJSON(), key);
        putRequest.onsuccess = () => {
          resolve(item.value!);
        };
      });
    });
  }

  removeItem(key: string): Promise<void> {
    this.assertNotDropped();
    return new Promise<void>(resolve => {
      this.ready().then(() => {
        const deleteRequest = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
          .objectStore(this.options.storeName)
          .delete(key);
        deleteRequest.onsuccess = () => {
          resolve();
        };
      });
    });
  }

  clear(): Promise<void> {
    this.assertNotDropped();
    return new Promise<void>(resolve => {
      this.ready().then(() => {
        const clearRequest = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
          .objectStore(this.options.storeName)
          .clear();
        clearRequest.onsuccess = () => {
          resolve();
        };
      });
    });
  }

  length(): Promise<number> {
    this.assertNotDropped();
    return new Promise<number>(resolve => {
      this.ready().then(() => {
        const request = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
          .objectStore(this.options.storeName)
          .getAll();
        request.onsuccess = () => {
          const items = (request.result as ExpirationItemJSON<any>[]).filter(
            item => !ExpirationItem.fromJSON(item).isExpired()
          );
          resolve(items.length);
        };
      });
    });
  }

  keys(): Promise<string[]> {
    this.assertNotDropped();
    return new Promise<string[]>(resolve => {
      this.ready().then(() => {
        const request = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
          .objectStore(this.options.storeName)
          .openCursor();
        const keys: string[] = [];
        request.onsuccess = e => {
          const cursor = (e.target as any).result as IDBCursorWithValue;
          if (!cursor) {
            resolve(keys);
            return;
          }
          const item = ExpirationItem.fromJSON(cursor.value as ExpirationItemJSON<any>);
          if (!item.isExpired()) {
            keys.push(cursor.key as string);
          }
          cursor.continue();
        };
      });
    });
  }

  iterate<T, U>(callback: (key: string, value: T, index: number) => U): Promise<U | void> {
    this.assertNotDropped();
    return new Promise<U | void>(resolve => {
      this.keys().then(async keys => {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = await this.getItem<T>(key);
          if (value === null) continue;
          const result = callback(key, value, i);
          if (result !== undefined) {
            resolve(result);
            return;
          }
        }
        resolve();
      });
    });
  }

  drop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ready().then(async () => {
        const { name, storeName } = this.options;

        if (!storeName) {
          // TODO
          // 删除数据库
          const request = getIDB()!.deleteDatabase(name);
          request.onerror = () => {
            reject(new Error('drop database error'));
          };
          request.onsuccess = () => {
            resolve();
          };
          return;
        }

        const driversToClose = idbDriverMap.get(name) ?? [];
        workInVersionChange(
          name,
          () => {},
          request => {
            const db = request.result as IDBDatabase;
            db.deleteObjectStore(storeName);
          },
          async () => {
            const driversToReconnect = driversToClose.filter(driver => driver !== this);
            idbDriverMap.set(name, driversToReconnect);
            await Promise.all(driversToReconnect.map(driver => driver.reconnect()));
            resolve();
          }
        );
      });
    }).then(() => {
      this.isDropped = true;
    });
  }

  close = () => {
    if (this.db) {
      this.db.close();
    }
  };

  supports() {
    const idb = getIDB();
    return !!idb;
  }

  ready: () => Promise<void> = once(() => {
    this.config();
    this.assertNotDropped();
    const drivers = idbDriverMap.get(this.options.name) || [];
    idbDriverMap.set(this.options.name, [...drivers, this]);
    return new Promise<void>((resolve, reject) => {
      const request = getIDB()!.open(this.options.name);
      /**
       * 执行顺序
       * onupgradeneeded（如果有新的版本号或者新建数据库）
       * onsuccess
       */
      request.onerror = () => {
        reject(new Error('open database error'));
      };
      request.onsuccess = () => {
        const names = request.result.objectStoreNames;
        if (!names.contains(this.options.storeName)) {
          // 关闭所有连接 防止升级被阻塞
          workInVersionChange(
            this.options.name,
            () => {
              request.result.close();
            },
            request => {
              const db = request.result as IDBDatabase;
              db.createObjectStore(this.options.storeName);
            },
            async () => {
              const driversToReconnect = idbDriverMap.get(this.options.name) || [];
              // 重新连接（包括当前实例）
              await Promise.all(driversToReconnect.map(driver => driver.reconnect()));
              resolve();
            }
          );
        } else {
          this.db = request.result;
          resolve();
        }
      };
    }).then(() => {
      this.db.onversionchange = this.close;
    });
  });

  private reconnect(): Promise<void> {
    return new Promise<void>(resolve => {
      const request = getIDB()!.open(this.options.name);
      request.onsuccess = () => {
        this.db = request.result;
        this.db.onversionchange = this.close;
        resolve();
      };
    });
  }
}

export default IDBDriver;
