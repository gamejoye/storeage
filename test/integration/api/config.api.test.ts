/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest';
import storeage, { ConfigOptions } from '../../../src';
import { ConfigError } from '../../../src/errors';

describe('config api', () => {
  it('should be able to config', async () => {
    const instance = storeage.createInstance();
    instance.defineDriver('customDriver', customDriver);
    instance.config({
      driver: ['customDriver'],
    });
    expect(instance.supports('customDriver')).toBe(true);
    const driverName = await instance.ready().then(() => instance.driver());
    expect(driverName).toBe('customDriverStorage');
  });

  it('should throw error when expirationTime invalid', () => {
    expect(() =>
      storeage.createInstance({
        expirationTime: NaN,
      })
    ).toThrow(ConfigError);

    expect(() =>
      storeage.createInstance({
        expirationTime: Infinity,
      })
    ).toThrow(ConfigError);

    expect(() =>
      storeage.createInstance({
        expirationTime: -1000,
      })
    ).toThrow(ConfigError);

    expect(() =>
      storeage.createInstance({
        expirationTime: -1,
      })
    ).toThrow(ConfigError);

    expect(() =>
      storeage.createInstance({
        expirationTime: 0,
      })
    ).toThrow(ConfigError);
  });
});

const customDriver = {
  driverName: 'customDriverStorage',
  config: function (options: ConfigOptions): void {},
  getItem: function <T>(key: string): Promise<T> {
    throw new Error('Function not implemented.');
  },
  setItem: function <T>(key: string, value: T): Promise<T> {
    throw new Error('Function not implemented.');
  },
  removeItem: function (key: string): Promise<void> {
    throw new Error('Function not implemented.');
  },
  clear: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  length: function (): Promise<number> {
    throw new Error('Function not implemented.');
  },
  keys: function (): Promise<string[]> {
    throw new Error('Function not implemented.');
  },
  iterate: function <T, U>(
    callback: (key: string, value: T, index: number) => U | void
  ): Promise<U | void> {
    throw new Error('Function not implemented.');
  },
  drop: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  supports: function (): boolean {
    return true;
  },
  ready: function (): Promise<void> {
    return Promise.resolve();
  },
};
