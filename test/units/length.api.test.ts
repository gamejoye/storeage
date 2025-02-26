import { describe, beforeEach, it, expect } from 'vitest';
import storeage from '../../src';

describe('length api', () => {
  beforeEach(() => {
    const instance = storeage.createInstance();
    return instance.clear();
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
});
