import { DEFAULT_CONFIG, IDB_MODE } from '../constants';

export class IDBDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private db!: IDBDatabase;
  driverName = 'IndexedDBStorage';
  config(options: ConfigOptions = {}): void {
    this.options = { ...DEFAULT_CONFIG, ...options };
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
            .get(key);
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
            .put(value, key);
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
            .delete(key);
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

  length(): Promise<number>;
  length(onSuccess: (length: number) => void): void;
  length(onSuccess?: (length: number) => void): void | Promise<number> {
    const executor = () => {
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
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  keys(): Promise<string[]>;
  keys(onSuccess: (keys: string[]) => void): void;
  keys(onSuccess?: (keys: string[]) => void): void | Promise<string[]> {
    const executor = () => {
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
}

export default IDBDriver;
export const idbDriver = new IDBDriver();
