import { defineConfig, mergeConfig } from 'vitepress'
import cnConfig from './config.cn.mts';
import enConfig from './config.en.mts';

export default defineConfig({
  title: "Storeage",
  description: "A Javascript Library provides a High-performance Offline Storage with localStorage-like API",
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      ...enConfig,
    },
    cn: {
      label: '简体中文',
      lang: 'cn',
      ...cnConfig,
    },
  },
});
