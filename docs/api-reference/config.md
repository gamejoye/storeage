# config Api

## Description

The `config` method is used to configure the storage.
This method should be called before Data-Related API:

- [`setItem`](/api-reference/set-item.md)
- [`getItem`](/api-reference/get-item.md)
- [`removeItem`](/api-reference/remove-item.md)
- [`clear`](/api-reference/clear.md)
- [`length`](/api-reference/length.md)
- [`keys`](/api-reference/keys.md)
- [`iterate`](/api-reference/iterate.md)

## Usage

```ts
import storeage, { INTERNAL_DRIVERS } from 'storeage';

storeage.config({ driver: [INTERNAL_DRIVERS.LOCALSTORAGE] });
```

## Parameters

- **options**: `{ name?: string, storeName?: string, driver?: string[], expirationTime?: number }` (optional)
  - **name**: `string` (optional)
    > The name of the storage.
  - **storeName**: `string` (optional)
    > The name of the store.
  - **driver**: `string[]` (optional)
    > The drivers to use.
  - **expirationTime**: `number` (optional)
    > The expiration time of the storage.

> The options to configure the storage.

## Returns

- `void`
