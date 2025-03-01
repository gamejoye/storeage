import { ConfigOptions } from './interface';

export const DEFAULT_CONFIG: Required<ConfigOptions> = {
  driver: ['localstorage', 'idb'],
  name: 'storeage',
  storeName: 'storeage',
};

export const IDB_MODE = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite',
  VERSION_CHANGE: 'versionchange',
} as const;

export const INTERNAL_DRIVERS = {
  LOCALSTORAGE: 'localstorage',
  IDB: 'idb',
} as const;

export const ARRAY_BUFFER_PREFIX = '0:';
export const FLOAT32_ARRAY_PREFIX = '1:';
export const FLOAT64_ARRAY_PREFIX = '2:';
export const INT8_ARRAY_PREFIX = '3:';
export const INT16_ARRAY_PREFIX = '4:';
export const INT32_ARRAY_PREFIX = '5:';
export const UINT8_ARRAY_PREFIX = '6:';
export const UINT8_CLAMPED_ARRAY_PREFIX = '7:';
export const UINT16_ARRAY_PREFIX = '8:';
export const UINT32_ARRAY_PREFIX = '9:';
