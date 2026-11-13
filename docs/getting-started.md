---
title: Getting Started
menu_order: 2
---

# Getting Started

You rarely install the design system on its own. Install the component library for your stack and it brings the design system with it:

| You build with | Install | Guide |
|---|---|---|
| Livewire or Blade | `composer require artisanpack-ui/livewire-ui-components` | [Livewire](Getting-Started-Livewire) |
| React | `npm install @artisanpack-ui/react @artisanpack-ui/css` | [React](Getting-Started-React) |
| Vue | `npm install @artisanpack-ui/vue @artisanpack-ui/css` | [Vue](Getting-Started-Vue) |

Each library renders the same components with the same API, so the [component pages](Components) cover all three stacks, with a tab per stack.

## The three pieces every app needs

Whatever the stack, a page needs:

1. **The CSS.** `@artisanpack-ui/css` holds the tokens, the presets and every component's styles, in cascade layers. Livewire apps can load a prebuilt copy instead of bundling it.
2. **The behavior engine.** Interactive components (dialogs, menus, comboboxes, tabs and the rest) run on `@artisanpack-ui/behavior`. React and Vue get it as a dependency; Livewire registers it with Alpine.
3. **The theme script** (recommended). A tiny blocking script in `<head>` that applies the visitor's stored theme before the first paint, so a dark-mode visitor never sees a flash of light theme.

## Choosing how to load the CSS

| Setup | Use |
|---|---|
| No Tailwind | `@import '@artisanpack-ui/css';` |
| Tailwind v4 | The layer order line, Tailwind, then the design system. See [With Tailwind](Getting-Started-Tailwind) |
| Your own visual styles | `@artisanpack-ui/css/headless`: the same markup, ARIA and behavior with no component styles. See [Headless](Theming-Headless) |
| No build step (Livewire) | The prebuilt assets. See [Without a Bundler](Getting-Started-Without-A-Bundler) |

## Upgrading from an earlier version?

Livewire UI Components 3.0 and `@artisanpack-ui/react` and `@artisanpack-ui/vue` 2.0 are the first releases built on the design system, and they replace DaisyUI. The [upgrade guides](Upgrade) walk through the automated upgrade tools and everything they can't do for you.

## Next steps

- [Foundations](Foundations): the tokens behind every component.
- [Theming](Theming): themes, density, presets and your own brand.
- [Components](Components): every component, with live examples for each stack.
