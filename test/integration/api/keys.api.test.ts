import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest';
import storeage from '../../../src';

describe('keys api', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = storeage.createInstance();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keys with promise style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const keys = await instance.keys();
    expect(keys).toContain('test');
    expect(keys).toContain('test2');
    expect(keys.length).toBe(2);
  });

  it('keys with callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test3', 'test3');
    await instance.setItem('test4', 'test4');
    instance.keys(keys => {
      expect(keys).toContain('test3');
      expect(keys).toContain('test4');
      expect(keys.length).toBe(2);
    });
  });

  it('keys with global expiration time', async () => {
    const instance = storeage.createInstance({
      expirationTime: 1000,
    });
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const keys = await instance.keys();
    expect(keys).toContain('test');
    expect(keys).toContain('test2');
    expect(keys.length).toBe(2);

    await vi.advanceTimersByTimeAsync(1001);
    const keys2 = await instance.keys();
    expect(keys2).toEqual([]);
  });
});
