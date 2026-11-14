---
'@artisanpack-ui/css': minor
---

Add the cascade layer scaffold (#21): a scoped reset, the design tokens, and the `apui-sr-only` and `apui-focus-ring` utilities, bundled into one `dist/index.css`. App CSS overrides every layer without `!important`. Theme and density switch on any element with `data-theme` and `data-density` (#22).
