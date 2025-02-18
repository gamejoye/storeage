interface ConfigOptions {
  driver?: string[];
  name?: string;
  storeName?: string;
  version?: number;
}

interface IDriver {
  driverName: string;

  config: (options: ConfigOptions) => void;

  getItem: <T>(key: string) => Promise<T>;

  setItem: <T>(key: string, value: T) => Promise<T>;

  removeItem: (key: string) => Promise<void>;

  clear: () => Promise<void>;

  length: () => Promise<number>;

  keys: () => Promise<string[]>;

  iterate: <T, U>(
    callback: (key: string, value: T, index: number) => U | void
  ) => Promise<U | void>;

  ready: () => Promise<void>;
}
