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

export async function workInVersionChange<T>(
  name: string,
  before: () => void,
  callback: (request: IDBOpenDBRequest) => T,
  after: (val: T) => void
) {
  return getIDBVersion(name).then<T>(version => {
    return new Promise<T>((resolve, reject) => {
      before();
      const request = indexedDB.open(name, version + 1);
      let result!: T;
      request.onupgradeneeded = () => {
        result = callback(request);
      };
      request.onsuccess = () => {
        after(result);
        resolve(result);
      };
      request.onerror = () => {
        reject(new Error('upgrade database error'));
      };
    });
  });
}
