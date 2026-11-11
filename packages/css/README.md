# @artisanpack-ui/css

Plain-CSS component layer for ArtisanPack UI. Tailwind is not required.

> **Not published yet.** This package holds the cascade layers, a scoped reset, the design tokens with the Ledger and Harbor presets, two utilities (`.apui-sr-only`, `.apui-focus-ring`) and the components built so far: Button, Input, Select, Checkbox, Card, Dialog, DropdownMenu and Toast (pilot, #44 to #51), with the field anatomy the form fields share in `field.css`. The first release is tracked in #81.

```css
@import '@artisanpack-ui/css';
```

Everything sits in `@layer apui.reset, apui.tokens, apui.components, apui.utilities`, so app CSS overrides any of it without `!important`. Set `data-theme`, `data-density` and `data-preset` on any element to switch theme, density and preset.

```html
<html data-theme="dark" data-preset="ledger">
  <section data-theme="light" data-density="compact">Any element can switch.</section>
</html>
```

## Entry points

| Import                           | For                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `@artisanpack-ui/css`            | Everything                                                                                                              |
| `@artisanpack-ui/css/headless`   | The same without the `apui.components` layer: identical markup, ARIA and behavior, no visual CSS. Bring your own styles |
| `@artisanpack-ui/css/tailwind`   | Optional Tailwind v4 utilities generated from the tokens (`bg-primary`, `text-muted`, `rounded-control`, …)             |
| `@artisanpack-ui/css/assets.php` | The entry points as a PHP array, for the Livewire package                                                               |

Brand presets are separate imports from `@artisanpack-ui/tokens/presets/<name>.css`. Make your own with `npx apui-generate-preset` ([docs](../../docs/tokens/README.md#brand-presets-the-generator-27)).

## With Tailwind v4

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind';
```

The first line puts the design system between Tailwind's Preflight and its utilities: Preflight never restyles a component, and a utility class on a component still wins. The preset only adds utilities and never redefines a Tailwind default, so components render the same with or without it. The full utility list is in [docs/css-conventions.md](../../docs/css-conventions.md#with-tailwind-24).

How to write component CSS for this package: [docs/css-conventions.md](../../docs/css-conventions.md).

Part of the [ArtisanPack UI Design System](../../README.md).
