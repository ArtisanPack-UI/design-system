# @artisanpack-ui/tokens

[![CI](https://github.com/ArtisanPack-UI/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/design-system/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@artisanpack-ui/tokens)](https://www.npmjs.com/package/@artisanpack-ui/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/design-system/blob/main/LICENSE)

Shared design tokens, color resolver, and glass helpers for [ArtisanPack UI](https://github.com/ArtisanPack-UI/design-system). Provides colors, spacing, typography, shadows, animations, and glass morphism presets as CSS custom properties and a Tailwind CSS plugin.

> **1.x is frozen.** This package moved here from the React monorepo at 1.0.1 ([#17](https://github.com/ArtisanPack-UI/design-system/issues/17)). The next release is 2.0.0, which switches to W3C DTCG tokens under the `--apui-*` namespace ([D-007](https://github.com/ArtisanPack-UI/design-system/blob/main/docs/decisions.md#d-007-tokens-moves-here-1x-is-frozen-next-release-is-200)). `@artisanpack-ui/react` and `@artisanpack-ui/vue` stay on `^1.0.1` until they migrate.

## Installation

```bash
npm install @artisanpack-ui/tokens
```

### Peer Dependencies

```bash
npm install clsx tailwind-merge
```

`tailwindcss` (v4+) is an optional peer dependency for the Tailwind plugin.

## Setup

Import the tokens CSS in your Tailwind entry file:

```css
@import "tailwindcss";
@import "@artisanpack-ui/tokens/css";
```

### Tailwind Plugin (Optional)

The plugin is a factory: pass it Tailwind's `plugin` function.

```js
// tailwind.config.js
import plugin from 'tailwindcss/plugin';
import { createArtisanPackPlugin } from '@artisanpack-ui/tokens/tailwind';

export default {
  plugins: [createArtisanPackPlugin(plugin)],
};
```

With Tailwind v4, load that config from your CSS entry:

```css
@import "tailwindcss";
@config "./tailwind.config.js";
```

`@plugin "@artisanpack-ui/tokens/tailwind"` doesn't work in 1.x, because the module has no default export. In a TypeScript config, `createArtisanPackPlugin(plugin)` also fails strict type-checking against Tailwind v4. Both are tracked in [#94](https://github.com/ArtisanPack-UI/design-system/issues/94).

## Usage

```tsx
import { resolveColor, cn, glassClassName } from '@artisanpack-ui/tokens';

// Resolve DaisyUI/theme-aware colors (pass an element to read scoped values)
const color = resolveColor('primary');

// Merge Tailwind classes, resolving conflicts (last wins)
const classes = cn('px-4 py-2', 'px-6'); // => 'py-2 px-6'

// Glass morphism presets
const glassClasses = glassClassName({ preset: 'frosted', tint: 'primary' });
```

## What's Included

- **Color tokens** - DaisyUI-compatible color variables
- **Spacing scale** - Consistent spacing values
- **Typography** - Font families, sizes, and weights
- **Shadows** - Elevation-based shadow tokens
- **Animations** - Transition and animation presets
- **Glass morphism** - Frosted glass effect helpers
- **Utilities** - `cn()` class merger, `resolveColor()`, and more

## Part of ArtisanPack UI

This package is part of the [ArtisanPack UI Design System](https://github.com/ArtisanPack-UI/design-system), and is used by:

| Package | Description |
|---------|-------------|
| [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react) | 56+ React UI components |
| [`@artisanpack-ui/react-laravel`](https://www.npmjs.com/package/@artisanpack-ui/react-laravel) | Inertia.js adapter wrappers for React |
| [`@artisanpack-ui/vue`](https://www.npmjs.com/package/@artisanpack-ui/vue) | Vue UI components |
| [`@artisanpack-ui/vue-laravel`](https://www.npmjs.com/package/@artisanpack-ui/vue-laravel) | Inertia.js adapter wrappers for Vue |

## License

[MIT](https://github.com/ArtisanPack-UI/design-system/blob/main/LICENSE) - Jacob Martella
