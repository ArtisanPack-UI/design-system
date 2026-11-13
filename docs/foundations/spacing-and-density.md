---
title: Spacing and Density
menu_order: 4
---

# Spacing and Density

## Spacing scale

A 4px base, with Tailwind-style steps. Half steps are hyphenated, because the token format doesn't allow `.` in names.

| Token | Value | Token | Value |
|---|---|---|---|
| `--apui-space-0` | 0 | `--apui-space-4` | 16px |
| `--apui-space-0-5` | 2px | `--apui-space-5` | 20px |
| `--apui-space-1` | 4px | `--apui-space-6` | 24px |
| `--apui-space-1-5` | 6px | `--apui-space-8` | 32px |
| `--apui-space-2` | 8px | `--apui-space-10` | 40px |
| `--apui-space-3` | 12px | `--apui-space-12` | 48px |
| | | `--apui-space-16` | 64px |

These are primitives. Inside components, prefer the semantic spacing below, which follows density.

## Sizes

Control heights and icon sizes don't change with density. To make controls smaller on a dense screen, pick a smaller `size` on the component.

| Token | Value |
|---|---|
| `--apui-control-height-xs` | `24px` |
| `--apui-control-height-sm` | `28px` |
| `--apui-control-height-md` | `36px` |
| `--apui-control-height-lg` | `44px` |
| `--apui-control-height-xl` | `52px` |
| `--apui-icon-size-sm` | `14px` |
| `--apui-icon-size-md` | `16px` |
| `--apui-icon-size-lg` | `20px` |
| `--apui-target-size-min` | `24px` |
| `--apui-content-max-width` | `1200px` |
| `--apui-measure` | `68ch` |

Anything smaller than `--apui-target-size-min` (24px) extends its hit area to reach it, so even extra-small controls stay easy to hit.

## Density

`data-density` changes spacing, never control sizes:

| Token | Compact | Default | Comfortable |
|---|---|---|---|
| `--apui-density` | 0.8 | 1 | 1.2 |
| `--apui-panel-padding` | 16px | 20px | 24px |
| `--apui-panel-gap` | 8px | 12px | 16px |
| `--apui-row-height` | 32px | 40px | 48px |
| `--apui-cell-padding-x` | 8px | 12px | 16px |
| `--apui-field-gap` | 12px | 16px | 24px |

`--apui-density` is a multiplier for your own spacing:

```css
.toolbar {
  gap: calc(var(--apui-space-4) * var(--apui-density));
}
```

Component spacing follows density through the semantic tokens: `--apui-card-padding`, `--apui-table-row-height`, `--apui-table-cell-padding-x` and `--apui-menu-item-height` point at them.

Like theme, density can change for one region:

```html
<html data-density="compact">
  …
  <section data-density="comfortable">Roomier in here.</section>
</html>
```

The per-mode values are tokens too (`--apui-panel-padding-compact` and the rest), so a preset can change what "compact" means.
