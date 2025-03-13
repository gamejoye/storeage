# iterate Api

## 描述

`iterate` 方法允许你迭代所有存储的数据（支持提前退出）

## 使用

```ts
import storeage from 'storeage';

// 带提前终止条件的 Promise 方式
const result = await storeage.iterate<number, string>((key, value) => {
  console.log(key, value);
  if (value > 10) {
    // 返回非 undefined 值来停止迭代
    return 'stop';
  }
});

// 不带终止条件
const result = await storeage.iterate<number, string>((key, value) => {
  console.log(key, value);
});
console.log(result);
// 结果是 undefined

// 回调方式
storeage.iterate<number, string>(
  (key, value) => {
    console.log(key, value);
    if (value > 10) {
      // 返回非 undefined 值来停止迭代
      return 'stop';
    }
  },
  result => {
    console.log(result);
    // 结果是 'stop'
  }
);
```

## 参数

- **callback**: `(key: string, value: T) => U | void`

> 遍历存储中每个项目时将被调用的回调函数。

- **onSuccess**: `(result: U | void) => void` (可选)

> 迭代完成时将被调用的回调函数。如果提供了此函数，方法返回 void 而不是 Promise。

## 返回值

- `Promise<U | void>` - 当未提供 `onSuccess` 回调时
- `void` - 当提供了 `onSuccess` 回调时

其中 `T` 是表示存储项类型的泛型类型参数。

其中 `U` 是表示回调函数返回值类型的泛型类型参数。
