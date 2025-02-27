import { describe, expect, it, vi } from 'vitest';
import { once } from '../../../src/utils';

describe('once', () => {
  it('should call the function only once', () => {
    const add = vi.fn((a: number, b: number) => a + b);
    const fn = once(add);
    expect(fn(1, 2)).toBe(3);
    expect(fn(1, 2)).toBe(3);
    expect(add).toHaveBeenCalledTimes(1);
  });
});
