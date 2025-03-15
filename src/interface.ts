export interface ConfigOptions {
  driver?: string[];
  name?: string;
  storeName?: string;
  expirationTime?: number;
}

export interface DropInstanceOptions {
  name?: string;
  storeName?: string;
}

export interface IDriver {
  driverName: string;

  config: (options: ConfigOptions) => void;

  getItem: <T>(key: string) => Promise<T | null>;

  setItem: <T>(key: string, value: T, expiration?: number) => Promise<T>;

  removeItem: (key: string) => Promise<void>;

  clear: () => Promise<void>;

  length: () => Promise<number>;

  keys: () => Promise<string[]>;

  iterate: <T, U>(
    callback: (key: string, value: T, index: number) => U | void
  ) => Promise<U | void>;

  drop: () => Promise<void>;

  supports: () => boolean;

  ready: () => Promise<void>;
}
