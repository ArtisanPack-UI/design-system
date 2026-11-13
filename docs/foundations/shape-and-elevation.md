---
title: Shape and Elevation
menu_order: 5
---

# Shape and Elevation

## Radius

Controls are round and containers are rectangular. Four semantic radius roles carry that rule, so a preset changes the look of every component by changing four tokens:

| Token | Value |
|---|---|
| `--apui-radius-control` | `9999px` |
| `--apui-radius-field` | `10px` |
| `--apui-radius-surface` | `14px` |
| `--apui-radius-overlay` | `16px` |

| Role | Used by |
|---|---|
| `--apui-radius-control` | Buttons, badges, segmented tabs, toggles, avatars, pagination, filter chips |
| `--apui-radius-field` | Text inputs, selects, textareas, date fields, menu items |
| `--apui-radius-surface` | Cards, panels, table wrappers, alerts |
| `--apui-radius-overlay` | Dialogs, menus, toasts, popovers |

The roles point at the primitive scale: `--apui-radius-xs` (4px), `-sm` (6px), `-md` (10px), `-lg` (14px), `-xl` (16px) and `-full`. An inner radius is the outer radius minus the padding between them.

Each component also has its own radius token (`--apui-button-radius`, `--apui-card-radius`, `--apui-dialog-radius`, …) for changing just that component.

## Elevation

Surfaces are separated by **tone plus a hairline edge**. Shadows mark only what floats above the page:

| Token | Light | Dark | High contrast |
|---|---|---|---|
| `--apui-elevation-overlay` | `0 8px 24px 0 rgb(16 20 24 / 0.16), 0 1px 3px 0 rgb(16 20 24 / 0.08)` | `0 8px 24px 0 rgb(0 0 0 / 0.5), 0 1px 3px 0 rgb(0 0 0 / 0.4)` | `none` |
| `--apui-elevation-glass` | `0 4px 16px 0 rgb(16 20 24 / 0.08)` | `0 4px 16px 0 rgb(0 0 0 / 0.3)` | `none` |
| `--apui-elevation-raised` | `none` | `none` | `none` |

| Token | Used by |
|---|---|
| `--apui-elevation-overlay` | Dialogs, menus, toasts, popovers. High contrast has no shadow and relies on edges |
| `--apui-elevation-glass` | Glass panes |
| `--apui-elevation-raised` | `none` by default; the Harbor preset gives it a soft shadow |

Don't add shadows to cards that sit in the page.

## Layering

Overlays stack in a fixed order:

| Token | Value |
|---|---|
| `--apui-z-dropdown` | `1000` |
| `--apui-z-sticky` | `1100` |
| `--apui-z-overlay` | `1200` |
| `--apui-z-modal` | `1300` |
| `--apui-z-toast` | `1400` |
| `--apui-z-tooltip` | `1500` |

## Focus ring

Every interactive element shows the same focus ring on `:focus-visible`: a 2px ring outside a 2px gap. It's drawn with `box-shadow`, so it follows the element's radius, and the gap keeps it visible against solid fills.

| Token | Value |
|---|---|
| `--apui-focus-ring-width` | 2px |
| `--apui-focus-ring-offset` | 2px |
| `--apui-focus-ring-color` | The primary color, checked at 3:1 in every theme |
| `--apui-focus-ring-offset-color` | The surface the control sits on |

Set `--apui-focus-ring-offset-color` when a control sits on something other than `--apui-surface-default`, so the gap matches. In Windows forced-colors mode, a transparent outline keeps the ring visible. Inside tables and grids the ring is inset, so it doesn't overlap neighboring cells.

To give your own interactive element the ring, add the `apui-focus-ring` class.
