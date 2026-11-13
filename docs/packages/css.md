---
title: CSS Package
menu_order: 2
---

# @artisanpack-ui/css

The plain-CSS layer: the reset, the tokens, the Ledger and Harbor presets, every component's styles and two utilities, in cascade layers. Tailwind is not required.

```bash
npm install @artisanpack-ui/css
```

```css
@import '@artisanpack-ui/css';
```

## Exports

| Import | What it is |
|---|---|
| `@artisanpack-ui/css` | Everything |
| `@artisanpack-ui/css/headless` | Everything except the component styles. See [Headless](Theming-Headless) |
| `@artisanpack-ui/css/tailwind` | Optional Tailwind v4 utilities from the tokens. See [Tailwind Utilities](Styling-Tailwind-Utilities) |
| `@artisanpack-ui/css/assets.php` | The entry points as a PHP array, used by Livewire UI Components |

## Layers

```css
@layer apui.reset, apui.tokens, apui.components, apui.utilities;
```

Your own CSS always wins over all four without `!important`. See [Cascade Layers](Styling-Cascade-Layers).

## Utilities

| Class | Does |
|---|---|
| `apui-sr-only` | Visually hidden, still read by screen readers |
| `apui-focus-ring` | The design system's focus ring on `:focus-visible` |

## Livewire without a bundler

Livewire UI Components ships this package's compiled CSS and loads it with `@artisanpackStyles`. See [Without a Bundler](Getting-Started-Without-A-Bundler).
