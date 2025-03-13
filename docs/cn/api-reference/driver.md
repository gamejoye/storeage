# driver Api

## 描述

`driver` 方法返回驱动实例的名字

## 使用

```ts
import storeage from 'storeage';

const driverName = storeage.driver();
console.log(driverName);
```

## 参数

> 无

## 返回值

- `string`
- `null` - 当driver还未准备好时
