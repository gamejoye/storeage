import { describe, expect, it, beforeEach } from 'vitest';
import storeage from '../../../src';

describe('setItem api', () => {
  beforeEach(() => {
    const instance = storeage.createInstance();
    return instance.clear();
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
});
