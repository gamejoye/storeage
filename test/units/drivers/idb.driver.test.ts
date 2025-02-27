import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import IDBDriver from '../../../src/drivers/idb';
import { DroppedError } from '../../../src/errors';

describe('idb driver', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = new IDBDriver();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to get item and set item', async () => {
    const instance = new IDBDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    const value = await instance.getItem('test');
    expect(value).toBe('test');
  });

  it('should be able to remove item', async () => {
    const instance = new IDBDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.removeItem('test');
    const value = await instance.getItem('test');
    expect(value).toBeNull();
  });

  it('should be able to clear all items', async () => {
    const instance = new IDBDriver();
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
    const instance = new IDBDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const length = await instance.length();
    expect(length).toBe(2);
  });

  it('should be able to get keys', async () => {
    const instance = new IDBDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const keys = await instance.keys();
    expect(keys).toContain('test');
    expect(keys).toContain('test2');
  });

  it('should be able to iterate', async () => {
    const instance = new IDBDriver();
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
    const instance = new IDBDriver();
    await instance.ready();
    await instance.drop();
    await expect(() => instance.getItem('test')).rejects.toThrowError(DroppedError);
  });

  it('should be able to set item with expiration', async () => {
    const instance = new IDBDriver();
    await instance.ready();
    await instance.setItem('test', 'test', 1000);
    const now = new Date().getTime();

    vi.setSystemTime(now + 500);
    const value = await instance.getItem('test');
    expect(value).toBe('test');

    vi.setSystemTime(now + 2000);
    const valueToBeExpired = await instance.getItem('test');
    expect(valueToBeExpired).toBeNull();
  });
});
