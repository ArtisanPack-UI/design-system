---
title: Color
menu_order: 2
---

# Color

Color comes in four groups: **surfaces** (what things sit on), **text**, **edges**, and the eight **color roles** used for actions and status. Every value below is checked for contrast in all three themes.

## Contrast guarantees

- Text roles reach **4.5:1** against the surfaces they're meant for, in every theme: the default, muted and glass text roles on the page, raised, sunken and overlay surfaces, and `--apui-text-inverse` on `--apui-surface-inverse`. `--apui-text-default` reaches 12:1. Don't put a regular text role on the inverse surface, or inverse text on a regular one.
- Control edges and the focus ring reach **3:1** (WCAG 1.4.11).
- Glass text is checked over black, white, saturated red and saturated blue backdrops.
- Status is never shown by color alone. Components pair it with a label or an icon, and so should you.

## Surfaces

From lowest to highest:

| Token | Use |
|---|---|
| `--apui-surface-sunken` | Wells: input fills, table headers, code, toggle tracks |
| `--apui-surface-page` | The page canvas |
| `--apui-surface-default` | Cards, panels, tables, form sections |
| `--apui-surface-raised` | A container inside a container, a selected segment |
| `--apui-surface-overlay` | Dialogs, menus, toasts and popovers, always with `--apui-elevation-overlay` |
| `--apui-surface-glass` | Opt-in [glass](Theming-Glass) |
| `--apui-surface-inverse` | Tooltips and the inverse toast |

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-surface-sunken` | `#eaedf1` | `#0a0e11` | `#f4f7fb` |
| `--apui-surface-page` | `#f0f4f7` | `#101418` | `#ffffff` |
| `--apui-surface-default` | `#fafcfe` | `#191d22` | `#ffffff` |
| `--apui-surface-raised` | `#ffffff` | `#23272b` | `#ffffff` |
| `--apui-surface-overlay` | `#ffffff` | `#2d3135` | `#ffffff` |
| `--apui-surface-glass` | `oklch(99% 0.006 250 / 0.8)` | `oklch(23% 0.01 250 / 0.8)` | `#ffffff` |
| `--apui-surface-inverse` | `#23272b` | `#f4f7fb` | `#000000` |
| `--apui-surface-glass-border` | `oklch(100% 0 0 / 0.6)` | `oklch(100% 0 0 / 0.12)` | `#000000` |

## Text

- `--apui-text-default` for body text.
- `--apui-text-muted` for hints, captions and placeholders.
- `--apui-text-subtle` for non-text icons only: it reaches 3:1, not 4.5:1.
- `--apui-text-disabled`, `--apui-text-inverse` and `--apui-text-muted-glass` (muted text on glass).

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-text-default` | `#23272b` | `#f4f7fb` | `#000000` |
| `--apui-text-muted` | `#636669` | `#bbbec1` | `#3c4045` |
| `--apui-text-subtle` | `#7e8084` | `#7e8084` | `#4c5055` |
| `--apui-text-disabled` | `#9c9fa2` | `#636669` | `#7e8084` |
| `--apui-text-inverse` | `#fafcfe` | `#191d22` | `#ffffff` |
| `--apui-text-muted-glass` | `#4c5055` | `#bbbec1` | `#3c4045` |

Don't lower text contrast with opacity. An opacity isn't checked against the surface behind it; `--apui-text-muted` is.

## Edges

- `--apui-border-muted`: the hairline around containers. Set it to a transparent color for pure tonal layering.
- `--apui-border-default`: control outlines, 3:1 or better.
- `--apui-border-strong`: hover and selected edges.

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-border-muted` | `#e2e5e8` | `#2d3135` | `#4c5055` |
| `--apui-border-default` | `#7e8084` | `#7e8084` | `#000000` |
| `--apui-border-strong` | `#4c5055` | `#bbbec1` | `#000000` |

## Color roles

Eight colors share the same seven roles, so every variant of every component is a fixed recipe:

| Color | Default ramp | Use |
|---|---|---|
| `primary` | steel | The main action of a view |
| `secondary` | slate | A secondary emphasis |
| `accent` | marigold | The one highlighted thing in a view |
| `neutral` | gray | Neutral actions and labels |
| `success`, `warning`, `error`, `info` | green, orange, red, cyan | Status |

| Role | Token | Used for |
|---|---|---|
| Base | `--apui-color-{color}` | Solid fills |
| Hover | `--apui-color-{color}-hover` | Solid fills on hover |
| Foreground | `--apui-color-{color}-foreground` | Text and icons on a solid fill |
| Soft | `--apui-color-{color}-soft` | Soft (tinted) fills |
| Soft foreground | `--apui-color-{color}-soft-foreground` | Text on a soft fill |
| Border | `--apui-color-{color}-border` | Outlines in the color |
| Text | `--apui-color-{color}-text` | Text in the color on a surface |

