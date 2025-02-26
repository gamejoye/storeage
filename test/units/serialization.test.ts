import { describe, expect, it } from 'vitest';
import { deserialize, serialize } from '../../src/utils';
import { UnsupportedTypeError } from '../../src/errors';

describe('serialize and deserialize', () => {
  it('should be able to serialize and deserialize underlying type', () => {
    expect(deserialize(serialize(123))).toBe(123);
    expect(deserialize(serialize(123.456))).toBe(123.456);
    expect(deserialize(serialize('123'))).toBe('123');
    expect(deserialize(serialize(true))).toBe(true);
    expect(deserialize(serialize(false))).toBe(false);
    expect(deserialize(serialize(null))).toBeNull();
    expect(deserialize(serialize(undefined))).toBeNull();
    expect(deserialize(serialize(Boolean(false)))).toBe(false);
  });

  it('should be able to serialize and deserialize array', () => {
    expect(deserialize(serialize([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(deserialize(serialize([1, 2, '3']))).toEqual([1, 2, '3']);
    expect(deserialize(serialize([123.345, '2', null]))).toEqual([123.345, '2', null]);
  });

  it('should be able to serialize and deserialize object', () => {
    expect(deserialize(serialize({ a: 1, b: 2 }))).toEqual({ a: 1, b: 2 });
    expect(deserialize(serialize({ a: 1, b: '2' }))).toEqual({ a: 1, b: '2' });
    expect(deserialize(serialize({ a: 123.345, b: '2', c: null }))).toEqual({
      a: 123.345,
      b: '2',
      c: null,
    });
    expect(deserialize(serialize({ x: undefined }))).toEqual({});
  });

  it('should be able to serialize and deserialize array buffer', () => {
    const arrayBuffer = new ArrayBuffer(10);
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array[0] = 1;
    uint8Array[1] = 2;
    uint8Array[2] = 3;
    expect(deserialize(serialize(uint8Array.buffer))).toEqual(uint8Array.buffer);
  });

  it('should be able to serialize and deserialize float32 array', () => {
    const float32Array = new Float32Array([1, 2, 3]);
    expect(deserialize(serialize(float32Array))).toEqual(float32Array);
  });

  it('should be able to serialize and deserialize float64 array', () => {
    const float64Array = new Float64Array([1, 2, 3]);
    expect(deserialize(serialize(float64Array))).toEqual(float64Array);
  });

  it('should be able to serialize and deserialize int8 array', () => {
    const int8Array = new Int8Array([1, 2, 3]);
    expect(deserialize(serialize(int8Array))).toEqual(int8Array);
  });

  it('should be able to serialize and deserialize int16 array', () => {
    const int16Array = new Int16Array([1, 2, 3]);
    expect(deserialize(serialize(int16Array))).toEqual(int16Array);
  });

  it('should be able to serialize and deserialize int32 array', () => {
    const int32Array = new Int32Array([1, 2, 3]);
    expect(deserialize(serialize(int32Array))).toEqual(int32Array);
  });

  it('should be able to serialize and deserialize uint8 array', () => {
    const uint8Array = new Uint8Array([1, 2, 3]);
    expect(deserialize(serialize(uint8Array))).toEqual(uint8Array);
  });

  it('should be able to serialize and deserialize uint8 clamped array', () => {
    const uint8ClampedArray = new Uint8ClampedArray([1, 2, 3]);
    expect(deserialize(serialize(uint8ClampedArray))).toEqual(uint8ClampedArray);
  });

  it('should be able to serialize and deserialize uint16 array', () => {
    const uint16Array = new Uint16Array([1, 2, 3]);
    expect(deserialize(serialize(uint16Array))).toEqual(uint16Array);
  });

  it('should be able to serialize and deserialize uint32 array', () => {
    const uint32Array = new Uint32Array([1, 2, 3]);
    expect(deserialize(serialize(uint32Array))).toEqual(uint32Array);
  });

  it('should be able to serialize and deserialize blob', () => {
    // TODO: Implement
    const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
    expect(serialize(blob)).toBe('');
  });

  it('should be able to throw UnsupportedTypeError when serialize unsupported type', () => {
    expect(() => serialize(Symbol('test'))).toThrowError(UnsupportedTypeError);
    expect(() => serialize(() => {})).toThrowError(UnsupportedTypeError);
    expect(() => serialize(124124124124n)).toThrowError(UnsupportedTypeError);
  });

  it('should be able to work correctly without TextDecoder', () => {
    const TextDecoder = window.TextDecoder;
    // @ts-expect-error - TextDecoder is optional in window
    delete globalThis.TextDecoder;

    const arrayBuffer = new ArrayBuffer(10);
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array[0] = 1;
    uint8Array[1] = 2;
    uint8Array[2] = 3;
    expect(deserialize(serialize(uint8Array.buffer))).toEqual(uint8Array.buffer);

    globalThis.TextDecoder = TextDecoder;
  });
});
