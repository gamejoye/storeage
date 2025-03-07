import {
  ARRAY_BUFFER_PREFIX,
  BIGINT_PREFIX,
  BLOB_PREFIX,
  FLOAT32_ARRAY_PREFIX,
  FLOAT64_ARRAY_PREFIX,
  INT16_ARRAY_PREFIX,
  INT32_ARRAY_PREFIX,
  INT8_ARRAY_PREFIX,
  UINT16_ARRAY_PREFIX,
  UINT32_ARRAY_PREFIX,
  UINT8_ARRAY_PREFIX,
  UINT8_CLAMPED_ARRAY_PREFIX,
} from '../constants';
import { InternalError, UnsupportedTypeError } from '../errors';

const stringifyPrefixMap = {
  '[object Float32Array]': FLOAT32_ARRAY_PREFIX,
  '[object Float64Array]': FLOAT64_ARRAY_PREFIX,
  '[object Int8Array]': INT8_ARRAY_PREFIX,
  '[object Int16Array]': INT16_ARRAY_PREFIX,
  '[object Int32Array]': INT32_ARRAY_PREFIX,
  '[object Uint8Array]': UINT8_ARRAY_PREFIX,
  '[object Uint8ClampedArray]': UINT8_CLAMPED_ARRAY_PREFIX,
  '[object Uint16Array]': UINT16_ARRAY_PREFIX,
  '[object Uint32Array]': UINT32_ARRAY_PREFIX,
};

export async function stringify(value: any): Promise<string> {
  try {
    if (typeof value === 'symbol') throw new UnsupportedTypeError('Symbol is not supported');
    if (typeof value === 'function') throw new UnsupportedTypeError('Function is not supported');

    if ([undefined, null].includes(value)) {
      return 'null';
    }
    const valueType = Object.prototype.toString.call(value);
    if (valueType === '[object ArrayBuffer]') {
      return ARRAY_BUFFER_PREFIX + bufferToString(value);
    } else if (valueType === '[object Blob]') {
      return BLOB_PREFIX + '"' + (value as Blob).type + '_' + (await blobToString(value)) + '"';
    } else if (valueType === '[object BigInt]') {
      return BIGINT_PREFIX + '"' + value + '"';
    } else {
      const prefix = stringifyPrefixMap[valueType as keyof typeof stringifyPrefixMap];
      if (prefix) {
        return prefix + JSON.stringify(Array.from(value));
      }
    }
    if (Array.isArray(value)) {
      const promises = value.map(o => stringify(o));
      return `[${(await Promise.all(promises)).join(',')}]`;
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const promises = keys.map(
        async k =>
          `"${k.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}":${await stringify(value[k])}`
      );
      return `{${(await Promise.all(promises)).join(',')}}`;
    }
    if (typeof value === 'string')
      return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
    return value + '';
  } catch (e) {
    throw new UnsupportedTypeError('Unknown type' + e);
  }
}

const parsePrefixMap = {
  [ARRAY_BUFFER_PREFIX]: (str: Array<number>) => new Uint8Array(str).buffer,
  [FLOAT32_ARRAY_PREFIX]: (str: Array<number>) => new Float32Array(str),
  [FLOAT64_ARRAY_PREFIX]: (str: Array<number>) => new Float64Array(str),
  [INT8_ARRAY_PREFIX]: (str: Array<number>) => new Int8Array(str),
  [INT16_ARRAY_PREFIX]: (str: Array<number>) => new Int16Array(str),
  [INT32_ARRAY_PREFIX]: (str: Array<number>) => new Int32Array(str),
  [UINT8_ARRAY_PREFIX]: (str: Array<number>) => new Uint8Array(str),
  [UINT8_CLAMPED_ARRAY_PREFIX]: (str: Array<number>) => new Uint8ClampedArray(str),
  [UINT16_ARRAY_PREFIX]: (str: Array<number>) => new Uint16Array(str),
  [UINT32_ARRAY_PREFIX]: (str: Array<number>) => new Uint32Array(str),
  [BLOB_PREFIX]: (str: string) => {
    const index = str.indexOf('_');
    if (index === -1) {
      throw new InternalError('Failed to deserialize value: ' + str);
    }
    const type = str.substring(0, index);
    const dataStr = str.substring(index + 1);
    const data = JSON.parse(dataStr);
    return new Blob([new Uint8Array(data).buffer], { type });
  },
  [BIGINT_PREFIX]: (str: string) => BigInt(str),
};

export function parse(str: string): any {
  let index = 0;
  const set = new Set('-0123456789.');
  const getKey = () => {
    let key = '';
    index++;
    while (str[index] != '"') {
      if (str[index] === '\\') {
        index++;
        key += str[index++];
      } else {
        key += str[index++];
      }
    }
    index++;
    return key;
  };
  const dfs: () => any = () => {
    for (const [prefix, handler] of Object.entries(parsePrefixMap)) {
      if (str.substring(index, index + prefix.length) === prefix) {
        index += prefix.length;
        return handler(dfs());
      }
    }
    if (str[index] === 'f') {
      index += 5;
      return false;
    }
    if (str[index] === 't') {
      index += 4;
      return true;
    }
    if (str[index] === 'n') {
      index += 4;
      return null;
    }
    if (str[index] === '"') {
      index++;
      let strS = '';
      while (str[index] != '"') {
        if (str[index] === '\\') {
          index++;
          strS += str[index++];
        } else {
          strS += str[index++];
        }
      }
      index++;
      return strS;
    }
    if (set.has(str[index])) {
      let numS = '';
      while (set.has(str[index])) {
        numS += str[index++];
      }
      return +numS;
    }
    if (str[index] === '[') {
      if (str[index + 1] === ']') {
        index += 2;
        return [];
      }
      const res = [];
      index++;
      while (index < str.length) {
        res.push(dfs());
        if (str[index] === ']') {
          break;
        }
        index++;
      }
      index++;
      return res;
    }
    if (str[index + 1] === '}') {
      index += 2;
      return {};
    }
    const res: any = {};
    index++;
    while (index < str.length) {
      const key = getKey();
      index++;
      res[key] = dfs();
      if (str[index] === '}') {
        break;
      }
      index++;
    }
    index++;
    return res;
  };
  return dfs();
}

function bufferToString(buffer: ArrayBuffer): string {
  return JSON.stringify(Array.from(new Uint8Array(buffer)));
}

function blobToString(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ab = reader.result as ArrayBuffer;
      resolve(JSON.stringify(Array.from(new Uint8Array(ab))));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
