import { describe, it, expect } from 'vitest';
import storeage from '../../src';
import { DroppedError } from '../../src/errors';

describe('dropInstance api', () => {
  it('should be able to drop instance', async () => {
    const instance = storeage.createInstance();
    await instance.dropInstance();
    await expect(instance.getItem('test')).rejects.toThrowError(DroppedError);
  });
});
