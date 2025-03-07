---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Storeage'
  text: 'A Javascript Library provides a Offline Storage'
  actions:
    - theme: brand
      text: What is storeage?
      link: /introduction/what-is-storeage
    - theme: alt
      text: Quick Start
      link: /introduction/quick-start
    - theme: alt
      text: API Reference
      link: /api-reference/get-item

features:
  - title: Support various data types
    details: You can store various data types, including bigint, blob, arraybuffer, typedarray, object, array, etc.
  - title: Promise / Callback style api
    details: The api is promise / callback style, so you can use it in the promise / callback way.
  - title: Support setting a ttl for the stored data
    details: You can set a ttl for the stored data, so you don't need to worry about the data is expired.
  - title: Support multiple instances
    details: You can create multiple instances, and each instance can have its own storage backend, and config.
---
