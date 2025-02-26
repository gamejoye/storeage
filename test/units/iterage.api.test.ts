import { describe, it, beforeEach, expect } from 'vitest';
import storeage from '../../src';

describe('iterage api', () => {
  beforeEach(() => {
    const instance = storeage.createInstance();
    return instance.clear();
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
});
