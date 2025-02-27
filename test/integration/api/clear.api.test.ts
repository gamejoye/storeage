import { describe, it, expect, beforeEach } from 'vitest';
import storeage from '../../../src';

describe('clear api', () => {
  beforeEach(() => {
    const instance = storeage.createInstance();
    return instance.clear();
  });

  it('clear with promise style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    await instance.clear();
    const value = await instance.getItem('test');
    expect(value).toBeNull();
    const value2 = await instance.getItem('test2');
    expect(value2).toBeNull();
  });

  it('clear with callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    instance.clear(() => {
      instance.getItem('test', value => {
        expect(value).toBeNull();
      });
    });
  });
});
