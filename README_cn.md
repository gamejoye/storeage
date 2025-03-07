# Storeage 🚀

高性能离线存储解决方案 - 类 localStorage API 与增强能力

---

## ✨ 核心功能

- **标准化API设计**
  📦 参考localStorage API格式，提供熟悉的开发体验
- **智能存储引擎**
  ⚡ 双驱动自动降级策略（优先使用IndexedDB，自动回退LocalStorage）
- **混合调用模式**
  ✅ 同时支持 Promise 和 Callback 两种异步风格
- **存储隔离机制**
  ✅ 通过`name`+`storeName`实现多实例数据隔离
- **高级数据管理**
  ✅ 数据过期时间（TTL）支持 🔥
  ✅ 自定义序列化方案（支持 `Blob`/`BigInt`/`TypedArray` 等类型）
- **开发体验优化**
  ✅ 完整的TypeScript类型支持
  ✅ 简化的配置参数（移除冗余`version`配置）

---

## 🚀 快速开始

### 安装

```bash
npm install storeage
```

### 基础用法

```typescript
import storeage, { INTERNAL_DRIVERS } from 'storeage';

storeage.config({
  name: 'databaseName',
  storeName: 'storeName',
  driver: [INTERNAL_DRIVERS.IDB, INTERNAL_DRIVERS.LOCALSTORAGE], // 驱动优先级
});
// 存储复杂数据（缓存2s后过期， 如果未提供第3个参数，则默认永久不会过期）
await storage.setItem(
  'userProfile',
  {
    id: BigInt(991234567890123456),
    avatar: new Blob([
      /* 二进制数据 */
    ]),
    loginTime: new Date(),
  },
  2000
);

// 读取数据（自动反序列化）
const profile = await storage.getItem('userProfile');
console.log(profile);
```

### 进阶配置

```typescript
// 创建多实例存储
const cacheStorage = storage.createStorage({
  name: 'myApp_cache',
  storeName: 'imageCache',
});

await cacheStorage.setItem(
  'bannerImage',
  imageBlob,
  1000 * 60 * 60 * 24 // 24小时后过期
);
```

---

## ⚙️ 配置参数

| 参数        | 类型     | 默认值                    | 说明           |
| ----------- | -------- | ------------------------- | -------------- |
| `name`      | string   | `'storeage'`              | 数据库标识名称 |
| `storeName` | string   | `'storeage'`              | 数据仓库名称   |
| `driver`    | string[] | `['idb', 'localstorage']` | 驱动使用优先级 |

---

## 🤝 参与贡献

欢迎提交Pull Request或Issue报告问题

---

## 开源协议

MIT © [GameJoye](https://github.com/gamejoye)
