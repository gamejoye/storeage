import { describe, it, expect, beforeEach } from 'vitest';
import storeage from '../../../src';

describe('removeItem api', () => {
  beforeEach(() => {
    const instance = storeage.createInstance();
    return instance.clear();
  });

  it('removeItem with promise style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    await instance.removeItem('test');
    const value = await instance.getItem('test');
    expect(value).toBeNull();
  });

  it('removeItem with callback style', async () => {
    const instance = storeage.createInstance();
    await instance.setItem('test', 'test');
    instance.removeItem('test', () => {
      instance.getItem('test', value => {
        expect(value).toBeNull();
      });
    });
  });
});
