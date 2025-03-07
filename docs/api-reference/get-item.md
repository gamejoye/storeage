# getItem Api

## Description

The `getItem` method is used to retrieve an item from the storage. It supports generics to provide type safety for the retrieved data.

## Usage

```ts
import storeage from 'storeage';

// Promise
const item = await storeage.getItem<string>('key');

// Callback
storeage.getItem<string>('key', item => {
  console.log(item);
});
```

## Parameters

- **key**: `string`

> The key of the item to retrieve.

- **onSuccess**: `(item: T | null) => void` (optional)

> The callback function that will be called when the item is retrieved. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<T | null>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided

Where `T` is the generic type parameter representing the type of the stored item.
