import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', cli: 'src/cli.ts' },
  format: ['esm', 'cjs'],
  dts: { entry: { index: 'src/index.ts' } },
  clean: true,
  sourcemap: true,
  target: 'es2020',
  // The parsers stay dependencies; only the rules are bundled.
  external: ['typescript', 'magic-string', '@vue/compiler-sfc'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
});
