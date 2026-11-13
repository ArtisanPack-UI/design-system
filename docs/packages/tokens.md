---
title: Tokens Package
menu_order: 1
---

# @artisanpack-ui/tokens

The design tokens, the presets and the preset generator.

```bash
npm install @artisanpack-ui/tokens
```

`@artisanpack-ui/css` already includes the token CSS and the built-in presets. Install this package directly to read tokens from TypeScript or PHP, to load a single preset, or to generate a brand preset.

## Exports

| Import | What it is |
|---|---|
| `@artisanpack-ui/tokens` | TypeScript: `tokens`, `presets`, `axes`, `cssVar()` and the `TokenPath` type |
| `@artisanpack-ui/tokens/css` | The custom properties, in `@layer apui.tokens` |
| `@artisanpack-ui/tokens/presets/<name>.css` | One preset's stylesheet: `ledger`, `harbor`, or the `forest` example |
| `@artisanpack-ui/tokens/php` | The tokens as a PHP array |
| `@artisanpack-ui/tokens/presets/php` | The presets as a PHP array |
| `@artisanpack-ui/tokens/dtcg/*` | The DTCG source files, for design tools |
| `@artisanpack-ui/tokens/dtcg-presets/*` | The preset source directories |
| `@artisanpack-ui/tokens/figma` | The payload for syncing the tokens to Figma variables |

## Command

| Command | Does |
|---|---|
| `npx apui-generate-preset` | Generates a brand preset from your colors and fonts. See [Brand Presets](Theming-Brand-Presets) |

## TypeScript

```ts
import { cssVar, presets, tokens } from '@artisanpack-ui/tokens';

cssVar('color.primary'); // 'var(--apui-color-primary)'
tokens['color.primary'].resolved.dark; // '#60aaf3'
presets.harbor.description;
```

See [Design Tokens](Foundations-Design-Tokens) for the token tiers, names and modes.

## Upgrading from 1.x

Version 1.x shipped DaisyUI color maps, `cn()`, `resolveColor()`, glass helpers and a Tailwind plugin. 2.0 replaces all of them with the DTCG tokens under `--apui-*`, and no longer uses `clsx` or `tailwind-merge`. The 1.x line is frozen and isn't compatible with the 2.0 component libraries.
