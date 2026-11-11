# @artisanpack-ui/testing

The quality gates every ArtisanPack UI component passes, in every stack it ships in ([D-003](../../docs/decisions.md#d-003-full-parity-at-launch-with-four-exceptions), [D-016](../../docs/decisions.md#d-016-the-quality-gates-ship-as-artisanpack-uitesting-plus-a-composer-kit)):

| Gate | Issue | What fails it |
|---|---|---|
| Cross-stack visual regression, with an RTL pass | #39 | A screenshot that differs from the baseline, or from another stack's |
| Accessibility | #40 | An axe violation (WCAG 2.2 A and AA) on any fixture sheet, or a root element or role the manifest doesn't allow |
| API parity | #41 | Props, parts or events that drift from the manifest |

> **Not published yet.** The first release is tracked in #81. The PHP side ships from the repo root as the Composer package `artisanpack-ui/design-system`.

## Fixtures

Fixtures come from the component's manifest, so every stack renders the same matrix:

- every variant × size × state, then every other color × variant, then every other `surface` once;
- states: `hover`, `focus-visible` and `active` for interactive components, forced through the DevTools protocol on the root, or on a field's native `control` part instead, plus each state prop the component has (`disabled`, `loading`, `invalid`, …);
- one sheet per theme (`light`, `dark`, `high-contrast`) at the default density, plus one `rtl` sheet in the default theme and density ([D-004](../../docs/decisions.md#d-004-rtl-is-a-launch-requirement)).

The manifest's optional `fixture` block sets the slot text, extra props, the props that render every part, and the states. `generated/fixtures/<Name>.json` holds the same fixtures for PHP; run `npm run fixtures` after a manifest changes, and `npm run build` fails while they're stale.

## Run the gates

`apui-gates check` renders every sheet in every configured stack, runs axe and the manifest checks, then diffs each screenshot against the baseline and the stacks against each other. It writes screenshots, diff images, `report.json` and `report.md` to `out`, and exits 1 when anything fails.

```json
{
  "components": ["Button"],
  "css": ["node_modules/@artisanpack-ui/css/dist/index.css"],
  "stacks": {
    "react": { "host": "test/fixture-host.tsx" }
  },
  "baselines": "node_modules/@artisanpack-ui/testing/baselines",
  "out": "build/gates"
}
```

```sh
npx apui-gates check --config apui-gates.config.json            # fail on any difference
npx apui-gates check --config apui-gates.config.json --update   # write new or changed baselines
```

Paths are relative to the config file. A stack the component doesn't ship in is skipped.

### React and Vue hosts

A fixture entry registers the components by their manifest name; the runner bundles it with esbuild:

```tsx
// test/fixture-host.tsx
import { registerReactHost } from '@artisanpack-ui/testing/react-host';
import * as components from '../src';

registerReactHost(components);
```

```ts
// test/fixture-host.ts
import { registerVueHost } from '@artisanpack-ui/testing/vue-host';
import * as components from '../src';

registerVueHost(components);
```

### Livewire (Blade) host

Blade renders in PHP, so a Pest test writes the cases first and the config points `stacks.livewire.html` at them:

```php
use ArtisanPackUI\DesignSystem\Testing\BladeFixtureHost;

it( 'renders the design-system fixtures', function (): void {
	( new BladeFixtureHost() )->write( [ 'Button' ], dirname( __DIR__ ) . '/build/gates/html/livewire' );
} )->group( 'gates' );
```

```json
"stacks": { "livewire": { "html": "build/gates/html/livewire", "scripts": ["dist/js/alpine.global.js"] } }
```

Keep the Composer and npm copies of the design system on the same version: the Blade host reads `generated/fixtures` from Composer, while the runner builds the sheets from the npm manifest. Different versions show up as unexplained diffs.

### CI

Component repos call the reusable workflow, which uploads the screenshots and diffs as the `quality-gates` artifact:

```yaml
jobs:
  gates:
    uses: ArtisanPack-UI/design-system/.github/workflows/gates.yml@release/1.0
    with:
      config: apui-gates.config.json
      php: '8.4'                              # Livewire only
      prepare: vendor/bin/pest --group=gates  # Livewire only
```

### Baselines

One baseline per component and sheet, shared by every stack, in [`baselines/`](baselines). They're Linux renders: take them from the CI artifact, review them, and commit them here. A render from macOS or Windows never matches, because fonts rasterize differently.

## Accessibility

axe runs on every sheet, in every stack, after the pseudo-states are forced, with the tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`. The runner also checks that each case's root is one of the root part's elements and has the manifest's role, through the accessibility tree.

The manual pass uses the [component accessibility checklist](../../.github/ISSUE_TEMPLATE/component-accessibility-checklist.md). Generate it filled in from the manifest, with an RTL arrow-key row whenever the component uses ArrowLeft or ArrowRight:

```sh
npx apui-gates checklist Button
```

## API parity

Each stack renders the component with manifest-named props, and the checks read the markup:

- the root has the root class and one of the root part's elements;
- `variant`, `color`, `size`, `surface` and `orientation` render their `data-*` attribute, with the default when unset;
- each state prop leaves evidence (`disabled`, `aria-busy`, `data-state="open"`, …);
- every other prop changes the markup (a prop that only falls through as an attribute doesn't count);
- with the fixture's `parts` props, every part renders as `[data-scope][data-part]`, and no part outside the manifest does;
- the declared API matches: Vue's `props` and `emits`, the Blade class's constructor and the events its source dispatches.

The messages are the same in every stack. Only components past `planned` are checked, and only in the stacks they ship in.

```ts
// React (Vitest)
import { expectReactParity } from '@artisanpack-ui/testing/react';
it('matches the manifest', () => expectReactParity(Button, 'Button'));

// Vue (Vitest)
import { expectVueParity } from '@artisanpack-ui/testing/vue';
it('matches the manifest', () => expectVueParity(Button, 'Button'));
```

```php
// Livewire (Pest). In tests/Pest.php: Expectations::register();
use ArtisanPackUI\DesignSystem\Testing\ManifestParity;

it( 'matches its manifest', function ( string $component ): void {
	expect( $component )->toMatchManifest();
} )->with( ManifestParity::targets() );
```

Options: `ignoreEffects` exempts props whose effect doesn't show in static markup, and `ignoreDeclared` exempts internal props or events from the declared check. React components have no runtime prop list, so pass `declared: { props, events }` to check theirs.

## Reference Probe

`test/reference/` holds a test-only Probe component in all three stacks, plus a broken twin in each. The tests prove the harness end to end. All stacks render identical pixels, axe and the manifest checks pass, and the TypeScript and PHP parity checks report the same problems for the broken twins (`parity-expectations.json`). CI runs `npm run gates` on it and uploads the artifact.

Part of the [ArtisanPack UI Design System](../../README.md).
