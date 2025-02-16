import { DEFAULT_CONFIG, IDB_MODE } from '../constants';

export class IDBDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private keyPrefix: string = '';
  private db!: IDBDatabase;
  private store!: IDBObjectStore;
  config(options: ConfigOptions = DEFAULT_CONFIG): void {
    this.options = { ...DEFAULT_CONFIG, ...options };
    this.keyPrefix = `${this.options.name}/${this.options.storeName}/`;
  }

  getItem<T>(key: string): Promise<T>;
  getItem<T>(key: string, onSuccess: (value: T) => void): void;
  getItem<T>(key: string, onSuccess?: (value: T) => void): void | Promise<T> {
    const executor = () => {
      return new Promise<T>(resolve => {
        this.ready().then(() => {
          const getRequest = this.store.get(this.internalKeyGenerator(key));
          getRequest.onsuccess = () => {
            resolve(getRequest.result === undefined ? null : getRequest.result);
          };
        });
      });
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  setItem<T>(key: string, value: T): Promise<T>;
  setItem<T>(key: string, value: T, onSuccess: (value: T) => void): void;
  setItem<T>(key: string, value: T, onSuccess?: (value: T) => void): void | Promise<T> {
    const executor = () => {
      return new Promise<T>(resolve => {
        this.ready().then(() => {
          const putRequest = this.store.put(value, this.internalKeyGenerator(key));
          putRequest.onsuccess = () => {
            resolve(value);
          };
        });
      });
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  removeItem(key: string): Promise<void>;
  removeItem(key: string, onSuccess: () => void): void;
  removeItem(key: string, onSuccess?: () => void): void | Promise<void> {
    const executor = () => {
      return new Promise<void>(resolve => {
        this.ready().then(() => {
          const deleteRequest = this.store.delete(this.internalKeyGenerator(key));
          deleteRequest.onsuccess = () => {
            resolve();
          };
        });
      });
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  clear(): Promise<void>;
  clear(onSuccess: () => void): void;
  clear(onSuccess?: () => void): void | Promise<void> {
    const executor = () => {
      return new Promise<void>(resolve => {
        this.ready().then(() => {
          const clearRequest = this.store.clear();
          clearRequest.onsuccess = () => {
            resolve();
          };
        });
      });
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  ready(): Promise<void> {
    return new Promise(resolve => {
      const request = indexedDB.open(this.options.name, this.options.version);
      /**
       * 执行顺序
       * onupgradeneeded（如果有新的版本号或者新建数据库）
       * onsuccess
       */
      let objectStoreMayUnready: IDBObjectStore | null = null;
      request.onupgradeneeded = e => {
        const db = (e.target as any).result as IDBDatabase;
        objectStoreMayUnready = db.createObjectStore(this.options.storeName);
      };
      request.onsuccess = () => {
        this.db = request.result;
        if (objectStoreMayUnready) {
          // 新建的objectStore需要等待transaction.oncomplete
          objectStoreMayUnready.transaction.oncomplete = () => {
            this.store = this.db
              .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
              .objectStore(this.options.storeName);
          };
        } else {
          // 如果objectStore已经存在，则直接返回
          this.store = this.db
            .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
            .objectStore(this.options.storeName);
        }
        resolve();
      };
    });
  }

  private internalKeyGenerator(key: string): string {
    return this.keyPrefix + key;
  }
}

export default IDBDriver;
export const idbDriver = new IDBDriver();
