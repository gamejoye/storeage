import { describe, it, expect, beforeEach } from 'vitest';
import storeage from '../../src';

describe('getItem api', () => {
  beforeEach(() => {
    const instance = storeage.createInstance();
    return instance.clear();
  });
  it('get item with promise style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    const value = await instance.getItem('test');
    expect(value).toBe('test');
  });

  it('get item with   callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    instance.getItem('test', value => {
      expect(value).toBe('test');
    });
  });
});
