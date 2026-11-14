# @artisanpack-ui/tokens

[![CI](https://github.com/ArtisanPack-UI/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/ArtisanPack-UI/design-system/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ArtisanPack-UI/design-system/blob/main/LICENSE)

Design tokens for the [ArtisanPack UI Design System](https://github.com/ArtisanPack-UI/design-system). The source is W3C DTCG JSON in [`tokens/`](tokens), in three tiers (primitive, semantic, component) with theme and density modes. One build turns it into CSS custom properties, a typed TypeScript map and a PHP array.

> **2.0.0 is in progress and not published yet.** It replaces the 1.x package (DaisyUI color maps, `cn()`, `resolveColor()`, glass helpers and the Tailwind plugin) with the DTCG tokens under the `--apui-*` namespace ([D-007](../../contributing/decisions.md#d-007-tokens-moves-here-1x-is-frozen-next-release-is-200), [D-008](../../contributing/decisions.md#d-008-token-source-format-and-build)). `@artisanpack-ui/react` and `@artisanpack-ui/vue` stay on 1.0.1 from npm until they migrate.

## CSS

```css
@import '@artisanpack-ui/tokens/css';
```

The properties sit in `@layer apui.tokens`, so any app CSS overrides them without `!important`. `@artisanpack-ui/css` already includes them.

```html
<html data-theme="dark" data-density="compact">
  <section data-theme="light" data-density="comfortable">Any element can switch.</section>
</html>
```

## Presets

```html
<html data-preset="ledger">
  <section data-preset="harbor" data-theme="dark">Presets combine with theme and density.</section>
</html>
```

Ledger and Harbor (D-005) come with `@artisanpack-ui/css`. On their own, import `@artisanpack-ui/tokens/presets/<name>.css`. A preset reassigns token values only, so every component follows it without a change. The `forest` preset is an example brand preset.

## Brand presets

```bash
npx apui-generate-preset --name acme --primary "#7c3aed" > acme.css
```

The generator rebuilds the primary ramp (and optionally the secondary and accent ramps, the grays and the font families) around your colors. Each step keeps your hue but matches the default step's luminance, so every contrast check the default theme passes still passes. It checks every pair in every theme before writing anything. Output is CSS, DTCG source, PHP or JSON. See [contributing/tokens](../../contributing/tokens/README.md#brand-presets-the-generator-27).

## TypeScript

```ts
import { cssVar, presets, tokens } from '@artisanpack-ui/tokens';

cssVar('color.primary'); // 'var(--apui-color-primary)'
tokens['color.primary'].resolved.dark; // '#60aaf3'
tokens['card.padding'].resolved.compact; // '16px'
presets.ledger.tokens['radius.md'].resolved; // '4px'
```

## PHP

`@artisanpack-ui/tokens/php` resolves to `generated/tokens.php`, which returns the same map as an array. `@artisanpack-ui/tokens/presets/php` returns the presets.

## Changing tokens

Edit the JSON in `tokens/` or `presets/`, then run `npm run tokens` and commit the source with the regenerated `generated/` and `src/generated/` files. `npm test` checks the schema, WCAG contrast for every semantic pair in every theme and preset, and fidelity to the design spec. The full schema is in [contributing/tokens](../../contributing/tokens/README.md).

## License

MIT
