# createInstance Api

## Description

The `createInstance` method is used to create a new instance of the storage.

## Usage

```ts
import storeage, { INTERNAL_DRIVERS } from 'storeage';

const instance = storeage.createInstance({
  storeName: 'my-store',
  driver: [INTERNAL_DRIVERS.LOCALSTORAGE],
});
```

## Parameters

- **options**: `{ name?: string, storeName?: string, driver?: string[] }` (optional)

> The options to configure the storage.

## Returns

- `typeof storeage`
