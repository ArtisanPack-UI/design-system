---
title: Presets
menu_order: 2
---

# Presets

A preset is a named set of token values: a whole look, switched with one attribute. Presets combine freely with theme and density.

```html
<html data-preset="ledger" data-theme="dark" data-density="compact">
```

## The built-in presets

| Preset | Attribute | Look |
|---|---|---|
| **Strata** | none (the default) | Quiet steel-blue primary, grays tinted toward it, depth through tone with hairline edges |
| **Ledger** | `data-preset="ledger"` | Structure through lines: pure grays, near-square corners, a tighter rhythm, IBM Plex type |
| **Harbor** | `data-preset="harbor"` | Structure through space: white islands on a tinted canvas, soft shadows in light mode, a display face, an ink primary |

Ledger and Harbor come with `@artisanpack-ui/css`. Load their fonts yourself (see [Typography](Foundations-Typography)).

A preset only reassigns token values, so every component follows it with no changes, in every stack.

## Presets on a region

Like theme and density, a preset can apply to one part of a page:

```html
<main>
  <section data-preset="harbor">A Harbor-styled marketing section.</section>
</main>
```

## Making your own

- **From your brand colors:** generate a preset with the [preset generator](Theming-Brand-Presets). It rebuilds the color ramps around your colors and checks every contrast pair.
- **By hand:** copy Ledger or Harbor's tokens as a starting point and adjust them. A preset may reassign semantic and component tokens, the color ramps and the radius scale.

An example brand preset, `forest`, is generated from `#1f6f3d`. It isn't in `@artisanpack-ui/css`; import it with `@import '@artisanpack-ui/tokens/presets/forest.css';` to try it.

## Glass is not a preset

Glass is a [surface option](Theming-Glass) on container components, so it can appear where it helps instead of everywhere.
