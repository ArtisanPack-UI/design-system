import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['packages/*/src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    // Build scripts run in Node.
    files: ['**/*.mjs'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly' },
    },
  },
  {
    // The playground page runs as a classic script in the browser.
    files: ['apps/*/src/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: Object.fromEntries(
        [
          'window',
          'document',
          'navigator',
          'location',
          'history',
          'getComputedStyle',
          'URLSearchParams',
          'Event',
          'setTimeout',
        ].map((name) => [name, 'readonly']),
      ),
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.figma-chunks/**', 'design/**', 'tools/**'],
  },
);
