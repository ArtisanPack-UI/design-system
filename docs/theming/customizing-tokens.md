---
title: Customizing Tokens
menu_order: 4
---

# Customizing Tokens

Every token is a CSS custom property in the `apui.tokens` cascade layer. CSS you write outside the design system's layers always wins, so you can set any token with a plain selector, no `!important` needed.

## For the whole app

```css
:root {
  --apui-radius-surface: 8px;
  --apui-border-muted: transparent; /* pure tonal layering, no hairlines */
  --apui-font-family-sans: 'Inter', system-ui, sans-serif;
}
```

This sets the tokens on the document root. A preset or theme switched on for an element further down (`data-preset` or `data-theme` on a section) sets many tokens again on that element, and everything inside it inherits those values instead. To change a token there too, add the element's attribute to the selector, as in the next section.

## For one theme

Match the theme attribute, so your value only applies there:

```css
[data-theme='dark'] {
  --apui-surface-page: #0b0d10;
}
```

## For a region

Tokens cascade, so setting one on an element changes it for everything inside:

```css
.marketing-hero {
  --apui-radius-control: 6px;
  --apui-color-primary: var(--apui-marigold-500);
}
```

## For one component

Each component has its own tokens for the values you're most likely to change. They point at semantic tokens by default:

```css
:root {
  --apui-button-radius: 8px; /* buttons only */
  --apui-card-padding: 24px; /* cards only, at every density */
  --apui-table-head-weight: 600;
}
```

The component tokens are `alert.radius`, `avatar.radius`, `badge.radius`, `button.radius`, `button.weight`, `card.radius`, `card.padding`, `checkbox.radius`, `chip.radius`, `dialog.radius`, `dialog.width`, `drawer.width`, `drawer.radius`, `input.radius`, `kbd.radius`, `menu.radius`, `menu.item-radius`, `menu.item-height`, `navbar.height`, `popover.radius`, `progress.height`, `shell.gutter`, `sidebar.width`, `spotlight.width`, `table.radius`, `table.head-weight`, `table.row-height`, `table.cell-padding-x`, `tabs.radius`, `toast.radius` and `tooltip.radius`, each as `--apui-` plus the path with `-` for `.`.

## Styling a part

To restyle part of a component beyond its tokens, target the part. Every part carries `data-scope` and `data-part` attributes:

```css
[data-scope='card'][data-part='title'] {
  letter-spacing: -0.01em;
}
```

Each stack also takes per-part classes through a `classes` prop. See [Component Markup](Styling-Component-Markup).

## Changing colors safely

Setting `--apui-color-primary` changes the solid fill only. Its hover, soft, foreground, border and text roles keep their old values, and nothing checks the new pairs for contrast. For a new brand color, [generate a preset](Theming-Brand-Presets): it rebuilds the whole ramp and checks every pair in every theme.

Don't lower contrast with opacity. Tokens are checked against their surfaces; opacity isn't.
