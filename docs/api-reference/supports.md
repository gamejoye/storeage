# supports Api

## Description

The `supports` method is used to check if the storage supports a specific driver.

## Usage

```ts
import storeage, { INTERNAL_DRIVERS } from 'storeage';
const isSupported = storeage.supports(INTERNAL_DRIVERS.LOCALSTORAGE);
console.log(isSupported);
```

## Parameters

- **driverName**: `string`

> The name of the driver to check.

## Returns

- `boolean`
