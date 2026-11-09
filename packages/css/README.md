# @artisanpack-ui/css

Plain-CSS component layer for ArtisanPack UI. Tailwind is not required.

> **Not published yet.** This package holds the cascade layers, a scoped reset, the design tokens and two utilities (`.apui-sr-only`, `.apui-focus-ring`). Components arrive with the pilot (#44 on), and the optional Tailwind v4 preset (`@artisanpack-ui/css/tailwind`) with #24. The first release is tracked in #81.

```css
@import '@artisanpack-ui/css';
```

Everything sits in `@layer apui.reset, apui.tokens, apui.components, apui.utilities`, so app CSS overrides any of it without `!important`. Set `data-theme` and `data-density` on any element to switch theme and density.

How to write component CSS for this package: [docs/css-conventions.md](../../docs/css-conventions.md).

Part of the [ArtisanPack UI Design System](../../README.md).
