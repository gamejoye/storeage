import { DEFAULT_CONFIG } from '../constants';
import { deserialize, serialize } from '../utils';

class LocalStorageDriver implements IDriver {
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

  async clear(): Promise<void> {
    const keys = await this.keys();
    await Promise.all(keys.map(key => this.removeItem(key)));
    return Promise.resolve();
  }

  length(): Promise<number> {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key, this.options.name, this.options.storeName)) {
        count++;
      }
    }
    return Promise.resolve(count);
  }

  keys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isBelongsToStore(key, this.options.name, this.options.storeName)) {
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

  async drop(): Promise<void> {
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

  private isBelongsToStore(key: string, databaseName: string, storeName: string): boolean {
    return key.startsWith(`${databaseName}/${storeName}/`);
  }

  private isBelongsToDatabase(key: string, databaseName: string): boolean {
    return key.startsWith(databaseName);
  }
}

export default LocalStorageDriver;
