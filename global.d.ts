type Drivers = 'localstorage' | 'idb';

interface ConfigOptions {
  driver?: Drivers[];
  name?: string;
  storeName?: string;
  version?: number;
}

interface IDriver {
  config: (options: ConfigOptions) => void;

  getItem: <T>(key: string) => Promise<T>;
  getItem: <T>(key: string, onSuccess: (value: T) => void) => void;

  setItem: <T>(key: string, value: T) => Promise<T>;
  setItem: <T>(key: string, value: T, onSuccess: (value: T) => void) => void;

  removeItem: (key: string) => Promise<void>;
  removeItem: (key: string, onSuccess: () => void) => void;

  clear: () => Promise<void>;
  clear: (onSuccess: () => void) => void;

  ready: () => Promise<void>;
}

type StoreageItemType =
  | 'Number'
  | 'String'
  | 'Object'
  | 'Array'
  | 'ArrayBuffer'
  | 'Blob'
  | 'Float32Array'
  | 'Float64Array'
  | 'Int8Array'
  | 'Int16Array'
  | 'Int32Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Uint16Array'
  | 'Uint32Array';

type StoreageItem = {
  type: StoreageItemType;
  value: any;
};
