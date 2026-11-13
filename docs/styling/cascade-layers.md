---
title: Cascade Layers
menu_order: 1
---

# Cascade Layers

Every rule in the design system's CSS sits in one of four [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer):

```css
@layer apui.reset, apui.tokens, apui.components, apui.utilities;
```

| Layer | Holds |
|---|---|
| `apui.reset` | A small reset, scoped to design-system markup with `:where()`, so it never touches the rest of your page |
| `apui.tokens` | The design tokens and presets |
| `apui.components` | The component styles |
| `apui.utilities` | `apui-sr-only` and `apui-focus-ring` |

## Why your CSS always wins

CSS that isn't in a layer beats every layered rule, whatever its specificity or load order. So any plain rule you write overrides a token, a component style or a utility:

```css
/* No !important, no specificity tricks */
.apui-card {
  border-radius: 4px;
}
```

Within the design system, later layers win over earlier ones regardless of specificity: a utility beats a component rule, and a component rule beats the reset. The design system itself never uses `!important`.

## Your own layers

If your app uses layers of its own, declare where the design system goes. Layers declared earlier lose to layers declared later:

```css
@layer reset, apui, app;
```

Here your `app` layer wins over the whole design system, and your `reset` loses to it. Unlayered CSS still beats both.

## With Tailwind

Tailwind v4 also uses cascade layers. Put the design system between Tailwind's `base` and `components`:

```css
@layer theme, base, apui, components, utilities;
```

Tailwind's Preflight then never restyles a component, and a Tailwind utility on a component still wins. See [With Tailwind](Getting-Started-Tailwind).
