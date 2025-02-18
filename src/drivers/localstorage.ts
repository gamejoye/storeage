import { DEFAULT_CONFIG } from '../constants';
import { deserialize, serialize } from '../utils';

export class LocalStorageDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private keyPrefix: string = '';
  driverName = 'LocalStorageStorage';
  config(options: ConfigOptions = {}): void {
    this.options = { ...DEFAULT_CONFIG, ...options };
    this.keyPrefix = `${this.options.name}/${this.options.storeName}/`;
  }

  getItem<T>(key: string): Promise<T>;
  getItem<T>(key: string, onSuccess: (value: T) => void): void;
  getItem<T>(key: string, onSuccess?: (value: T) => void): void | Promise<T> {
    const value = localStorage.getItem(this.internalKeyGenerator(key));
    if (onSuccess) {
      onSuccess(value !== null ? deserialize(value) : null);
    } else {
      return Promise.resolve(value !== null ? deserialize(value) : null);
    }
  }

  setItem<T>(key: string, value: T): Promise<T>;
  setItem<T>(key: string, value: T, onSuccess: (value: T) => void): void;
  setItem<T>(key: string, value: T, onSuccess?: (value: T) => void): void | Promise<T> {
    localStorage.setItem(this.internalKeyGenerator(key), serialize(value));
    if (onSuccess) {
      onSuccess(value);
    } else {
      return Promise.resolve(value);
    }
  }

  removeItem(key: string): Promise<void>;
  removeItem(key: string, onSuccess: () => void): void;
  removeItem(key: string, onSuccess?: () => void): void | Promise<void> {
    localStorage.removeItem(this.internalKeyGenerator(key));
    if (onSuccess) {
      onSuccess();
    } else {
      return Promise.resolve();
    }
  }

  clear(): Promise<void>;
  clear(onSuccess: () => void): void;
  clear(onSuccess?: () => void): void | Promise<void> {
    localStorage.clear();
    if (onSuccess) {
      onSuccess();
    } else {
      return Promise.resolve();
    }
  }

  length(): Promise<number>;
  length(onSuccess: (length: number) => void): void;
  length(onSuccess?: (length: number) => void): void | Promise<number> {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key)) {
        count++;
      }
    }
    if (onSuccess) {
      onSuccess(count);
    } else {
      return Promise.resolve(count);
    }
  }

  keys(): Promise<string[]>;
  keys(onSuccess: (keys: string[]) => void): void;
  keys(onSuccess?: (keys: string[]) => void): void | Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key)) {
        keys.push(this.decodeInternalKey(key));
      }
    }
    if (onSuccess) {
      onSuccess(keys);
    } else {
      return Promise.resolve(keys);
    }
  }

  iterate<T, U>(callback: (key: string, value: T, index: number) => U): Promise<U | void>;
  iterate<T, U>(
    callback: (key: string, value: T, index: number) => U,
    onSuccess: (result: U | void) => void
  ): void;
  iterate<T, U>(
    callback: (key: string, value: T, index: number) => U | void,
    onSuccess?: (result: U | void) => void
  ): void | Promise<U | void> {
    const executor = () => {
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
    };
    if (onSuccess) {
      executor().then(onSuccess);
      return;
    }
    return executor();
  }

  ready(): Promise<void> {
    return Promise.resolve();
  }

  private internalKeyGenerator(originalKey: string): string {
    return this.keyPrefix + originalKey;
  }

  private decodeInternalKey(internalKey: string): string {
    return internalKey.slice(this.keyPrefix.length);
  }

  private isBelongsToStore(key: string): boolean {
    return key.startsWith(this.keyPrefix);
  }
}

export default LocalStorageDriver;
export const localstorageDriver = new LocalStorageDriver();
