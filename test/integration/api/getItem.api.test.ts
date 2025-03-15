import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import storeage from '../../../src';

describe('getItem api', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = storeage.createInstance();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('get item with promise style', async () => {
    const instance = storeage.createInstance({
      expirationTime: 1000,
    });
    await instance.setItem('test', 'test');
    const value = await instance.getItem('test');
    expect(value).toBe('test');

    await vi.advanceTimersByTimeAsync(1001);

    expect(await instance.getItem('test')).toBeNull();
  });

  it('get item with callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    instance.getItem('test', value => {
      expect(value).toBe('test');
    });
  });
});
