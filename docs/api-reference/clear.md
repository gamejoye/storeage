# clear Api

## Description

The `clear` method is used to remove all items from the storage.

## Usage

```ts
import storeage from 'storeage';

// Promise
await storeage.clear();

// Callback
storeage.clear(() => {
  console.log('All items removed successfully');
});
```

## Parameters

- **onSuccess**: `() => void` (optional)

> The callback function that will be called when the item is retrieved. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<void>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided
