export function getIDBVersion(name: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onerror = () => {
      request.result.close();
      reject(new Error('get database version error'));
    };
    request.onsuccess = () => {
      request.result.close();
      resolve(request.result.version);
    };
  });
}

const INDEXED_DB_LOCAL_STORAGE_PREFIX = '__storeage_indexed_db_versions__/';

export async function workInVersionChange<T>(
  name: string,
  before: () => void,
  callback: (request: IDBOpenDBRequest) => T,
  after: (val: T) => void
) {
  return new Promise<T>((resolve, reject) => {
    before();
    const version = parseInt(localStorage.getItem(INDEXED_DB_LOCAL_STORAGE_PREFIX + name) ?? '1');
    const request = indexedDB.open(name, version + 1);
    localStorage.setItem(INDEXED_DB_LOCAL_STORAGE_PREFIX + name, version + 1 + '');
    let result!: T;
    request.onupgradeneeded = () => {
      result = callback(request);
    };
    request.onsuccess = () => {
      after(result);
      resolve(result);
      request.result.close();
    };
    request.onerror = () => {
      reject(new Error('upgrade database error'));
      request.result.close();
    };
  });
}

export function getIDB(): IDBFactory | null {
  return indexedDB;
}
