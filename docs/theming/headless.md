---
title: Headless
menu_order: 6
---

# Headless

Headless mode drops the component styles and keeps everything else. The markup, ARIA, keyboard behavior and focus management from the Livewire, React and Vue components are identical; only the visual CSS is gone. Use it when your app brings its own visual design.

## Turn it on

Import the headless stylesheet instead of the full one:

```css
@import '@artisanpack-ui/css/headless';
```

In Livewire without a bundler:

```blade
@artisanpackStyles('headless')
```

Headless keeps the reset, the tokens and the utilities, and leaves out the `apui.components` layer. Your CSS can still read every token.

## What you style

Every component renders a root class and data attributes you can target:

```css
.apui-button {
  padding: 0 var(--apui-space-4);
  border-radius: var(--apui-radius-control);
}

.apui-button[data-color='primary'] {
  background: var(--apui-color-primary);
  color: var(--apui-color-primary-foreground);
}

[data-scope='dialog'][data-part='backdrop'][data-state='open'] {
  background: var(--apui-backdrop);
}
```

See [Component Markup](Styling-Component-Markup) for how variants, states and parts are marked up.

## Accessibility stays intact

Component CSS never decides what assistive technology sees. State lives in the markup (`hidden`, `aria-expanded`, `data-state`), and CSS only styles it, so a closed menu is hidden whether the visual layer is there or not. The design system's tests compare the DOM and the accessibility tree with and without the components layer.

When you write your own styles, keep that property: don't use `display: none` to show a state the markup doesn't already express, and don't put meaningful text in `content`.
