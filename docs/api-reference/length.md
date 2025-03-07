# length Api

## Description

The `length` method returns the number of items in the storage.

## Usage

```ts
import storeage from 'storeage';

// Promise
const length = await storeage.length();
console.log(length);

// Callback
storeage.length(length => {
  console.log(length);
});
```

## Parameters

- **onSuccess**: `(length: number) => void` (optional)

> The callback function that will be called when the length is retrieved. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<number>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided
