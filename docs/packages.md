---
title: Packages
menu_order: 9
---

# Packages

The design system is published as six npm packages and one Composer package. Apps usually install only the component library for their stack and `@artisanpack-ui/css`; the rest come along as dependencies or are for tooling.

| Package | What it is | Who installs it |
|---|---|---|
| [`@artisanpack-ui/tokens`](Packages-Tokens) | The design tokens as CSS, TypeScript, PHP and DTCG, the presets, and the preset generator | Comes with `css`; install it directly to read tokens in code |
| [`@artisanpack-ui/css`](Packages-Css) | The plain-CSS component layer, headless build and optional Tailwind preset | Every app |
| [`@artisanpack-ui/behavior`](Packages-Behavior) | The interaction engine, with Alpine, React and Vue adapters, plus the icon registry and theme helpers | Livewire apps with Vite; a dependency of the React and Vue libraries |
| [`@artisanpack-ui/manifest`](Packages-Manifest) | One JSON contract per component: props, parts, events, accessibility | Tooling and component authors |
| [`@artisanpack-ui/codemods`](Packages-Codemods) | The upgrade codemods for React and Vue, and the upgrade rules | Run once, with `npx`, when upgrading |
| [`@artisanpack-ui/testing`](Packages-Testing) | The quality gates: visual regression, accessibility and API parity | Component authors |
| `artisanpack-ui/design-system` (Composer) | The PHP side of the manifest and the quality gates | Livewire UI Components; component authors in PHP |

All packages are MIT licensed. Source: [ArtisanPack-UI/design-system](https://github.com/ArtisanPack-UI/design-system).

## Versions

The design system packages start at 1.0, except `@artisanpack-ui/tokens`. It started life alongside the React package, whose 1.x line uses tokens 1.x, so the design system's release of it is 2.0.0. Tokens 1.x, used by `@artisanpack-ui/react` and `@artisanpack-ui/vue` 1.x, is frozen.
