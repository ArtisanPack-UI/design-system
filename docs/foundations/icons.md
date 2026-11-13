---
title: Icons
menu_order: 7
---

# Icons

Components take icons by name: `leadingIcon="plus"` on a React Button, `leading-icon="plus"` on a Blade one. A name resolves through an icon registry that every stack shares, so the same name draws the same SVG in Livewire, React and Vue.

## The default set

The registry ships with a subset of [Lucide](https://lucide.dev) (ISC license): the icons the components draw themselves, plus common ones for your own use. Names are Lucide's, in kebab-case (`chevron-down`, `circle-alert`, `log-out`).

Every icon renders the same way:

- A 24×24 `<svg>` with `stroke="currentColor"` at stroke width 1.5, so it takes the text color around it.
- Sized by the component or part it sits in, from `--apui-icon-size-sm` (14px), `-md` (16px) and `-lg` (20px).
- `aria-hidden="true"`, because an icon beside text is decorative. The [Icon](components/icon) component's `label` makes a standalone icon `role="img"` with an accessible name.

## Adding or replacing icons

Register more names, or replace one, in your stack's registry. In React and Vue:

```ts
import { registerIcons } from '@artisanpack-ui/behavior/icons';

registerIcons({
  'brand-logo': '<path d="M4 4h16v16H4z"/><circle cx="12" cy="12" r="4"/>',
});
```

Each value is the inside of a 24×24 `<svg>`. In Livewire, register them with the package's icon registry (see the Livewire UI Components docs).

**Registered icons are trusted markup.** Every stack injects them as HTML, so the registry only accepts plain shapes (`path`, `circle`, `rect`, `line`, `polyline`, `polygon`, `ellipse` and `g`) and rejects event handlers, `href`, `style` and script URLs. Never register icons from user or CMS input.

Any open-licensed icon set drawn on a 24px grid fits the system. A slot or a node you pass to a component's icon part always overrides the name.

### Livewire: existing icon names

Livewire UI Components falls back to Blade Icons for names outside the registry, so Heroicons (`o-user`, `s-home`) and Font Awesome (`fa-user`) names from 2.x keep rendering.

## Right-to-left

Icons that point a direction flip under `dir="rtl"`. The registry keeps the list of directional icons, `arrow-left`, `arrow-right`, `chevron-left` and `chevron-right` by default, and every component follows it. Add your own directional icons with `registerDirectionalIcons()` (`IconRegistry::registerDirectional()` in Livewire), or set `mirror` on a single [Icon](components/icon).

Non-directional icons, numbers, media controls and chart time axes never mirror.

## The license

The Lucide license notice (ISC, plus MIT for the icons derived from Feather) ships with the icon set wherever it's copied.
