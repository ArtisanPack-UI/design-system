---
title: Themes
menu_order: 1
---

# Themes

Three themes ship with the system: **light**, **dark** and **high contrast**. Each is a complete set of color, surface and shadow tokens, checked for contrast on its own.

```html
<html data-theme="dark">
```

With no `data-theme` attribute, the tokens use the light theme.

## High contrast

High contrast raises every contrast pair, removes shadows in favor of edges, makes glass opaque and gives soft status surfaces a visible edge. It's an explicit choice, never picked automatically. Windows forced-colors mode is handled separately: the focus ring and the components that draw state with color keep it visible there.

## Letting visitors choose

The [ThemeToggle](components/theme-toggle) component offers four choices: **Light**, **Dark**, **High contrast** and **System**. System follows the operating system's light or dark setting and updates live when it changes. The choice is stored in `localStorage` under `apui-theme`, so it persists across visits, and every toggle on the page, and in other tabs, stays in sync.

## Applying the theme before the first paint

A stored theme has to be applied before the browser paints, or a dark-mode visitor sees a flash of the light theme. A small blocking script in `<head>` does it:

| Stack | Add |
|---|---|
| Livewire / Blade | `@apuiThemeScript` |
| React | `<ThemeScript />` from `@artisanpack-ui/react` |
| Vue | `<ThemeScript />` from `@artisanpack-ui/vue`, or `useHead` with `themeScript()` in Nuxt |
| Static `index.html` | Inline the output of `themeScript()` from `@artisanpack-ui/behavior` |

Put it first in `<head>`, before any stylesheet. Until a visitor makes a choice, the script applies their system's light or dark setting. All four produce the same script.

## From JavaScript

The helpers behind ThemeToggle are exported from `@artisanpack-ui/behavior`:

```ts
import { applyTheme, resolveTheme } from '@artisanpack-ui/behavior';

applyTheme('dark'); // sets data-theme on <html>, stores the choice, tells every toggle
resolveTheme('system'); // 'light' or 'dark', from the OS setting
```

## Themed regions

Any element can set its own theme:

```html
<section data-theme="dark" style="background: var(--apui-surface-page)">
  …
</section>
```

An element with `data-theme` resets its text color and `color-scheme` for its subtree, but doesn't paint a background. Put a themed region on a surface: a component such as [Card](components/card), or `background: var(--apui-surface-page)`.
