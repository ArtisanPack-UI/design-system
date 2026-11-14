---
title: Tailwind Utilities
menu_order: 4
---

# Tailwind Utilities

`@artisanpack-ui/css/tailwind` is an optional Tailwind v4 preset. It adds utilities generated from the design tokens, all of which follow theme, density and preset at runtime, because they read the tokens.

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind';
```

It only adds utilities. None of Tailwind's own utilities change, so the components render the same with or without it.

## The utilities

| Tokens | Utilities |
|---|---|
| `color.*` | `bg-primary`, `text-primary-text`, `border-primary-border`, `bg-error-soft`, … |
| `surface.*` | `bg-surface-page`, `bg-surface-raised`, … |
| `text.*`, `border.*` | `text-default`, `text-muted`, `border-muted`, `border-default`, … |
| `focus-ring.*`, `state.*`, `selected.*`, `chart.*`, `syntax.*`, `backdrop` | `ring-focus-ring`, `bg-state-hover`, `bg-selected-bg`, `fill-chart-1`, `text-syntax-keyword`, `bg-backdrop` |
| Radius roles | `rounded-control`, `rounded-field`, `rounded-surface`, `rounded-overlay` |
| `elevation.*` | `shadow-raised`, `shadow-overlay`, `shadow-glass` |
| `font-family.*` | `font-ui`, `font-code`, `font-display` |
| Type styles | `text-body-md`, `text-heading-lg`, … (size, line height, weight and letter spacing together) |
| Easings | `ease-standard`, `ease-enter`, `ease-exit` |
| Control heights, icon sizes | `h-control-md`, `size-icon-sm`, … |
| Density spacing | `p-panel-padding`, `gap-panel-gap`, `h-row-height`, `px-cell-padding-x`, `gap-field-gap` |
| Widths | `max-w-content`, `max-w-measure` |

```html
<section class="bg-surface-page p-panel-padding">
  <h2 class="text-heading-md">Orders</h2>
  <p class="text-body-sm text-muted max-w-measure">…</p>
</section>
```

## Tailwind's own font

The preset names its fonts `font-ui`, `font-code` and `font-display`, so Tailwind's `font-sans` stays as your app set it. To make `font-sans` the design system's font:

```css
@theme {
  --font-sans: var(--apui-font-family-sans);
}
```

## Coming from DaisyUI

The [upgrade guides](Upgrade) map each DaisyUI class to a utility: `bg-base-100` to `bg-surface-default`, `text-base-content` to `text-default`, `rounded-box` to `rounded-surface`, and so on.
