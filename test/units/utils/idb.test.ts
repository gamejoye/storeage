import 'fake-indexeddb/auto';

import { describe, expect, it, vi } from 'vitest';
import { getIDB, getIDBVersion, workInVersionChange } from '../../../src/utils/idb';

describe.sequential('getIDBVersion', () => {
  it('should return indexedDB', () => {
    expect(getIDB()).toBeDefined();
  });
  it('should return the version of the indexedDB', async () => {
    await new Promise<void>(resolve => {
      const request = getIDB()!.open('db1', 2);
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
      request.onerror = () => {
        request.result.close();
      };
    });
    const version = await getIDBVersion('db1');
    expect(version).toBe(2);
  });
});

describe('workInVersionChange', () => {
  it('should work in version change', async () => {
    const before = vi.fn(() => {});
    const callback = vi.fn(() => {
      return 'abc';
    });
    const after = vi.fn(() => {});
    const result = await workInVersionChange('db1', before, callback, after);
    expect(before).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenNthCalledWith(1, 'abc');
    expect(result).toBe('abc');
  });
});
