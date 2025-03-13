# defineDriver Api

## 描述

`defineDriver` 方法用于定义一个新的驱动

## 用法

```ts
import storeage, { type IDriver } from 'storeage';

const myDriver: IDriver = {
  driverName: 'my-driver',
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
storeage.defineDriver('my-driver-only-used-in-storeage-internal', myDriver);
```

关于更多关于driver的信息，可以查看以下实现

- [localstorage driver](https://github.com/gamejoye/storeage/blob/main/src/drivers/localstorage.ts)
- [indexeddb driver](https://github.com/gamejoye/storeage/blob/main/src/drivers/idb.ts)

## 参数

- **driverName**: `string`

> 在storeage内部使用的name，该值与调用driver返回的字符串并不一致

- **driver**: `IDriver`

> 驱动实现.

## 返回值

- `void`
