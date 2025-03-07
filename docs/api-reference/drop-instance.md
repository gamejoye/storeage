# dropInstance Api

## Description

The `dropInstance` method is used to drop the instance of the storage.

## Usage

```ts
import storeage from 'storeage';

const instance = storeage.createInstance();

await instance.dropInstance();

instance.getItem('key'); // throw error
```

## Parameters

- **options**: `{ name?: string, storeName?: string }` (optional)

> The options to drop the instance.

> If not provided, the instance will be dropped. ✅

> If provided the name and storeName, the instance will be dropped by the name and storeName. ✅

> If provided the name, nothings will be dropped. ⚠️

> If provided the storeName, throw error. ❌

## Returns

- `Promise<void>`
