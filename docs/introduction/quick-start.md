# Quick Start

## Installation

```bash
npm install storeage
```

## Usage

```ts
import storeage from 'storeage';

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

## Examples

- [basic usage in a offline todo list](https://github.com/gamejoye/storeage-demo-react)
