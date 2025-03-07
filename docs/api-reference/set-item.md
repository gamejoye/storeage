# setItem API

## Description

The `setItem` method is used to set an item in the storage. It supports generics to provide type safety for the stored data and allows setting an optional expiration time for items.

## Usage

```ts
import storeage from 'storeage';

// Promise
const item = await storeage.setItem<User>('user', { name: 'John', age: 20 });

// With expiration time
const item = await storage.setItem<User>('user', { name: 'John', age: 20 }, 1000 * 60 * 60); // expires in 1 hour

// With callback
storage.setItem<User>('user', { name: 'John', age: 20 }, savedItem => {
  console.log(savedItem.name);
});

// With expiration time and callback
storage.setItem<User>('user', { name: 'John', age: 20 }, 3600, savedItem => {
  console.log(savedItem.name);
});
```

## Parameters

- **key**: `string`

> The key of the item to store.

- **value**: `T`

> The value of the item to set.

- **expirationTime**: `number` (optional)

> The expiration time of the item in seconds.

- **onSuccess**: `(value: T) => void` (optional)

> The callback function that will be called with the stored item. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<T>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided

Where `T` is the generic type parameter representing the type of the stored item.
