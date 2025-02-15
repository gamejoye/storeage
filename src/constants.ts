export const DEFAULT_CONFIG: Required<ConfigOptions> = {
  driver: ['localstorage', 'idb'],
  name: 'storeage',
  storeName: 'storeage',
  version: 1,
};

export const IDB_MODE = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite',
  VERSION_CHANGE: 'versionchange',
} as const;
