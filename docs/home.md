---
title: ArtisanPack UI Design System Documentation Home
menu_order: 1
---

# ArtisanPack UI Design System

The ArtisanPack UI design system is the shared foundation under every ArtisanPack UI component library. It defines the design tokens, the CSS, the interaction behavior and the component APIs once, and three stacks build on it:

| Stack | Package | Version |
|---|---|---|
| Livewire and Blade | `artisanpack-ui/livewire-ui-components` | 3.0 |
| React | `@artisanpack-ui/react` | 2.0 |
| Vue | `@artisanpack-ui/vue` | 2.0 |

A Button, a Combobox or a Dialog is the same component in all three: the same props, the same parts, the same keyboard behavior and the same markup, so an app can move between stacks, or mix them, without relearning anything. Tailwind is optional, and nothing depends on DaisyUI.

## What's in it

- **Design tokens** in W3C DTCG format: every color, size, radius, shadow and duration, built to CSS custom properties, TypeScript and PHP.
- **Themes** (light, dark and high contrast), **density** (compact, default and comfortable) and **presets** (named brand looks), all switched with an attribute on any element.
- **A plain-CSS component layer** in cascade layers, so your own CSS always wins without `!important`. A headless build drops the visuals and keeps the markup and behavior.
- **A behavior engine** built on Zag state machines, with adapters for Alpine (Livewire), React and Vue, so every stack handles focus, keyboard and ARIA the same way.
- **WCAG 2.2 AA** throughout, with right-to-left support built in.

## Table of Contents

- **Getting Started**
  - [Overview](Getting-Started)
  - [Livewire](Getting-Started-Livewire)
  - [React](Getting-Started-React)
  - [Vue](Getting-Started-Vue)
  - [Without a Bundler](Getting-Started-Without-A-Bundler)
  - [With Tailwind](Getting-Started-Tailwind)

- **Foundations**
  - [Overview](Foundations)
  - [Design Tokens](Foundations-Design-Tokens)
  - [Color](Foundations-Color)
  - [Typography](Foundations-Typography)
  - [Spacing and Density](Foundations-Spacing-And-Density)
  - [Shape and Elevation](Foundations-Shape-And-Elevation)
  - [Motion](Foundations-Motion)
  - [Icons](Foundations-Icons)

- **Theming**
  - [Overview](Theming)
  - [Themes](Theming-Themes)
  - [Presets](Theming-Presets)
  - [Brand Presets](Theming-Brand-Presets)
  - [Customizing Tokens](Theming-Customizing-Tokens)
  - [Glass](Theming-Glass)
  - [Headless](Theming-Headless)

- **Styling**
  - [Overview](Styling)
  - [Cascade Layers](Styling-Cascade-Layers)
  - [Component Markup](Styling-Component-Markup)
  - [Right-to-Left](Styling-Right-To-Left)
  - [Tailwind Utilities](Styling-Tailwind-Utilities)

- **Components**
  - [All Components](Components)

- **Accessibility**
  - [Accessibility](Accessibility)

- **Behavior Engine**
  - [Overview](Behavior)
  - [Alpine and Livewire](Behavior-Alpine-And-Livewire)
  - [React and Vue](Behavior-React-And-Vue)
  - [Positioning](Behavior-Positioning)
  - [Helpers](Behavior-Helpers)

- **Packages**
  - [Overview](Packages)
  - [tokens](Packages-Tokens)
  - [css](Packages-Css)
  - [behavior](Packages-Behavior)
  - [manifest](Packages-Manifest)
  - [codemods](Packages-Codemods)
  - [testing](Packages-Testing)

- **Upgrading**
  - [Overview](Upgrade)
  - [Livewire UI Components 2.x to 3.0](Upgrade-Livewire)
  - [React 1.x to 2.0](Upgrade-React)
  - [Vue 1.x to 2.0](Upgrade-Vue)

## Getting help

- **Issues:** [GitHub](https://github.com/ArtisanPack-UI/design-system/issues)
- **Source:** [ArtisanPack-UI/design-system](https://github.com/ArtisanPack-UI/design-system)

The design system is MIT licensed.
