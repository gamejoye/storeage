import { DEFAULT_CONFIG, IDB_MODE } from '../constants';

export class IDBDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private db!: IDBDatabase;
  driverName = 'IndexedDBStorage';
  config(options: ConfigOptions = {}): void {
    this.options = { ...DEFAULT_CONFIG, ...options };
  }

  getItem<T>(key: string): Promise<T> {
    return new Promise<T>(resolve => {
      this.ready().then(() => {
        const getRequest = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
          .objectStore(this.options.storeName)
          .get(key);
        getRequest.onsuccess = () => {
          resolve(getRequest.result === undefined ? null : getRequest.result);
        };
      });
    });
  }

  setItem<T>(key: string, value: T): Promise<T> {
    return new Promise<T>(resolve => {
      this.ready().then(() => {
        const putRequest = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
          .objectStore(this.options.storeName)
          .put(value, key);
        putRequest.onsuccess = () => {
          resolve(value);
        };
      });
    });
  }

  removeItem(key: string): Promise<void> {
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
    return new Promise<number>(resolve => {
      this.ready().then(() => {
        const lengthRequest = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
          .objectStore(this.options.storeName)
          .count();
        lengthRequest.onsuccess = () => {
          resolve(lengthRequest.result);
        };
      });
    });
  }

  keys(): Promise<string[]> {
    return new Promise<string[]>(resolve => {
      this.ready().then(() => {
        const request = this.db
          .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
          .objectStore(this.options.storeName)
          .getAllKeys();
        request.onsuccess = () => {
          resolve(request.result.map(key => key + ''));
        };
      });
    });
  }

  iterate<T, U>(callback: (key: string, value: T, index: number) => U): Promise<U | void> {
    return new Promise<U | void>(resolve => {
      this.keys().then(async keys => {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = await this.getItem<T>(key);
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

  ready(): Promise<void> {
    return new Promise(resolve => {
      if (this.db) {
        resolve();
        return;
      }
      const request = indexedDB.open(this.options.name, this.options.version);
      /**
       * 执行顺序
       * onupgradeneeded（如果有新的版本号或者新建数据库）
       * onsuccess
       */
      request.onupgradeneeded = e => {
        const db = (e.target as any).result as IDBDatabase;
        db.createObjectStore(this.options.storeName);
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
    });
  }
}

export default IDBDriver;
export const idbDriver = new IDBDriver();
