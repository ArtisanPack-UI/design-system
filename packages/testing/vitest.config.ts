import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // The gate tests drive Chromium and, for Blade, PHP.
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
