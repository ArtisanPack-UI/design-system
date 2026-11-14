---
title: Testing Package
menu_order: 6
---

# @artisanpack-ui/testing

The quality gates every component passes, in every stack it ships in. Use them if you build components on the design system and want the same guarantees.

| Gate | What fails it |
|---|---|
| **Cross-stack visual regression**, with a right-to-left pass | A screenshot that differs from the baseline, or from another stack's |
| **Accessibility** | An axe violation (WCAG 2.2 A and AA) on any fixture sheet, or a root element or role the manifest doesn't allow |
| **API parity** | Props, parts or events that drift from the [manifest](Packages-Manifest) |

The visual and accessibility gates run through `apui-gates check`. API parity is a separate check that runs in your unit tests. See [API parity](#api-parity).

```bash
npm install --save-dev @artisanpack-ui/testing @artisanpack-ui/css playwright
npx playwright install chromium
```

The gates render in Playwright's Chromium, and `@artisanpack-ui/css` provides the stylesheet the fixtures render with.

## Fixtures

Fixtures come from each component's manifest, so every stack renders the same matrix: every variant, size and state, every color, every surface, one sheet per theme, and a right-to-left sheet.

## Run the gates

```json
{
  "components": ["Button"],
  "css": ["node_modules/@artisanpack-ui/css/dist/index.css"],
  "stacks": {
    "react": { "host": "test/fixture-host.tsx" }
  },
  "baselines": "test/baselines",
  "out": "build/gates"
}
```

```bash
npx apui-gates check --config apui-gates.config.json            # fail on any difference
npx apui-gates check --config apui-gates.config.json --update   # write new or changed baselines
```

Paths are relative to the config file. A stack the component doesn't ship in is skipped.

### The fixture host

`stacks.<stack>.host` is an entry file that registers your components by their manifest names. The runner bundles it with esbuild:

```tsx
// test/fixture-host.tsx (React)
import { registerReactHost } from '@artisanpack-ui/testing/react-host';
import * as components from '../src';

registerReactHost(components);
```

```ts
// test/fixture-host.ts (Vue)
import { registerVueHost } from '@artisanpack-ui/testing/vue-host';
import * as components from '../src';

registerVueHost(components);
```

### Baselines

Keep baselines in a folder your project owns and commits, such as `test/baselines`, never inside `node_modules`: a reinstall would throw away anything `--update` wrote there. To start from the design system's own baselines, copy `node_modules/@artisanpack-ui/testing/baselines` into that folder once. Baselines are Linux renders: take new ones from a CI run, review them, and commit them. A render from macOS or Windows never matches, because fonts rasterize differently.

`apui-gates check` renders every sheet in every configured stack, runs axe and the manifest checks, then compares each screenshot against the baseline and the stacks against each other. It writes screenshots, diff images and a report to `out`, and exits with a failure when anything fails. It doesn't check API parity.

## API parity

Parity runs in your unit tests, separately from `apui-gates check`. Each helper renders the component with manifest-named props and fails when its props, parts or events drift from the manifest:

```ts
// React (Vitest)
import { expectReactParity } from '@artisanpack-ui/testing/react';
it('matches the manifest', () => expectReactParity(Button, 'Button'));

// Vue (Vitest)
import { expectVueParity } from '@artisanpack-ui/testing/vue';
it('matches the manifest', () => expectVueParity(Button, 'Button'));
```

In PHP, the Composer package adds a Pest expectation. Register it in `tests/Pest.php` with `ArtisanPackUI\DesignSystem\Testing\Pest\Expectations::register()`, then assert `expect( $component )->toMatchManifest()`.

## Exports

| Import | What it is |
|---|---|
| `@artisanpack-ui/testing` | The gate helpers: fixture pages, sheet capture and forced states, axe runs, the manifest accessibility checks and image comparison |
| `@artisanpack-ui/testing/react`, `/vue` | Fixture helpers for React and Vue |
| `@artisanpack-ui/testing/react-host`, `/vue-host` | The default fixture hosts |
| `@artisanpack-ui/testing/generated/fixtures/*` | The fixtures as JSON, for PHP |

The PHP side ships in the Composer package `artisanpack-ui/design-system`.
