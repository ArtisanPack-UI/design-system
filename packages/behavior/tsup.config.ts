import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', alpine: 'src/alpine/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    target: 'es2020',
    outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  },
  {
    // The prebuilt asset for pages without a bundler (D-014): one classic
    // script with the engine bundled in, registering on alpine:init.
    entry: { 'alpine.global': 'src/alpine/global.ts' },
    format: ['iife'],
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outExtension: () => ({ js: '.js' }),
  },
]);
