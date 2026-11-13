---
title: Styling
menu_order: 5
---

# Styling

The design system's CSS is plain CSS. It needs no preprocessor and no Tailwind, and it's built so your own CSS always wins without `!important`.

| Page | Covers |
|---|---|
| [Cascade Layers](Styling-Cascade-Layers) | How the CSS is layered, and why app CSS always wins |
| [Component Markup](Styling-Component-Markup) | Root classes, variant and state attributes, parts, and the `classes` prop |
| [Right-to-Left](Styling-Right-To-Left) | Logical properties, mirroring, and what stays left-to-right |
| [Tailwind Utilities](Styling-Tailwind-Utilities) | The optional utilities generated from the tokens |

## Entry points

| Import | Holds |
|---|---|
| `@artisanpack-ui/css` | Everything: reset, tokens, the Ledger and Harbor presets, components and utilities |
| `@artisanpack-ui/css/headless` | The same without the component styles. See [Headless](Theming-Headless) |
| `@artisanpack-ui/css/tailwind` | Optional Tailwind v4 utilities from the tokens |

Brand presets are separate imports: `@artisanpack-ui/tokens/presets/<name>.css`, or the file the [generator](Theming-Brand-Presets) writes.

## Two utilities

The CSS ships two utility classes for your own markup:

| Class | Does |
|---|---|
| `apui-sr-only` | Hides content visually while keeping it available to screen readers |
| `apui-focus-ring` | Gives an element the design system's focus ring on `:focus-visible` |
