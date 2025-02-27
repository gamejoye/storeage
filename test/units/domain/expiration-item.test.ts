import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExpirationItem } from '../../../src/value-objects/expiration-item';

describe('ExpirationItem', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to create an expiration item', () => {
    const now = new Date().getTime();
    const expirationItem = new ExpirationItem('test', 1000);
    expect(expirationItem.value).toBe('test');

    vi.setSystemTime(now + 500);
    expect(expirationItem.isExpired()).toBe(false);
    expect(expirationItem.value).toBe('test');

    vi.setSystemTime(now + 1500);
    expect(expirationItem.isExpired()).toBe(true);
    expect(expirationItem.value).toBeNull();
  });

  it('should be able to create an expiration item from a string', () => {
    const expirationItem = new ExpirationItem('test');
    expect(ExpirationItem.fromString(expirationItem.toString())).toEqual(expirationItem);
  });

  it('should be able to create an expiration item from a JSON string', () => {
    const expirationItem = new ExpirationItem('test');
    expect(ExpirationItem.fromJSON(expirationItem.toJSON())).toEqual(expirationItem);
  });

  it('should throw an error when passing a valid expiration', () => {
    expect(() => new ExpirationItem('test', 'invalid')).toThrow();

    expect(() => new ExpirationItem('test', 0)).toThrow();
    expect(() => new ExpirationItem('test', -1)).toThrow();
    expect(() => new ExpirationItem('test', -1000)).toThrow();
    expect(() => new ExpirationItem('test', -1000000)).toThrow();
    expect(() => new ExpirationItem('test', -1000000000)).toThrow();
    expect(() => new ExpirationItem('test', -1000000000000)).toThrow();
    expect(() => new ExpirationItem('test', -1000000000000000)).toThrow();
  });

  it('should throw an error when passing a invalid string to fromString', () => {
    expect(() => ExpirationItem.fromString('invalid')).toThrow();
  });
});
