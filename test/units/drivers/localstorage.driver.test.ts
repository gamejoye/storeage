import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import LocalStorageDriver from '../../../src/drivers/localstorage';
import { DroppedError } from '../../../src/errors';

describe('localstorage driver', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const instance = new LocalStorageDriver();
    return instance.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to get item and set item', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    const value = await instance.getItem('test');
    expect(value).toBe('test');
  });

  it('should be able to remove item', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.removeItem('test');
    const value = await instance.getItem('test');
    expect(value).toBeNull();
  });

  it('should be able to clear all items', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    await instance.clear();
    const value = await instance.getItem('test');
    expect(value).toBeNull();
    const value2 = await instance.getItem('test2');
    expect(value2).toBeNull();
  });

  it('should be able to get length', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const length = await instance.length();
    expect(length).toBe(2);
  });

  it('should be able to get keys', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const keys = await instance.keys();
    expect(keys).toContain('test');
    expect(keys).toContain('test2');
  });

  it('should be able to iterate', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.setItem('test2', 'test2');
    const result: { key: string; value: string }[] = [];
    await instance.iterate<string, any>((key, value) => {
      result.push({ key, value });
    });
    expect(result).toContainEqual({ key: 'test', value: 'test' });
    expect(result).toContainEqual({ key: 'test2', value: 'test2' });

    const items: { key: string; value: string }[] = [];
    const item = await instance.iterate<string, any>((key, value) => {
      items.push({ key, value });
      return { key, value };
    });
    expect(items).toContainEqual(item);
    expect(items.length).toBe(1);
  });

  it('should be able to drop', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    await instance.drop();
    await expect(() => instance.getItem('test')).rejects.toThrowError(DroppedError);

    const sameInstance = new LocalStorageDriver();
    const value = await sameInstance.ready().then(() => sameInstance.getItem('test'));
    expect(value).toBeNull();
  });

  it('should be able to set item with expiration', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test', 1000);
    const now = new Date().getTime();

    vi.setSystemTime(now + 500);
    const value = await instance.getItem('test');
    expect(value).toBe('test');

    vi.setSystemTime(now + 2000);
    const valueToBeExpired = await instance.getItem('test');
    expect(valueToBeExpired).toBeNull();
  });

  it('should be able to store different types of data', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    await instance.setItem('test', 'test');
    expect(await instance.getItem('test')).toBe('test');

    await instance.setItem('test2', 123);
    expect(await instance.getItem('test2')).toBe(123);

    await instance.setItem('test3', { a: 1, b: 2 });
    expect(await instance.getItem('test3')).toEqual({ a: 1, b: 2 });

    await instance.setItem('test4', [1, 2, 3]);
    expect(await instance.getItem('test4')).toEqual([1, 2, 3]);

    await instance.setItem('test5', new ArrayBuffer(5));
    const test5 = await instance.getItem<ArrayBuffer>('test5');
    expect(new Uint8Array(test5!)).toEqual(new Uint8Array([0, 0, 0, 0, 0]));

    await instance.setItem('test6', true);
    expect(await instance.getItem('test6')).toBe(true);

    await instance.setItem('test7', null);
    expect(await instance.getItem('test7')).toBeNull();

    await instance.setItem('test8', undefined);
    expect(await instance.getItem('test8')).toBeNull();

    await instance.setItem('test9', new Float32Array([1, 2, 3]));
    const test9 = await instance.getItem<Float32Array>('test9');
    expect(test9).toEqual(new Float32Array([1, 2, 3]));

    await instance.setItem('test10', new Uint8ClampedArray([1, 2, 3]));
    const test10 = await instance.getItem<Uint8ClampedArray>('test10');
    expect(test10).toEqual(new Uint8ClampedArray([1, 2, 3]));

    await instance.setItem('test11', new Int8Array([1, 2, 3]));
    const test11 = await instance.getItem<Int8Array>('test11');
    expect(test11).toEqual(new Int8Array([1, 2, 3]));

    await instance.setItem('test12', new Int16Array([1, 2, 3]));
    const test12 = await instance.getItem<Int16Array>('test12');
    expect(test12).toEqual(new Int16Array([1, 2, 3]));

    await instance.setItem('test13', new Int32Array([551, 412, 34124]));
    const test13 = await instance.getItem<Int32Array>('test13');
    expect(test13).toEqual(new Int32Array([551, 412, 34124]));

    await instance.setItem('test14', new Uint32Array([551, 412, 34124]));
    const test14 = await instance.getItem<Uint32Array>('test14');
    expect(test14).toEqual(new Uint32Array([551, 412, 34124]));

    await instance.setItem('test15', new Uint8Array([1, 2, 3]));
    const test15 = await instance.getItem<Uint8Array>('test15');
    expect(test15).toEqual(new Uint8Array([1, 2, 3]));

    await instance.setItem('test16', new Float64Array([1, 2, 3]));
    const test16 = await instance.getItem<Float64Array>('test16');
    expect(test16).toEqual(new Float64Array([1, 2, 3]));

    await instance.setItem('test17', new Uint16Array([1, 2, 3]));
    const test17 = await instance.getItem<Uint16Array>('test17');
    expect(test17).toEqual(new Uint16Array([1, 2, 3]));

    await instance.setItem('test18', 12345678910n);
    const test18 = await instance.getItem<bigint>('test18');
    expect(test18).toBe(12345678910n);
  });

  it('should be able to store complex json data', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    const complexJSON = {
      a: 1,
      d: {
        e: 4,
        f: 5,
      },
      g: [6, 7, 8],
      h: {
        i: 9,
        j: 10,
        k: 'test',
      },
      k: 'test',
      ui: Uint8Array.from([1, 2, 3]),
      u8: new Uint8Array([1, 2, 3]),
      u16: new Uint16Array([1, 2, 3]),
      u32: new Uint32Array([1, 2, 3]),
      i8: new Int8Array([1, 2, 3]),
      i16: new Int16Array([1, 2, 3]),
      i32: new Int32Array([1, 2, 3]),
      obj: {
        a: 1,
        ui: Uint8Array.from([1, 2, 3]),
        ab: new ArrayBuffer(5),
        bn: 12345678910n,
      },
      arr: [
        {
          a: 1,
          ui: Uint8Array.from([1, 2, 3]),
          ab: new ArrayBuffer(5),
          commonArr: [
            1,
            2,
            '3',
            null,
            true,
            false,
            124124n,
            123.345,
            { a: 1, b: 2 },
            new Uint8Array([1, 2, 3]),
            new Int8Array([1, 2, 3]),
            new Int16Array([1, 2, 3]),
            new Int32Array([1, 2, 3]),
            new Uint16Array([1, 2, 3]),
            new Uint32Array([1, 2, 3]),
            new Float32Array([1, 2, 3]),
            new Float64Array([1, 2, 3]),
          ],
        },
      ],
    };
    await instance.setItem('test', complexJSON);
    const test = await instance.getItem<typeof complexJSON>('test');
    expect(test).toEqual(complexJSON);
  });

  it('should covert undefined to null', async () => {
    const instance = new LocalStorageDriver();
    await instance.ready();
    const json = {
      a: undefined,
      b: [undefined, undefined],
      c: {
        a: undefined,
        b: [undefined, undefined],
      },
      e: 'undefined',
    };
    await instance.setItem('test', json);
    const test = await instance.getItem('test');
    expect(test).toEqual({
      a: null,
      b: [null, null],
      c: {
        a: null,
        b: [null, null],
      },
      e: 'undefined',
    });
  });
});
