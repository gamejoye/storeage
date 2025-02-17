import { DEFAULT_CONFIG, IDB_MODE } from '../constants';

export class IDBDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private keyPrefix: string = '';
  private db!: IDBDatabase;
  config(options: ConfigOptions = {}): void {
    this.options = { ...DEFAULT_CONFIG, ...options };
    this.keyPrefix = `${this.options.name}/${this.options.storeName}/`;
  }

  getItem<T>(key: string): Promise<T>;
  getItem<T>(key: string, onSuccess: (value: T) => void): void;
  getItem<T>(key: string, onSuccess?: (value: T) => void): void | Promise<T> {
    const executor = () => {
      return new Promise<T>(resolve => {
        this.ready().then(() => {
          const getRequest = this.db
            .transaction(this.options.storeName, IDB_MODE.READ_ONLY)
            .objectStore(this.options.storeName)
            .get(this.internalKeyGenerator(key));
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
          const putRequest = this.db
            .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
            .objectStore(this.options.storeName)
            .put(value, this.internalKeyGenerator(key));
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
          const deleteRequest = this.db
            .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
            .objectStore(this.options.storeName)
            .delete(this.internalKeyGenerator(key));
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
          const clearRequest = this.db
            .transaction(this.options.storeName, IDB_MODE.READ_WRITE)
            .objectStore(this.options.storeName)
            .clear();
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

  private internalKeyGenerator(key: string): string {
    return this.keyPrefix + key;
  }
}

export default IDBDriver;
export const idbDriver = new IDBDriver();
