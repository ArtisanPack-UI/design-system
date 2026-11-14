---
title: Right-to-Left
menu_order: 3
---

# Right-to-Left

Every component works in right-to-left languages. Set `dir="rtl"` on `<html>`, or on any element, and layouts mirror.

```html
<html lang="ar" dir="rtl">
```

## How it works

The CSS uses logical properties only: `padding-inline-start` instead of `padding-left`, `inset-inline-end` instead of `right`, `text-align: start` instead of `left`, and so on. Start and end follow the text direction, so nothing needs an RTL stylesheet.

Overlay placement is logical too: a menu placed `end` opens to the right in English and to the left in Arabic. Arrow-key navigation in tabs, menus, sliders and grids follows the text direction.

## What mirrors

- Layout, spacing, borders and positioning.
- Directional icons: arrows and chevrons, including the Pagination previous and next buttons. See [Icons](Foundations-Icons).

## What stays left-to-right

- Chart plots, including time axes.
- The content of Code, CodeEditor and Diff.
- Numbers, media controls and non-directional icons.

## In your own CSS

Use logical properties next to components, so your layout mirrors with them:

| Instead of | Use |
|---|---|
| `margin-left`, `padding-right` | `margin-inline-start`, `padding-inline-end` |
| `left`, `right` | `inset-inline-start`, `inset-inline-end` |
| `border-top-left-radius` | `border-start-start-radius` |
| `text-align: left` | `text-align: start` |

With Tailwind, use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*` and `end-*`.

## Fonts

For Arabic and Hebrew, add a script font to `--apui-font-family-sans`, such as Noto Sans Arabic:

```css
:root {
  --apui-font-family-sans: Geist, 'Noto Sans Arabic', system-ui, sans-serif;
}
```
