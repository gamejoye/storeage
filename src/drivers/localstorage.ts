import { DEFAULT_CONFIG } from '../constants';
import { DroppedError } from '../errors';
import { ConfigOptions, IDriver } from '../interface';
import { once } from '../utils';
import { ExpirationItem } from '../value-objects/expiration-item';

class LocalStorageDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  private keyPrefix: string = '';
  private isDropped = false;
  driverName = 'LocalStorageStorage';
  config(options: ConfigOptions = {}): void {
    this.options = { ...this.options, ...options };
    this.keyPrefix = `${this.options.name}/${this.options.storeName}/`;
  }

  private assertNotDropped(): void {
    if (this.isDropped) {
      throw new DroppedError(
        `LocalStorage: ${this.options.name}/${this.options.storeName} is dropped`
      );
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    this.assertNotDropped();
    const value = localStorage.getItem(this.internalKeyGenerator(key));
    if (value === null) return null;
    const expirationItem = ExpirationItem.fromString<T>(value);
    if (expirationItem.isExpired()) {
      await this.removeItem(key);
      return null;
    }
    return expirationItem.value;
  }

  async setItem<T>(key: string, value: T, expiration?: number): Promise<T> {
    this.assertNotDropped();
    if (value === undefined) value = null as T;
    const item = new ExpirationItem(value, expiration);
    localStorage.setItem(this.internalKeyGenerator(key), await item.toString());
    return Promise.resolve(value);
  }

  removeItem(key: string): Promise<void> {
    this.assertNotDropped();
    localStorage.removeItem(this.internalKeyGenerator(key));
    return Promise.resolve();
  }

  async clear(): Promise<void> {
    this.assertNotDropped();
    const keys = await this.keys();
    await Promise.all(keys.map(key => this.removeItem(key)));
    return Promise.resolve();
  }

  async length(): Promise<number> {
    this.assertNotDropped();
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key, this.options.name, this.options.storeName)) {
        const value = localStorage.getItem(key);
        if (value !== null && !ExpirationItem.fromString(value).isExpired()) {
          count++;
        }
      }
    }
    return Promise.resolve(count);
  }

  keys(): Promise<string[]> {
    this.assertNotDropped();
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key, this.options.name, this.options.storeName)) {
        const value = localStorage.getItem(key);
        if (value !== null && !ExpirationItem.fromString(value).isExpired()) {
          keys.push(this.decodeInternalKey(key));
        }
      }
    }
    return Promise.resolve(keys);
  }

  async iterate<T, U>(callback: (key: string, value: T, index: number) => U): Promise<U | void> {
    this.assertNotDropped();
    const keys = await this.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = await this.getItem<T>(key);
      if (value === null) continue;

      const result = callback(key, value, i);
      if (result !== undefined) {
        return result;
      }
    }
  }

  async drop(): Promise<void> {
    this.assertNotDropped();
    const { name, storeName } = this.options;

    if (!storeName) {
      // TODO
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && this.isBelongsToDatabase(key, name)) {
          keys.push(key);
        }
      }
      await Promise.all(keys.map(key => this.removeItem(key)));
      return;
    }

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key, name, storeName)) {
        keysToRemove.push(this.decodeInternalKey(key));
      }
    }
    await Promise.all(keysToRemove.map(key => this.removeItem(key)));
    this.isDropped = true;
  }

  supports() {
    if (!('localStorage' in window)) return false;
    try {
      const LOCAL_STORAGE_TEST_KEY = '__storeage_localstorage_test_key__';
      localStorage.setItem(LOCAL_STORAGE_TEST_KEY, 'test');
      localStorage.removeItem(LOCAL_STORAGE_TEST_KEY);
      return true;
    } catch {
      return false;
    }
  }

  ready: () => Promise<void> = once(() => {
    this.config();
    this.assertNotDropped();
    return Promise.resolve();
  });

  private internalKeyGenerator(originalKey: string): string {
    return this.keyPrefix + originalKey;
  }

  private decodeInternalKey(internalKey: string): string {
    return internalKey.slice(this.keyPrefix.length);
  }

  private isBelongsToStore(key: string, databaseName: string, storeName: string): boolean {
    return key.startsWith(`${databaseName}/${storeName}/`);
  }

  private isBelongsToDatabase(key: string, databaseName: string): boolean {
    return key.startsWith(databaseName);
  }
}

export default LocalStorageDriver;
