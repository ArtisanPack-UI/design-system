# @artisanpack-ui/manifest

Per-component JSON manifest for ArtisanPack UI: the API contract the parity tests check.

> **Not published yet.** The first release is tracked in #81.

Each component has one JSON file in [`components/`](components) describing its props, variants, sizes, colors, parts, slots, events, accessibility requirements, the tokens it reads, and which stacks it ships in ([D-003](../../docs/decisions.md#d-003-full-parity-at-launch-with-four-exceptions)). Names follow the [unified vocabulary](../../docs/inventory/vocabulary.md). The manifest drives the parity tests (#41), the docs tables, the codemods and the upgrade guides.

## Schema

[`schema/component.schema.json`](schema/component.schema.json) is a JSON Schema (draft 2020-12), also exported as `@artisanpack-ui/manifest/schema.json`. Point a manifest at it for editor completion:

```json
{ "$schema": "../schema/component.schema.json", "name": "Button", … }
```

A component that doesn't ship in a stack sets that stack to `false`. Per-stack capability differences go in `differences`, which RichTextEditor must fill in for every stack.

## Validate

The validator checks the schema, then the vocabulary rules the schema can't express: the eight semantic colors, the `xs` to `xl` sizes, standard part names (no `leadingIcon` part: use `icon`), a `root` part, enum defaults within their values, unique names, no `no*`/`with*`/`without*`/`show*`/`has*` booleans, `start`/`end` instead of `left`/`right`, the root class, and all three stacks unless the component is a D-003 exception.

```sh
npx apui-manifest validate                 # every manifest in components/
npx apui-manifest validate path/to/X.json  # specific files
```

```ts
import { validateManifest } from '@artisanpack-ui/manifest';

const { valid, errors } = validateManifest(data); // errors: { path, message }[]
```

CI runs the same check through the package tests.

## Load in a test harness (React and Vue)

```ts
import { eventName, loadManifest, propsFor, shipsIn, stackName } from '@artisanpack-ui/manifest';

const button = loadManifest('Button'); // validated, typed as ComponentManifest
stackName(button, 'livewire'); // 'x-artisanpack-button'
propsFor(button, 'react'); // props that exist in React
eventName('row-click', 'react'); // 'onRowClick'
eventName('value-change', 'vue'); // 'update:modelValue'
```

`loadManifests()` returns every manifest. Both take an optional directory and throw a `ManifestLoadError` listing every problem.

## Load in PHP (Livewire)

`generated/manifests.php` is the same data as a PHP array, rebuilt with `npm run manifest` and checked by `npm run build`. The classes in `php/` give typed access:

```php
use ArtisanPackUI\DesignSystem\Manifest\ManifestRepository;

$manifests = ManifestRepository::fromFile();
$button    = $manifests->get( 'Button' );

$button->shipsIn( 'livewire' ); // true
$button->bladeTag();            // 'x-artisanpack-button'
$button->propsFor( 'livewire' );
$manifests->forStack( 'livewire' );
```

## Fixture block

`fixture` (optional) tells the quality gates (`@artisanpack-ui/testing`, D-016) how to render the component: `content` for the default slot, `props` added to every case, `parts` that make every optional part render (the parity checks expect each part with them), and `states` to override the derived ones. The validator rejects unknown props, values and states.

```json
"fixture": { "content": "Button", "parts": { "loading": true, "leadingIcon": "plus" } }
```

`fixtureStates(manifest)` gives the states: hover, focus-visible and active for interactive components (`a11y.element` or a widget `a11y.role`), plus every state prop.

## Accessibility rules

Besides the schema, the validator checks that `a11y.wcag` only cites WCAG 2.2 A and AA criteria, that interactive components list keyboard interactions and cite 2.1.1 and 2.4.7, that `a11y.element` is the root part's element, and that a component using ArrowLeft or ArrowRight states how they follow the text direction (D-004).

## Docs examples and tables

Examples live in `examples/<Name>/`: `examples.json` lists `{ id, title, description }`, and each id has `<id>.blade.php`, `<id>.tsx` (default export) and `<id>.vue` for every stack the component ships in. `checkExamples(manifest)` reports missing, extra and unlisted files; the tests run it on every manifest.

```ts
import { docsTables, loadExamples } from '@artisanpack-ui/manifest';

docsTables(button, 'livewire').props[3].name; // 'icon-only'
docsTables(button, 'react').events; // names like 'onValueChange'
loadExamples('Button'); // [{ id: 'basic', title, description, files: { livewire, react, vue } }]
```

```php
use ArtisanPackUI\DesignSystem\Manifest\{Examples, ManifestDocs};

ManifestDocs::tables( $button, 'vue' );
( new Examples() )->for( 'Button' );
```

## Diff two versions

```sh
npx apui-manifest diff before/Button.json after/Button.json
```

```ts
import { diffManifests, formatChanges } from '@artisanpack-ui/manifest';

const changes = diffManifests(before, after); // { kind, path, before, after, breaking, message }[]
formatChanges(changes, { component: 'Button' }); // Markdown for the upgrade guide
```

Named items (props, parts, slots, events) are compared by name, not position. Removing a prop, value, part, slot, event or stack, or changing a type or default, is breaking. Additions are not, except a new required prop.

Part of the [ArtisanPack UI Design System](../../README.md).
