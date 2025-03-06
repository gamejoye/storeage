import { describe, expect, it } from 'vitest';
import { parse, stringify } from '../../../src/utils/json';
import { UnsupportedTypeError } from '../../../src/errors';

describe('json', () => {
  it('should be able to stringify and parse underlying type', async () => {
    expect(parse(await stringify(123))).toBe(123);
    expect(parse(await stringify(123.456))).toBe(123.456);
    expect(parse(await stringify('123'))).toBe('123');
    expect(parse(await stringify(true))).toBe(true);
    expect(parse(await stringify(false))).toBe(false);
    expect(parse(await stringify(null))).toBeNull();
    expect(parse(await stringify(undefined))).toBeNull();
    expect(parse(await stringify(Boolean(false)))).toBe(false);
  });

  it('should be able to stringify and parse array', async () => {
    console.log(await stringify([1, 2, 3]));
    expect(parse(await stringify([1, 2, 3]))).toEqual([1, 2, 3]);
    expect(parse(await stringify([1, 2, '3']))).toEqual([1, 2, '3']);
    expect(parse(await stringify([123.345, '2', null]))).toEqual([123.345, '2', null]);
  });

  it('should be able to stringify and parse object', async () => {
    expect(parse(await stringify({ a: 1, b: 2 }))).toEqual({ a: 1, b: 2 });
    expect(parse(await stringify({ a: 1, b: '2' }))).toEqual({ a: 1, b: '2' });
    expect(
      parse(
        await stringify({
          a: 123.345,
          b: '2',
          c: null,
          你: 'test\t',
          '\t\\"why': '\\"why\\"?',
          "'abc": "'abc'",
        })
      )
    ).toEqual({
      a: 123.345,
      b: '2',
      c: null,
      你: 'test\t',
      '\t\\"why': '\\"why\\"?',
      "'abc": "'abc'",
    });
    expect(parse(await stringify({ x: undefined }))).toEqual({ x: null });
  });

  it('should be able to stringify and parse array buffer', async () => {
    const arrayBuffer = new ArrayBuffer(10);
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array[0] = 1;
    uint8Array[1] = 2;
    uint8Array[2] = 3;
    expect(parse(await stringify(uint8Array.buffer))).toEqual(uint8Array.buffer);
  });

  it('should be able to stringify and parse float32 array', async () => {
    const float32Array = new Float32Array([1, 2, 3]);
    expect(parse(await stringify(float32Array))).toEqual(float32Array);
  });

  it('should be able to stringify and parse float64 array', async () => {
    const float64Array = new Float64Array([1, 2, 3]);
    expect(parse(await stringify(float64Array))).toEqual(float64Array);
  });

  it('should be able to stringify and parse int8 array', async () => {
    const int8Array = new Int8Array([1, 2, 3]);
    expect(parse(await stringify(int8Array))).toEqual(int8Array);
  });

  it('should be able to stringify and parse int16 array', async () => {
    const int16Array = new Int16Array([1, 2, 3]);
    expect(parse(await stringify(int16Array))).toEqual(int16Array);
  });

  it('should be able to stringify and parse int32 array', async () => {
    const int32Array = new Int32Array([1, 2, 3]);
    expect(parse(await stringify(int32Array))).toEqual(int32Array);
  });

  it('should be able to stringify and parse uint8 array', async () => {
    const uint8Array = new Uint8Array([1, 2, 3]);
    expect(parse(await stringify(uint8Array))).toEqual(uint8Array);
  });

  it('should be able to stringify and parse uint8 clamped array', async () => {
    const uint8ClampedArray = new Uint8ClampedArray([1, 2, 3]);
    expect(parse(await stringify(uint8ClampedArray))).toEqual(uint8ClampedArray);
  });

  it('should be able to stringify and parse uint16 array', async () => {
    const uint16Array = new Uint16Array([1, 2, 3]);
    expect(parse(await stringify(uint16Array))).toEqual(uint16Array);
  });

  it('should be able to stringify and parse uint32 array', async () => {
    const uint32Array = new Uint32Array([1, 2, 3]);
    expect(parse(await stringify(uint32Array))).toEqual(uint32Array);
  });

  it('should be able to stringify and parse blob', async () => {
    const textPlainBlob = new Blob(['Hello, world!'], { type: 'text/plain' });
    const parsed = parse(await stringify(textPlainBlob));
    expect(textPlainBlob.type).toBe(parsed.type);
    expect(parsed.size).toBe(textPlainBlob.size);
    expect(await getBlobText(parsed)).toEqual(await getBlobText(textPlainBlob));

    const textHtmlBlob = new Blob(['<html><body>Hello, world!</body></html>'], {
      type: 'text/html',
    });
    const parsedHtml = parse(await stringify(textHtmlBlob));
    expect(textHtmlBlob.type).toBe(parsedHtml.type);
    expect(parsedHtml.size).toBe(textHtmlBlob.size);
    expect(await getBlobText(parsedHtml)).toEqual(await getBlobText(textHtmlBlob));

    const imageBlob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
    const parsedImage = parse(await stringify(imageBlob));
    expect(imageBlob.type).toBe(parsedImage.type);
    expect(parsedImage.size).toBe(imageBlob.size);
    expect(await getBlobText(parsedImage)).toEqual(await getBlobText(imageBlob));
  });

  it('should be able to stringify and parse bigint', async () => {
    const bigint = 12345678910n;
    expect(parse(await stringify(bigint))).toBe(bigint);
  });

  it('should be able to throw UnsupportedTypeError when stringify unsupported type', async () => {
    await expect(() => stringify(Symbol('test'))).rejects.toThrowError(UnsupportedTypeError);
    await expect(() => stringify(() => {})).rejects.toThrowError(UnsupportedTypeError);
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
    expect(parse(await stringify(uint8Array.buffer))).toEqual(uint8Array.buffer);

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
