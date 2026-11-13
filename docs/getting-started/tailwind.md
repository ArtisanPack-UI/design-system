---
title: With Tailwind
menu_order: 5
---

# With Tailwind

Tailwind is never required: every component is styled by the design system's own CSS. Apps that use Tailwind v4 keep it, and can add utilities generated from the design tokens.

## Set up

In your Tailwind entry stylesheet:

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind'; /* optional */
```

The first line matters. It places the design system's `apui` layer between Tailwind's `base` and `components` layers, so:

- Tailwind's Preflight reset never restyles a component.
- A Tailwind utility you put on a component still wins over the component's own styles.

The last import is optional. It adds utilities generated from the tokens, such as `bg-surface-page`, `text-muted` and `rounded-control`. See [Tailwind Utilities](Styling-Tailwind-Utilities) for the full list.

## Livewire: let Tailwind see the component views

Tailwind only generates the classes it finds in your source files. If you use Tailwind classes inside slots and attributes you pass to the components, those are in your own views and already found. To also scan the package's views, add `@source` lines:

```css
@source "../../vendor/artisanpack-ui/livewire-ui-components/resources/views/**/*.php";
@source "../../vendor/artisanpack-ui/livewire-ui-components/src/View/Components/**/*.php";
```

`php artisan livewire-ui-components:install --assets=bundler --tailwind` writes all of this for you.

## The preset never changes Tailwind's defaults

The token utilities only add names; none of Tailwind's own utilities change. Tailwind's `font-sans` stays as your app set it. To make it the design system's sans-serif (Geist), add it to your own theme:

```css
@theme {
  --font-sans: var(--apui-font-family-sans);
}
```

## Coming from DaisyUI

Remove `@plugin "daisyui";` and any `@plugin "daisyui/theme"` block. The [upgrade guides](Upgrade) map every DaisyUI class and theme variable to its token or component.
