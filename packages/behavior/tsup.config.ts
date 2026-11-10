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
    platform: 'browser',
    // Zag reads process.env.NODE_ENV for dev warnings; a classic script has no process.
    define: { 'process.env.NODE_ENV': '"production"' },
    minify: true,
    sourcemap: true,
    target: 'es2020',
    outExtension: () => ({ js: '.js' }),
  },
]);
