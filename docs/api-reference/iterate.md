# iterate Api

## Description

The `iterate` method allows you to iterate over all items in the storage (supports early stop).

## Usage

```ts
import storeage from 'storeage';

// Promise with stop condition
const result = await storeage.iterate<number, string>((key, value) => {
  console.log(key, value);
  if (value > 10) {
    // return a non-undefined value to stop iteration
    return 'stop';
  }
});

// without stop condition
const result = await storeage.iterate<number, string>((key, value) => {
  console.log(key, value);
});
console.log(result);
// result is undefined

// Callback
storeage.iterate<number, string>(
  (key, value) => {
    console.log(key, value);
    if (value > 10) {
      // return a non-undefined value to stop iteration
      return 'stop';
    }
  },
  result => {
    console.log(result);
    // result is 'stop'
  }
);
```

## Parameters

- **callback**: `(key: string, value: T) => U | void`

> The callback function that will be called for each item in the storage.

- **onSuccess**: `(result: U | void) => void` (optional)

> The callback function that will be called when the iteration is complete. If provided, the method returns void instead of a Promise.

## Returns

- `Promise<U | void>` - When `onSuccess` callback is not provided
- `void` - When `onSuccess` callback is provided

Where `T` is the generic type parameter representing the type of the stored item.

Where `U` is the generic type parameter representing the type of the callback return value.
