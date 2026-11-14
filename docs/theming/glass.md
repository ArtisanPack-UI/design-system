---
title: Glass
menu_order: 5
---

# Glass

Glass is a translucent, blurred surface for containers that float over imagery or rich backgrounds. It's an option on a component, never a theme, so it appears only where it helps.

## Which components

Set `surface="glass"` on any of these:

| Component | |
|---|---|
| [Alert](components/alert) | [Drawer](components/drawer) |
| [Card](components/card) | [DropdownMenu](components/dropdown-menu) (and [UserMenu](components/user-menu)) |
| [Dialog](components/dialog) | [Navbar](components/navbar) |
| [Table](components/table) | [Toast](components/toast) |

```html
<!-- Blade -->
<x-artisanpack-card surface="glass" title="Now playing">…</x-artisanpack-card>
```

```tsx
// React and Vue
<Card surface="glass" title="Now playing">…</Card>
```

On bare markup, the attribute is `data-surface="glass"`.

## The recipe

| Token | Use |
|---|---|
| `--apui-surface-glass` | The pane color, at 80% opacity |
| `--apui-surface-glass-border` | Its edge |
| `--apui-elevation-glass` | Its shadow |
| `--apui-text-muted-glass` | Secondary text on glass |

| Token | Value |
|---|---|
| `--apui-surface-glass-blur` | `20px` |
| `--apui-surface-glass-blur-sm` | `12px` |
| `--apui-surface-glass-saturation` | `1.4` |

The 80% opacity floor was checked over black, white, saturated red and saturated blue backdrops: body text stays above 9:1 and muted text above 4.5:1.

## When glass turns opaque

Glass falls back to the opaque `--apui-surface-raised`:

- under `prefers-reduced-transparency: reduce`,
- in browsers without `backdrop-filter`,
- in the high-contrast theme.

## Using it well

- Pair it with a background worth seeing through. Over a flat canvas, glass does nothing.
- Don't stack glass on glass.
- Keep long tables and forms on opaque surfaces, where reading matters most.
