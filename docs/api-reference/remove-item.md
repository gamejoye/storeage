# removeItem API

## Description

The `removeItem` method is used to remove an item from the storage. It deletes the item associated with the specified key.

## Usage

```ts
import storeage from 'storeage';

// Promise
await storeage.removeItem('user');

// Callback
storage.removeItem('user', () => {
  console.log('User removed successfully');
});
```

## Parameters

- **key**: `string`

> The key of the item to remove.

- **onSuccess**: `() => void` (optional)

> The callback function that will be called when the item is successfully removed. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<void>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided
