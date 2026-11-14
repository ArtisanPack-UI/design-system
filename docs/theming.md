---
title: Theming
menu_order: 4
---

# Theming

Everything visual is a token, so theming means changing tokens. There are five levels, from light to deep:

| Level | What you change | Page |
|---|---|---|
| **Theme** | Light, dark or high contrast, chosen by the visitor or by you | [Themes](Theming-Themes) |
| **Preset** | A named look: Ledger, Harbor, or your own | [Presets](Theming-Presets) |
| **Brand** | Your colors and fonts, generated into a preset that keeps every contrast check passing | [Brand Presets](Theming-Brand-Presets) |
| **Tokens** | Any single token, for the whole app, a region or one component | [Customizing Tokens](Theming-Customizing-Tokens) |
| **Visual layer** | The component styles themselves: replace them with your own | [Headless](Theming-Headless) |

[Glass](Theming-Glass) is a surface option on container components, not a theme.

## Attributes, not classes

Theme, density and preset are attributes, and any element can set them for everything inside it:

```html
<html data-theme="dark" data-preset="ledger">
  <aside data-theme="light" data-density="compact">
    A light, compact sidebar inside a dark Ledger page.
  </aside>
</html>
```

| Attribute | Values |
|---|---|
| `data-theme` | `light`, `dark`, `high-contrast` |
| `data-density` | `compact`, `default`, `comfortable` |
| `data-preset` | `ledger`, `harbor`, or a preset of your own |

Components never check these attributes. They read tokens, and the attributes reassign the tokens, which is why every component follows them, in every stack, with no props.

## What theming can't change

Some guarantees hold whatever you set: a visible focus ring, the 24px minimum target size, and each component's parts, ARIA and keyboard behavior.

Contrast (4.5:1 text, 3:1 edges) holds for the built-in themes and presets, and for any preset the [preset generator](Theming-Brand-Presets) writes: it refuses to write one that breaks a contrast floor. A color token you override by hand isn't checked, so check those pairs yourself. See [Customizing Tokens](Theming-Customizing-Tokens).
