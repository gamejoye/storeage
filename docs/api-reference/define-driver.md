# defineDriver Api

## Description

The `defineDriver` method is used to define a new driver.

## Usage

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

the more details about the driver, please refer to the implementation

- [localstorage driver](https://github.com/gamejoye/storeage/blob/main/src/drivers/localstorage.ts)
- [indexeddb driver](https://github.com/gamejoye/storeage/blob/main/src/drivers/idb.ts)

## Parameters

- **driverName**: `string`

> The name of the driver used in storeage internal.

- **driver**: `IDriver`

> The driver to be defined.

## Returns

- `void`
