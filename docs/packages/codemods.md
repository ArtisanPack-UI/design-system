---
title: Codemods Package
menu_order: 5
---

# @artisanpack-ui/codemods

The codemods that move React and Vue apps from `@artisanpack-ui/react` and `@artisanpack-ui/vue` 1.x to 2.0, and the upgrade rules behind them. Livewire UI Components' `php artisan artisanpack:upgrade-ui` applies the same rules to Blade.

## Run a codemod

No install needed:

```bash
npx @artisanpack-ui/codemods react src --dry-run   # preview as a diff
npx @artisanpack-ui/codemods react src             # write the changes
npx @artisanpack-ui/codemods vue src
```

| Option | Does |
|---|---|
| paths | Files or directories. Default: `src` |
| `--dry-run` | Show the changes as a diff without writing |
| `--no-classes` | Don't report raw DaisyUI classes and theme references |
| `--global` | Vue: also migrate tags of globally registered components |
| `--json` | Print the report as JSON |

## What it changes

Everything it can decide: renamed imports and components with every reference to them, renamed props, events, slots and `v-model` arguments, flags that became values (`vertical` to `orientation="vertical"`), values that changed with the name (`position="left"` to `placement="start"`), and per-part class props, merged into `classes`. It edits in place, so your formatting and comments stay as written.

## What it reports

What it can't decide, it leaves alone and reports with the file, line and column:

| Label | Means |
|---|---|
| `manual` | A prop with no automatic replacement. The message says what to do |
| `review` | A change that was made and deserves a look, such as an event whose payload changed |
| `removed` | A prop that was deleted because 2.0 has no equivalent |
| `class` | A raw DaisyUI class, theme variable or DaisyUI configuration. These are only ever reported, never rewritten |

The step-by-step guides are in [Upgrading](Upgrade).

## From code

```ts
import { findClasses, transformReact, transformVue, upgradeRules } from '@artisanpack-ui/codemods';

const { code, changed, findings } = transformReact(source, 'App.tsx');
transformVue(source, 'App.vue', { global: true });
findClasses(source); // DaisyUI classes, with line and column
```
