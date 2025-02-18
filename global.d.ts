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
  getItem: <T>(key: string, onSuccess: (value: T) => void) => void;

  setItem: <T>(key: string, value: T) => Promise<T>;
  setItem: <T>(key: string, value: T, onSuccess: (value: T) => void) => void;

  removeItem: (key: string) => Promise<void>;
  removeItem: (key: string, onSuccess: () => void) => void;

  clear: () => Promise<void>;
  clear: (onSuccess: () => void) => void;

  length: () => Promise<number>;
  length: (onSuccess: (length: number) => void) => void;

  keys: () => Promise<string[]>;
  keys: (onSuccess: (keys: string[]) => void) => void;

  iterate: <T, U>(callback: (key: string, value: T, index: number) => U) => Promise<U | void>;
  iterate: <T, U>(
    callback: (key: string, value: T, index: number) => U,
    onSuccess: (result: U | void) => void
  ) => void;

  ready: () => Promise<void>;
}
