import 'fake-indexeddb/auto';

import { describe, it, expect } from 'vitest';
import { INTERNAL_DRIVERS } from '../../src/constants';
import storeage from '../../src';
import { UnsupportedError } from '../../src/errors';
import LocalStorageDriver from '../../src/drivers/localstorage';
import IDBDriver from '../../src/drivers/idb';

describe('drivers supports', () => {
  it('should throw error when no drivers supported', () => {
    const instance = storeage.createInstance();

    const originalLocalStorage = globalThis.localStorage;
    const originalIndexedDB = globalThis.indexedDB;
    // @ts-expect-error - localStorage is optional in window
    delete globalThis.localStorage;
    // @ts-expect-error - indexedDB is optional in window
    delete globalThis.indexedDB;

    expect(instance.supports(INTERNAL_DRIVERS.LOCALSTORAGE)).toBe(false);
    expect(instance.supports(INTERNAL_DRIVERS.IDB)).toBe(false);
    expect(() =>
      instance.config({ driver: [INTERNAL_DRIVERS.LOCALSTORAGE, INTERNAL_DRIVERS.IDB] })
    ).toThrowError(UnsupportedError);

    globalThis.localStorage = originalLocalStorage;
    globalThis.indexedDB = originalIndexedDB;
  });

  it('should use localstorage when no indexedDB supported', async () => {
    const instance = storeage.createInstance();
    const originalIndexedDB = globalThis.indexedDB;
    // @ts-expect-error - indexedDB is optional in window
    delete globalThis.indexedDB;

    expect(instance.supports(INTERNAL_DRIVERS.LOCALSTORAGE)).toBe(true);
    expect(instance.supports(INTERNAL_DRIVERS.IDB)).toBe(false);
    const driverName = await instance.ready().then(() => instance.driver());
    expect(driverName).toBe(new LocalStorageDriver().driverName);

    globalThis.indexedDB = originalIndexedDB;
  });

  it('should use indexedDB when indexedDB supported', async () => {
    const instance = storeage.createInstance();

    expect(instance.supports(INTERNAL_DRIVERS.LOCALSTORAGE)).toBe(true);
    expect(instance.supports(INTERNAL_DRIVERS.IDB)).toBe(true);
    const driverName = await instance.ready().then(() => instance.driver());
    expect(driverName).toBe(new IDBDriver().driverName);
  });

  it('should return false when no driver found', () => {
    const instance = storeage.createInstance();
    expect(instance.supports('__not_exist_driver__')).toBe(false);
  });
});
