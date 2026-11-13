# @artisanpack-ui/codemods

Codemods and upgrade rules that move ArtisanPack UI apps to the next major: `@artisanpack-ui/react` and `@artisanpack-ui/vue` 1.x to 2.0, and the rules behind `php artisan artisanpack:upgrade-ui` in Livewire UI Components 3.0.

> **Not published yet.** The first release is tracked in #81.

## Run a codemod

```sh
npx @artisanpack-ui/codemods react src --dry-run   # preview as a diff
npx @artisanpack-ui/codemods react src             # write the changes
npx @artisanpack-ui/codemods vue src
```

| Option | What it does |
|---|---|
| paths | Files or directories. Default: `src` |
| `--dry-run` | Show the changes as a diff without writing |
| `--no-classes` | Don't report raw DaisyUI classes and theme references |
| `--global` | Vue: also migrate tags of globally registered components |
| `--json` | Print the report as JSON |

A codemod rewrites what it can decide: renamed imports and components with every reference to them, renamed props, events, slots and `v-model` arguments, flags that became values (`vertical` to `orientation="vertical"`), values that changed with the name (`position="left"` to `placement="start"`) and per-part class props (merged into `classes`). It edits by offset, so formatting and comments stay as written.

What it can't decide it leaves alone and reports with the file, line and column: `manual` for a prop with no automatic replacement, `review` for a change worth a look (an event whose payload changed), `removed` for a deleted prop, and `class` for a raw DaisyUI class, theme variable or DaisyUI configuration. DaisyUI classes are only ever reported.

The step-by-step guides are in [docs/upgrade](../../docs/upgrade/README.md).

## Use it from code

```ts
import { findClasses, transformReact, transformVue, upgradeRules } from '@artisanpack-ui/codemods';

const { code, changed, findings } = transformReact(source, 'App.tsx');
transformVue(source, 'App.vue', { global: true });
findClasses(source); // DaisyUI classes, with line and column
upgradeRules.stacks.react.components.Modal; // { canonical: 'Dialog', to: 'Dialog', props: { … } }
```

`run({ stack, paths, dryRun })` is the CLI as a function. The React codemod parses with TypeScript and the Vue one with `@vue/compiler-sfc`; both write through `magic-string`.

## The upgrade rules

`generated/upgrade-rules.json` says what every 2.x component, prop, slot and event becomes, for all three stacks. `generated/upgrade-rules.php` is the Livewire half as a PHP array: Livewire UI Components copies it to `resources/design-system/upgrade-rules.php` with its asset build, and its Blade upgrader applies the same rules the same way.

The rules are a diff of two API descriptions:

| Input | Role |
|---|---|
| `docs/inventory/data/api-<stack>.json` | **Before:** the 2.x API of each stack, from the Phase 0 catalogue |
| `packages/manifest/components/*.json` | **After:** the component manifests |
| `docs/inventory/data/component-map.json`, `api-aliases.json` | Which old name is which new one |
| `rules/curated.json` | What names can't say: a value to write, an attribute to add, a child's new name, a note for a person |

`npm run rules` builds them and refuses to write a rule whose target the manifest doesn't have: a prop that isn't in the manifest for that stack, a value that isn't one of the prop's values. A 2.x member with no rule and no place in the manifest becomes a `manual` rule, so nothing disappears silently.

A member rule has one of these kinds:

| Kind | What the tools do |
|---|---|
| `rename` | Rename it to `to`; `values` maps literal values that changed too, and `keep` lists values that already belong to a prop of the same name in the next major (Pin `size`) |
| `value` | Replace a flag with `to="value"` |
| `split` | Pick the new name from the literal value (Button `variant`: a color goes to `color`, a variant stays) |
| `invert` | Replace a negative flag with `to` set to false |
| `part-class` | Move a per-part class prop into `classes` under `part` |
| `wrap` | Livewire: move it to a component wrapped around the element (tooltips) |
| `content` | Livewire: move its text into the default slot |
| `remove` | Delete it |
| `manual` | Leave it and report the `note` |

### Change a rule

1. Edit `rules/curated.json` (a rule under `props.<Manifest>`, or a component under `components.<stack>`), or the curated maps in `docs/inventory/data`. Say where the rule comes from in `evidence`.
2. `npm run rules --workspace @artisanpack-ui/codemods`, then `npm run guides --workspace @artisanpack-ui/codemods`.
3. `npm test --workspace @artisanpack-ui/codemods`. The tests run one generated case per rule, so a new rule is covered as soon as it exists.
4. Commit the generated files, then rebuild the assets in Livewire UI Components (`node scripts/build-assets.mjs --from ../design-system`) and refresh its fixtures.

`npm run build` fails when the generated rules or guides are stale.

Part of the [ArtisanPack UI Design System](../../README.md).
