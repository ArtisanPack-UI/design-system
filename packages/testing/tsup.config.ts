import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Node: fixtures, the runner, diffs, axe, parity checks and the CLI.
    entry: { index: 'src/index.ts', cli: 'src/cli.ts', react: 'src/react.ts', vue: 'src/vue.ts' },
    format: ['esm', 'cjs'],
    dts: { entry: { index: 'src/index.ts', react: 'src/react.ts', vue: 'src/vue.ts' } },
    clean: true,
    sourcemap: true,
    // The runner finds the manifests and fixtures from import.meta.url, in the CJS build too.
    shims: true,
    // pixelmatch 8 is ESM-only; bundle it so the CJS entry needn't require() an ES module.
    noExternal: ['pixelmatch'],
    target: 'es2020',
    outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.mjs' }),
  },
  {
    // Browser: the fixture hosts a component repo bundles into its fixture page.
    entry: { 'react-host': 'src/hosts/react.tsx', 'vue-host': 'src/hosts/vue.ts' },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    platform: 'browser',
    target: 'es2020',
    outExtension: () => ({ js: '.mjs' }),
  },
]);
