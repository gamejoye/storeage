# setItem API

## 描述

`setItem` 方法用于在存储中设置一个项目。它支持泛型以提供存储数据的类型安全，并允许为项目设置可选的过期时间。

## 用法

```ts
import storeage from 'storeage';

// Promise 方式
const item = await storeage.setItem<User>('user', { name: 'John', age: 20 });

// 带过期时间
const item = await storage.setItem<User>('user', { name: 'John', age: 20 }, 1000 * 60 * 60); // 1小时后过期

// 带回调函数
storage.setItem<User>('user', { name: 'John', age: 20 }, savedItem => {
  console.log(savedItem.name);
});

// 带过期时间和回调函数
storage.setItem<User>('user', { name: 'John', age: 20 }, 3600, savedItem => {
  console.log(savedItem.name);
});
```

## 参数

- **key**: `string`

> 要存储的项目的键名。

- **value**: `T`

> 要设置的项目的值。

- **expirationTime**: `number` (可选)

> 项目的过期时间，以秒为单位。

- **onSuccess**: `(value: T) => void` (可选)

> 将在项目存储完成后被调用的回调函数，参数为存储的项目。如果提供了此函数，则方法返回void而不是Promise。

## 返回值

- `Promise<T>` - 当未提供 `onSuccess` 回调时
- `void` - 当提供了 `onSuccess` 回调时

其中 `T` 是表示存储项目类型的泛型类型参数。
