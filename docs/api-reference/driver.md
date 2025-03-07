# driver Api

## Description

The `driver` method returns the driver instance **name**.

## Usage

```ts
import storeage from 'storeage';

const driverName = storeage.driver();
console.log(driverName);
```

## Parameters

> none

## Returns

- `string`
- `null` - When the driver is not set