The variants use them like this:

| Variant | Fill | Text | Edge |
|---|---|---|---|
| `solid` | Base, Hover on hover | Foreground | None, except accent and warning, which carry Border |
| `soft` | Soft | Soft foreground | None, except in high contrast |
| `outline` | Transparent, `--apui-state-hover` on hover | Text | Border |
| `ghost` | Transparent, `--apui-state-hover` on hover | Text | None |
| `link` | None | Text, underlined on hover and focus | None |

Solid accent and warning carry an edge because, in light mode, their fills sit below 3:1 against the page.

### All color tokens

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-color-primary` | `#2a75ba` | `#60aaf3` | `#01477d` |
| `--apui-color-primary-hover` | `#065da0` | `#90c6fe` | `#00315a` |
| `--apui-color-primary-foreground` | `#ffffff` | `#0a0e11` | `#ffffff` |
| `--apui-color-primary-soft` | `#daecfe` | `#00315a` | `#eef6ff` |
| `--apui-color-primary-soft-foreground` | `#065da0` | `#90c6fe` | `#00315a` |
| `--apui-color-primary-border` | `#2a75ba` | `#448dd4` | `#01477d` |
| `--apui-color-primary-text` | `#065da0` | `#60aaf3` | `#01477d` |
| `--apui-color-secondary` | `#647386` | `#96a6bb` | `#384658` |
| `--apui-color-secondary-hover` | `#4e5c6f` | `#b2c3d8` | `#243142` |
| `--apui-color-secondary-foreground` | `#ffffff` | `#0a0e11` | `#ffffff` |
| `--apui-color-secondary-soft` | `#e1eaf7` | `#243142` | `#f1f5fb` |
| `--apui-color-secondary-soft-foreground` | `#4e5c6f` | `#b2c3d8` | `#243142` |
| `--apui-color-secondary-border` | `#647386` | `#7b8b9f` | `#384658` |
| `--apui-color-secondary-text` | `#4e5c6f` | `#96a6bb` | `#384658` |
| `--apui-color-accent` | `#f0b71f` | `#f0b71f` | `#594100` |
| `--apui-color-accent-hover` | `#ce9c09` | `#ffd16b` | `#3f2d02` |
| `--apui-color-accent-foreground` | `#2a1d01` | `#0a0e11` | `#ffffff` |
| `--apui-color-accent-soft` | `#ffe7b6` | `#3f2d02` | `#fef4df` |
| `--apui-color-accent-soft-foreground` | `#735601` | `#f0b71f` | `#3f2d02` |
| `--apui-color-accent-border` | `#ac8205` | `#ac8205` | `#594100` |
| `--apui-color-accent-text` | `#735601` | `#ce9c09` | `#594100` |
| `--apui-color-neutral` | `#23272b` | `#f4f7fb` | `#000000` |
| `--apui-color-neutral-hover` | `#191d22` | `#f0f4f7` | `#000000` |
| `--apui-color-neutral-foreground` | `#ffffff` | `#101418` | `#ffffff` |
| `--apui-color-neutral-soft` | `#eaedf1` | `#2d3135` | `#f4f7fb` |
| `--apui-color-neutral-soft-foreground` | `#3c4045` | `#eaedf1` | `#000000` |
| `--apui-color-neutral-border` | `#7e8084` | `#7e8084` | `#000000` |
| `--apui-color-neutral-text` | `#4c5055` | `#d6d9dd` | `#000000` |
| `--apui-color-success` | `#05893e` | `#53be70` | `#025424` |
| `--apui-color-success-hover` | `#046e30` | `#72dc8c` | `#013b17` |
| `--apui-color-success-foreground` | `#ffffff` | `#0a0e11` | `#ffffff` |
| `--apui-color-success-soft` | `#c3facd` | `#013b17` | `#e4fde8` |
| `--apui-color-success-soft-foreground` | `#046e30` | `#72dc8c` | `#013b17` |
| `--apui-color-success-border` | `#05893e` | `#32a155` | `#025424` |
| `--apui-color-success-text` | `#046e30` | `#53be70` | `#025424` |
| `--apui-color-warning` | `#ffab63` | `#ffab63` | `#673702` |
| `--apui-color-warning-hover` | `#ef8604` | `#ffcca4` | `#4a2601` |
| `--apui-color-warning-foreground` | `#321800` | `#0a0e11` | `#ffffff` |
| `--apui-color-warning-soft` | `#fee4d0` | `#4a2601` | `#fef3ea` |
| `--apui-color-warning-soft-foreground` | `#864900` | `#ffab63` | `#4a2601` |
| `--apui-color-warning-border` | `#c77007` | `#c77007` | `#673702` |
| `--apui-color-warning-text` | `#864900` | `#ef8604` | `#673702` |
| `--apui-color-error` | `#c92f33` | `#ff726b` | `#860012` |
| `--apui-color-error-hover` | `#ac011a` | `#fea69e` | `#610009` |
| `--apui-color-error-foreground` | `#ffffff` | `#0a0e11` | `#ffffff` |
| `--apui-color-error-soft` | `#ffe2df` | `#610009` | `#fef2f0` |
| `--apui-color-error-soft-foreground` | `#ac011a` | `#fea69e` | `#610009` |
| `--apui-color-error-border` | `#e54c4a` | `#e54c4a` | `#860012` |
| `--apui-color-error-text` | `#c92f33` | `#ff726b` | `#860012` |
| `--apui-color-info` | `#017e9a` | `#2fb5d8` | `#034d5f` |
| `--apui-color-info-hover` | `#06657b` | `#55d3f6` | `#013744` |
| `--apui-color-info-foreground` | `#ffffff` | `#0a0e11` | `#ffffff` |
| `--apui-color-info-soft` | `#caf1fe` | `#013744` | `#e7f9ff` |
| `--apui-color-info-soft-foreground` | `#06657b` | `#55d3f6` | `#013744` |
| `--apui-color-info-border` | `#017e9a` | `#0598b9` | `#034d5f` |
| `--apui-color-info-text` | `#06657b` | `#2fb5d8` | `#034d5f` |

