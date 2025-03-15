import { describe, beforeEach, it, expect, afterEach, vi } from 'vitest';
import storeage from '../../../src';

describe('length api', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = storeage.createInstance();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('length with promise style', async () => {
    const instance = storeage.createInstance();
    const length = await instance.length();
    expect(length).toBe(0);
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const length2 = await instance.length();
    expect(length2).toBe(2);
  });

  it('length with callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    instance.length(length => {
      expect(length).toBe(2);
    });
  });

  it('length with global expiration time', async () => {
    const instance = storeage.createInstance({
      expirationTime: 1000,
    });
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const length = await instance.length();
    expect(length).toBe(2);

    await vi.advanceTimersByTimeAsync(1001);
    const length2 = await instance.length();
    expect(length2).toBe(0);
  });
});
