import { DEFAULT_CONFIG } from "../constants";
import { deserialize, serialize } from "../utils";

export class LocalStorageDriver implements IDriver {
  private options: Required<ConfigOptions> = DEFAULT_CONFIG;
  config(options: ConfigOptions = DEFAULT_CONFIG): void {
    this.options = { ...DEFAULT_CONFIG, ...options };
  }

  getItem<T>(key: string): Promise<T>;
  getItem<T>(key: string, onSuccess: (value: T) => void): void;
  getItem<T>(key: string, onSuccess?: (value: T) => void): void | Promise<T> {
    const value = localStorage.getItem(key);
    if (onSuccess) {
      onSuccess(value !== null ? deserialize(value) : null);
    } else {
      return Promise.resolve(value !== null ? deserialize(value) : null);
    }
  }

  setItem<T>(key: string, value: T): Promise<T>;
  setItem<T>(key: string, value: T, onSuccess: (value: T) => void): void;
  setItem<T>(key: string, value: T, onSuccess?: (value: T) => void): void | Promise<T> {
    localStorage.setItem(key, serialize(value));
    if (onSuccess) {
      onSuccess(value);
    } else {
      return Promise.resolve(value);
    }
  }

  removeItem(key: string): Promise<void>;
  removeItem(key: string, onSuccess: () => void): void;
  removeItem(key: string, onSuccess?: () => void): void | Promise<void> {
    localStorage.removeItem(key);
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

  ready(): Promise<void> {
    return Promise.resolve();
  }
}

export default LocalStorageDriver;
export const localstorageDriver = new LocalStorageDriver();