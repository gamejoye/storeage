import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import storeage from '../../../src';

describe('setItem api', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = storeage.createInstance();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('setItem with promise style', async () => {
    const instance = storeage.createInstance();
    const vale = await instance.setItem('test', 'test');
    expect(vale).toBe('test');
  });

  it('setItem with callback style', async () => {
    const instance = storeage.createInstance();
    instance.setItem('test', 'test', value => {
      expect(value).toBe('test');
    });
  });

  it('setItem with expiration time', async () => {
    const instance = storeage.createInstance();
    const now = new Date().getTime();
    const vale = await instance.setItem('test', 'test', 1000);
    expect(vale).toBe('test');
    vi.setSystemTime(now + 1500);
    const valueToBeNull = await instance.getItem('test');
    expect(valueToBeNull).toBeNull();
  });

  it('setItem with expiration time and callback', async () => {
    const instance = storeage.createInstance();
    await new Promise<void>(resolve => {
      instance.setItem('test', 'test', 1000, async value => {
        expect(value).toBe('test');

        await vi.advanceTimersByTimeAsync(1500);

        const valueToBeNull = await instance.getItem('test');
        expect(valueToBeNull).toBeNull();
        resolve();
      });
    });
  });

  it('setItem with global expiration time', async () => {
    const instance = storeage.createInstance({
      expirationTime: 1000,
    });
    await instance.setItem('test', 'test');
    expect(await instance.getItem('test')).toBe('test');
    await vi.advanceTimersByTimeAsync(1500);
    expect(await instance.getItem('test')).toBeNull();

    await instance.setItem('test', 'test', 2000);
    expect(await instance.getItem('test')).toBe('test');
    await vi.advanceTimersByTimeAsync(1500);
    expect(await instance.getItem('test')).toBe('test');
    await vi.advanceTimersByTimeAsync(1000);
    expect(await instance.getItem('test')).toBeNull();
  });
});
