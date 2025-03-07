# keys Api

## Description

The `keys` method returns an array of all keys in the storage.

## Usage

```ts
import storeage from 'storeage';

// Promise
const keys = await storeage.keys();
console.log(keys);

// Callback
storeage.keys(keys => {
  console.log(keys);
});
```

## Parameters

- **onSuccess**: `(keys: string[]) => void` (optional)

> The callback function that will be called when the keys are retrieved. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<string[]>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided
