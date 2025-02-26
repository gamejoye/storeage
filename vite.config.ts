/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      include: ['src'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
});
