/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from 'vitest';
import storeage, { ConfigOptions } from '../../../src';
import { INTERNAL_DRIVERS } from '../../../src/constants';
import { ConfigError } from '../../../src/errors';

describe('defineDriver', () => {
  it('should define a driver', () => {
    const instance = storeage.createInstance();
    instance.defineDriver('MyCustomDriver', customDriver);
    expect(instance.supports('MyCustomDriver')).toBe(true);
  });

  it('should throw error when driver already defined', () => {
    const instance = storeage.createInstance();
    expect(() => instance.defineDriver(INTERNAL_DRIVERS.IDB, customDriver)).toThrow(ConfigError);
  });
});

const customDriver = {
  driverName: INTERNAL_DRIVERS.IDB,
  config: function (options: ConfigOptions): void {
    throw new Error('Function not implemented.');
  },
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
    throw new Error('Function not implemented.');
  },
};
