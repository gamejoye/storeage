# Storeage 🚀

![Node CI](https://github.com/gamejoye/storeage/workflows/Node%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/gamejoye/storeage/badge.svg?branch=main)](https://coveralls.io/github/gamejoye/storeage?branch=main)
[![npm](https://img.shields.io/npm/v/storeage.svg)](https://www.npmjs.com/package/storeage)
![license](https://img.shields.io/npm/l/storeage)

High-performance Offline Storage with localStorage-like API and Enhanced Capabilities

---

## ✨ Core Features

- **Standardized API Design**  
  📦 Familiar developer experience with localStorage-inspired API
- **Intelligent Storage Engine**  
  ⚡ Dual-driver fallback strategy (Priority: IndexedDB → LocalStorage)
- **Hybrid API Support**  
  ✅ Seamless Promise & Callback asynchronous patterns
- **Storage Isolation**  
  ✅ Multi-instance isolation via `name` + `storeName` combination
- **Advanced Data Management**  
  ✅ TTL (Time-to-Live) expiration support 🔥  
  ✅ Custom serialization (supports `Blob`/`BigInt`/`TypedArray` and complex types)
- **Developer Experience**  
  ✅ First-class TypeScript support  
  ✅ Simplified configuration (removed redundant `version` parameter)

---

## 🚀 Quick Start

### Installation

```bash
npm install storeage
```

### Basic Usage

```typescript
import storeage, { INTERNAL_DRIVERS } from 'storeage';

// Initialize storage
storeage.config({
  name: 'databaseName',
  storeName: 'storeName',
  driver: [INTERNAL_DRIVERS.IDB, INTERNAL_DRIVERS.LOCALSTORAGE], // Driver priority
});

// Store complex data (expires after 2s)
await storage.setItem(
  'userProfile',
  {
    id: BigInt(991234567890123456),
    avatar: new Blob([
      /* binary data */
    ]),
    loginTime: new Date(),
  },
  2000
);

// Retrieve data (auto-deserialized)
const profile = await storage.getItem('userProfile');
console.log(profile);
```

### Advanced Configuration

```typescript
// Create multi-instance storage
const cacheStorage = storage.createStorage({
  name: 'myApp_cache',
  storeName: 'imageCache',
});

await cacheStorage.setItem(
  'bannerImage',
  imageBlob,
  1000 * 60 * 60 * 24 // Expires after 24 hours
);
```

---

## ⚙️ Configuration Options

| Parameter   | Type     | Default                   | Description         |
| ----------- | -------- | ------------------------- | ------------------- |
| `name`      | string   | `'storeage'`              | Database identifier |
| `storeName` | string   | `'storeage'`              | Object store name   |
| `driver`    | string[] | `['idb', 'localstorage']` | Driver priority     |

---

## 🤝 Contributing

We welcome contributions! Please feel free to:

- Submit Pull Requests
- Open Issues for bug reports or feature requests

---

## 📄 License

MIT © [GameJoye](https://github.com/gamejoye)
