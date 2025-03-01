import { describe, expect, it } from 'vitest';
import { deserialize, serialize } from '../../../src/utils';
import { UnsupportedTypeError } from '../../../src/errors';

describe('serialize and deserialize', () => {
  it('should be able to serialize and deserialize underlying type', async () => {
    expect(deserialize(await serialize(123))).toBe(123);
    expect(deserialize(await serialize(123.456))).toBe(123.456);
    expect(deserialize(await serialize('123'))).toBe('123');
    expect(deserialize(await serialize(true))).toBe(true);
    expect(deserialize(await serialize(false))).toBe(false);
    expect(deserialize(await serialize(null))).toBeNull();
    expect(deserialize(await serialize(undefined))).toBeNull();
    expect(deserialize(await serialize(Boolean(false)))).toBe(false);
  });

  it('should be able to serialize and deserialize array', async () => {
    expect(deserialize(await serialize([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(deserialize(await serialize([1, 2, '3']))).toEqual([1, 2, '3']);
    expect(deserialize(await serialize([123.345, '2', null]))).toEqual([123.345, '2', null]);
  });

  it('should be able to serialize and deserialize object', async () => {
    expect(deserialize(await serialize({ a: 1, b: 2 }))).toEqual({ a: 1, b: 2 });
    expect(deserialize(await serialize({ a: 1, b: '2' }))).toEqual({ a: 1, b: '2' });
    expect(deserialize(await serialize({ a: 123.345, b: '2', c: null }))).toEqual({
      a: 123.345,
      b: '2',
      c: null,
    });
    expect(deserialize(await serialize({ x: undefined }))).toEqual({});
  });

  it('should be able to serialize and deserialize array buffer', async () => {
    const arrayBuffer = new ArrayBuffer(10);
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array[0] = 1;
    uint8Array[1] = 2;
    uint8Array[2] = 3;
    expect(deserialize(await serialize(uint8Array.buffer))).toEqual(uint8Array.buffer);
  });

  it('should be able to serialize and deserialize float32 array', async () => {
    const float32Array = new Float32Array([1, 2, 3]);
    expect(deserialize(await serialize(float32Array))).toEqual(float32Array);
  });

  it('should be able to serialize and deserialize float64 array', async () => {
    const float64Array = new Float64Array([1, 2, 3]);
    expect(deserialize(await serialize(float64Array))).toEqual(float64Array);
  });

  it('should be able to serialize and deserialize int8 array', async () => {
    const int8Array = new Int8Array([1, 2, 3]);
    expect(deserialize(await serialize(int8Array))).toEqual(int8Array);
  });

  it('should be able to serialize and deserialize int16 array', async () => {
    const int16Array = new Int16Array([1, 2, 3]);
    expect(deserialize(await serialize(int16Array))).toEqual(int16Array);
  });

  it('should be able to serialize and deserialize int32 array', async () => {
    const int32Array = new Int32Array([1, 2, 3]);
    expect(deserialize(await serialize(int32Array))).toEqual(int32Array);
  });

  it('should be able to serialize and deserialize uint8 array', async () => {
    const uint8Array = new Uint8Array([1, 2, 3]);
    expect(deserialize(await serialize(uint8Array))).toEqual(uint8Array);
  });

  it('should be able to serialize and deserialize uint8 clamped array', async () => {
    const uint8ClampedArray = new Uint8ClampedArray([1, 2, 3]);
    expect(deserialize(await serialize(uint8ClampedArray))).toEqual(uint8ClampedArray);
  });

  it('should be able to serialize and deserialize uint16 array', async () => {
    const uint16Array = new Uint16Array([1, 2, 3]);
    expect(deserialize(await serialize(uint16Array))).toEqual(uint16Array);
  });

  it('should be able to serialize and deserialize uint32 array', async () => {
    const uint32Array = new Uint32Array([1, 2, 3]);
    expect(deserialize(await serialize(uint32Array))).toEqual(uint32Array);
  });

  it('should be able to serialize and deserialize blob', async () => {
    const textPlainBlob = new Blob(['Hello, world!'], { type: 'text/plain' });
    const deserialized = deserialize(await serialize(textPlainBlob));
    expect(textPlainBlob.type).toBe(deserialized.type);
    expect(deserialized.size).toBe(textPlainBlob.size);
    expect(await getBlobText(deserialized)).toEqual(await getBlobText(textPlainBlob));

    const textHtmlBlob = new Blob(['<html><body>Hello, world!</body></html>'], {
      type: 'text/html',
    });
    const deserializedHtml = deserialize(await serialize(textHtmlBlob));
    expect(textHtmlBlob.type).toBe(deserializedHtml.type);
    expect(deserializedHtml.size).toBe(textHtmlBlob.size);
    expect(await getBlobText(deserializedHtml)).toEqual(await getBlobText(textHtmlBlob));

    const imageBlob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
    const deserializedImage = deserialize(await serialize(imageBlob));
    expect(imageBlob.type).toBe(deserializedImage.type);
    expect(deserializedImage.size).toBe(imageBlob.size);
    expect(await getBlobText(deserializedImage)).toEqual(await getBlobText(imageBlob));
  });

  it('should be able to throw UnsupportedTypeError when serialize unsupported type', async () => {
    await expect(() => serialize(Symbol('test'))).rejects.toThrowError(UnsupportedTypeError);
    await expect(() => serialize(() => {})).rejects.toThrowError(UnsupportedTypeError);
    await expect(() => serialize(124124124124n)).rejects.toThrowError(UnsupportedTypeError);
  });

  it('should be able to work correctly without TextDecoder', async () => {
    const TextDecoder = window.TextDecoder;
    // @ts-expect-error - TextDecoder is optional in window
    delete globalThis.TextDecoder;

    const arrayBuffer = new ArrayBuffer(10);
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array[0] = 1;
    uint8Array[1] = 2;
    uint8Array[2] = 3;
    expect(deserialize(await serialize(uint8Array.buffer))).toEqual(uint8Array.buffer);

    globalThis.TextDecoder = TextDecoder;
  });
});

function getBlobText(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob, 'utf-8');
  });
}
