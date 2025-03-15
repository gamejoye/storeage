import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest';
import storeage from '../../../src';

describe('iterage api', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = storeage.createInstance();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('iterage with promise style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const result: { key: string; value: string }[] = [];
    const returnValue = await instance.iterate<string, any>((key, value) => {
      result.push({ key, value });
    });
    expect(returnValue).toBeUndefined();
    expect(result).toContainEqual({ key: 'test', value: 'test' });
    expect(result).toContainEqual({ key: 'test2', value: 'test2' });
  });

  it('iterage with callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const result: { key: string; value: string }[] = [];
    instance.iterate<string, any>(
      (key, value) => {
        result.push({ key, value });
      },
      returnValue => {
        expect(returnValue).toBeUndefined();
        expect(result).toContainEqual({ key: 'test', value: 'test' });
        expect(result).toContainEqual({ key: 'test2', value: 'test2' });
      }
    );
  });

  it('iterage should be able to break', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const result: { key: string; value: string }[] = [];
    const returnValue = await instance.iterate<string, any>((key, value) => {
      result.push({ key, value });
      return { key, value };
    });
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(returnValue);
  });

  it('iterage with global expiration time', async () => {
    const instance = storeage.createInstance({
      expirationTime: 1000,
    });
    await instance.setItem('test', 'testvalue');
    let result: { key: string; value: string }[] = [];
    await instance.iterate<string, any>((key, value) => {
      result.push({ key, value });
    });
    expect(result).toEqual([{ key: 'test', value: 'testvalue' }]);

    await vi.advanceTimersByTimeAsync(1001);
    result = [];
    await instance.iterate<string, any>((key, value) => {
      result.push({ key, value });
    });
    expect(result).toEqual([]);
  });
});
