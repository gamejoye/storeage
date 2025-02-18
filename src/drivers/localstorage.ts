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

  getItem<T>(key: string): Promise<T> {
    const value = localStorage.getItem(this.internalKeyGenerator(key));
    return Promise.resolve(value !== null ? deserialize(value) : null);
  }

  setItem<T>(key: string, value: T): Promise<T> {
    localStorage.setItem(this.internalKeyGenerator(key), serialize(value));
    return Promise.resolve(value);
  }

  removeItem(key: string): Promise<void> {
    localStorage.removeItem(this.internalKeyGenerator(key));
    return Promise.resolve();
  }

  clear(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }

  length(): Promise<number> {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key)) {
        count++;
      }
    }
    return Promise.resolve(count);
  }

  keys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key)) {
        keys.push(this.decodeInternalKey(key));
      }
    }
    return Promise.resolve(keys);
  }

  async iterate<T, U>(callback: (key: string, value: T, index: number) => U): Promise<U | void> {
    const keys = await this.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = await this.getItem<T>(key);
      const result = callback(key, value, i);
      if (result !== undefined) {
        return result;
      }
    }
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