## States and focus

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-state-hover` | `oklch(20% 0.01 250 / 0.05)` | `oklch(100% 0 0 / 0.06)` | `oklch(0% 0 0 / 0.08)` |
| `--apui-state-pressed` | `oklch(20% 0.01 250 / 0.1)` | `oklch(100% 0 0 / 0.12)` | `oklch(0% 0 0 / 0.16)` |
| `--apui-selected-bg` | `#daecfe` | `#00315a` | `#eef6ff` |
| `--apui-selected-border` | `#2a75ba` | `#448dd4` | `#01477d` |
| `--apui-focus-ring-color` | `#2a75ba` | `#90c6fe` | `#01477d` |
| `--apui-focus-ring-offset-color` | `#fafcfe` | `#191d22` | `#ffffff` |
| `--apui-backdrop` | `oklch(15% 0.01 250 / 0.4)` | `oklch(0% 0 0 / 0.6)` | `oklch(0% 0 0 / 0.7)` |

## Charts and code

`--apui-chart-1` to `--apui-chart-6` are a categorical palette for data series, assigned in order and never cycled. They were checked for colorblind separation between neighbors. Some chart colors sit under 3:1 against the surface in light mode, so every chart ships hover and focus tooltips, direct labels and a table view. The syntax colors are checked at 4.5:1 on `--apui-surface-sunken`, where code sits.

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-chart-1` | `#005a9d` | `#0871c1` | `#005a9d` |
| `--apui-chart-2` | `#31c3b5` | `#02a99b` | `#31c3b5` |
| `--apui-chart-3` | `#9d2602` | `#b94224` | `#9d2602` |
| `--apui-chart-4` | `#de9d16` | `#bf8608` | `#de9d16` |
| `--apui-chart-5` | `#91256c` | `#ab3f84` | `#91256c` |
| `--apui-chart-6` | `#74c163` | `#5ba84a` | `#74c163` |
| `--apui-chart-grid` | `#e2e5e8` | `#2d3135` | `#4c5055` |
| `--apui-chart-axis` | `#636669` | `#bbbec1` | `#3c4045` |
| `--apui-syntax-keyword` | `#065da0` | `#90c6fe` | `#01477d` |
| `--apui-syntax-string` | `#046e30` | `#72dc8c` | `#025424` |
| `--apui-syntax-number` | `#864900` | `#ffab63` | `#673702` |
| `--apui-syntax-function` | `#735601` | `#f0b71f` | `#594100` |
| `--apui-syntax-property` | `#06657b` | `#55d3f6` | `#034d5f` |
| `--apui-syntax-comment` | `#636669` | `#9c9fa2` | `#4c5055` |

## Using color well

- One solid primary button per view. Use `soft`, `outline` or `ghost` for the rest.
- Keep navigation, panels and labels neutral.
- Use the accent role for the one thing that should stand out, not a new variant.
- Pair every status color with a label or an icon.
