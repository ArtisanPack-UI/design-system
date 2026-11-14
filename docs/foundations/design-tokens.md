---
title: Design Tokens
menu_order: 1
---

# Design Tokens

The tokens are written in the W3C Design Tokens (DTCG) format and built into CSS custom properties, a typed TypeScript map and a PHP array. They ship in `@artisanpack-ui/tokens`, and `@artisanpack-ui/css` already includes them.

## Three tiers

| Tier | Holds | Examples |
|---|---|---|
| **Primitive** | Raw values: color ramps, the spacing and radius scales, durations | `--apui-gray-600`, `--apui-steel-600`, `--apui-space-4`, `--apui-radius-lg` |
| **Semantic** | Roles that say what a value is for | `--apui-color-primary`, `--apui-surface-raised`, `--apui-text-muted`, `--apui-radius-control`, `--apui-panel-padding` |
| **Component** | Per-component values | `--apui-button-radius`, `--apui-card-padding`, `--apui-table-row-height` |

Components read semantic and component tokens, never primitives. Themes and presets reassign semantic and component tokens. That's why one change to `--apui-color-primary` follows through every component: nothing reads the steel ramp directly.

When you customize, change the **semantic** token for a role, or a **component** token for one component. Changing a primitive works too, but only reaches the semantic tokens that point at it.

## Names

Every token is a CSS custom property named `--apui-` plus its path:

| Path | Custom property |
|---|---|
| `color.primary` | `--apui-color-primary` |
| `color.primary-soft-foreground` | `--apui-color-primary-soft-foreground` |
| `type.body-md.font-size` | `--apui-type-body-md-font-size` |
| `space.0-5` | `--apui-space-0-5` |

`--apui-text-*` tokens are text **colors**. Type styles live under `--apui-type-*`.

Custom properties named `--apui-_<name>`, with an underscore, are private to a component and not part of the API.

## Modes

Two axes change token values, each switched by an attribute on any element:

| Axis | Attribute | Values | Default |
|---|---|---|---|
| Theme | `data-theme` | `light`, `dark`, `high-contrast` | `light` |
| Density | `data-density` | `compact`, `default`, `comfortable` | `default` |

A third attribute, `data-preset`, swaps in a named set of token values (see [Presets](Theming-Presets)). All three combine, and any element can set them for its subtree:

```html
<html data-theme="dark" data-density="compact">
  <section data-theme="light" data-density="comfortable" data-preset="harbor">
    A light, roomy Harbor section inside a dark, compact page.
  </section>
</html>
```

## Using tokens in CSS

```css
.order-summary {
  background: var(--apui-surface-default);
  border: var(--apui-border-width) solid var(--apui-border-muted);
  border-radius: var(--apui-radius-surface);
  padding: var(--apui-panel-padding);
  color: var(--apui-text-default);
}
```

The tokens live in the `apui.tokens` cascade layer, so a token you set in your own CSS wins without `!important`:

```css
:root {
  --apui-color-primary: #7c3aed;
}
```

Overriding one color's base value doesn't regenerate its hover, soft and foreground shades. For a full rebrand that keeps every contrast pair passing, generate a [brand preset](Theming-Brand-Presets).

## Using tokens in TypeScript

```ts
import { cssVar, presets, tokens } from '@artisanpack-ui/tokens';

cssVar('color.primary'); // 'var(--apui-color-primary)'
tokens['color.primary'].resolved.dark; // '#60aaf3'
tokens['card.padding'].resolved.compact; // '16px'
presets.ledger.tokens['radius.md'].resolved; // '4px'
```

Each entry in `tokens` has its custom property (`cssVar`), its `type` and `tier`, the axis it varies by, its CSS `value` (with aliases as `var()`), and its `resolved` value, per mode when it varies. `TokenPath` is the union of every path.

## Using tokens in PHP

```php
$tokens = require base_path('node_modules/@artisanpack-ui/tokens/generated/tokens.php');

$tokens['tokens']['color.primary']['resolved']['dark']; // '#60aaf3'
```

The array has the same fields as the TypeScript map. `@artisanpack-ui/tokens/presets/php` returns the presets the same way.

## Outputs

| Output | Import |
|---|---|
| CSS custom properties, in `@layer apui.tokens` | `@artisanpack-ui/tokens/css` |
| TypeScript map and types | `@artisanpack-ui/tokens` |
| PHP array | `@artisanpack-ui/tokens/php` |
| One stylesheet per preset | `@artisanpack-ui/tokens/presets/<name>.css` |
| The DTCG source, for design tools | `@artisanpack-ui/tokens/dtcg/*` |
| Figma variables | `@artisanpack-ui/tokens/figma` |

See [the tokens package](Packages-Tokens) for the full list.
