import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';
import storeage from '../../src';
import { INTERNAL_DRIVERS } from '../../src/constants';

describe('idb driver', () => {
  beforeEach(() => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    return instance.clear();
  });

  it('should return false when not supported', async () => {
    const indexedDB = globalThis.indexedDB;
    // @ts-expect-error - indexedDB is optional in window
    delete globalThis.indexedDB;
    expect(storeage.supports(INTERNAL_DRIVERS.IDB)).toBe(false);
    globalThis.indexedDB = indexedDB;
  });

  it('should be supported', async () => {
    expect(storeage.supports(INTERNAL_DRIVERS.IDB)).toBe(true);
  });

  it('should be able to get driver name', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    const unreadyDriverName = instance.driver();
    expect(unreadyDriverName).toBeNull();
    await instance.ready();
    const driverName = instance.driver();
    expect(driverName).not.toBeNull();
    expect(driverName!.toLowerCase()).toMatch(/.*indexeddb.*$/);
  });

  it('should be able to get item and set item', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.setItem('test', 'test');
    const value = await instance.getItem('test');
    expect(value).toBe('test');
  });

  it('should be able to remove item', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.removeItem('test');
    const value = await instance.getItem('test');
    expect(value).toBeNull();
  });

  it('should be able to clear all items', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    await instance.clear();
    const value = await instance.getItem('test');
    expect(value).toBeNull();
    const value2 = await instance.getItem('test2');
    expect(value2).toBeNull();
  });

  it('should be able to get length', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const length = await instance.length();
    expect(length).toBe(2);
  });

  it('should be able to get keys', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const keys = await instance.keys();
    expect(keys).toContain('test');
    expect(keys).toContain('test2');
  });

  it('should be able to iterate', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const result: { key: string; value: string }[] = [];
    await instance.iterate<string, any>((key, value) => {
      result.push({ key, value });
    });
    expect(result).toContainEqual({ key: 'test', value: 'test' });
    expect(result).toContainEqual({ key: 'test2', value: 'test2' });

    // 提前结束迭代
    const items: { key: string; value: string }[] = [];
    const item = await instance.iterate<string, any>((key, value) => {
      items.push({ key, value });
      return { key, value };
    });
    expect(items).toContainEqual(item);
    expect(items.length).toBe(1);
  });

  it('should be able to drop', async () => {
    const instance = storeage.createInstance({
      driver: [INTERNAL_DRIVERS.IDB],
    });
    await instance.ready();
    await instance.dropInstance();
    await expect(() => instance.getItem('test')).rejects.toThrowError();
  });
});
