import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // The cascade tests launch Chromium.
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
