---
title: Manifest Package
menu_order: 4
---

# @artisanpack-ui/manifest

One JSON file per component describing its API contract across Livewire, React and Vue: props (with types, values and defaults), variants, sizes, colors, parts, slots, events, accessibility requirements, the tokens it reads and the stacks it ships in.

The manifest is the source of truth behind:

- the props, parts, slots and events tables on each [component page](Components);
- the parity tests that keep the three stacks in sync;
- the [upgrade codemods](Packages-Codemods) and guides.

```bash
npm install --save-dev @artisanpack-ui/manifest
```

## Exports

| Import | What it is |
|---|---|
| `@artisanpack-ui/manifest` | `loadManifest`, `loadManifests`, `validateManifest`, `propsFor`, `shipsIn`, `stackName`, `eventName` and the `ComponentManifest` type |
| `@artisanpack-ui/manifest/components/*` | The manifests themselves |
| `@artisanpack-ui/manifest/examples/*` | The examples for each component, in Blade, React and Vue |
| `@artisanpack-ui/manifest/schema.json` | The JSON Schema |
| `@artisanpack-ui/manifest/generated/manifests.php` | Every manifest as a PHP array |

## Reading a manifest

```ts
import { eventName, loadManifest, propsFor, stackName } from '@artisanpack-ui/manifest';

const button = loadManifest('Button');
stackName(button, 'livewire'); // 'x-artisanpack-button'
propsFor(button, 'react'); // the props React has
eventName('value-change', 'vue'); // 'update:modelValue'
```

In PHP, through the Composer package `artisanpack-ui/design-system`:

```php
use ArtisanPackUI\DesignSystem\Manifest\ManifestRepository;

$button = ManifestRepository::fromFile()->get( 'Button' );
$button->shipsIn( 'livewire' ); // true
```

## Validating

```bash
npx apui-manifest validate
```

Checks every manifest against the schema and the naming rules: the eight colors, the `xs` to `xl` sizes, standard part names, `start`/`end` instead of `left`/`right`, and a `root` part.
