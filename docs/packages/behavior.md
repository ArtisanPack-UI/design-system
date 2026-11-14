---
title: Behavior Package
menu_order: 3
---

# @artisanpack-ui/behavior

The interaction engine: Zag state machines and Floating UI positioning, with an adapter per stack, plus the icon registry and the theme helpers.

```bash
npm install @artisanpack-ui/behavior
```

`@artisanpack-ui/react` and `@artisanpack-ui/vue` depend on it, so React and Vue apps don't install it themselves. Livewire apps that bundle with Vite do. For your own React or Vue widgets, also install `@zag-js/react` or `@zag-js/vue`.

## Exports

| Import | What it is |
|---|---|
| `@artisanpack-ui/behavior` | The widget definitions, `createWidget`, positioning, the toaster, the theme helpers and the content and data helpers |
| `@artisanpack-ui/behavior/alpine` | The Alpine plugin |
| `@artisanpack-ui/behavior/react` | React hooks: `useDialog`, `useCombobox`, `useDropdownMenu`, `useTabs`, `useAccordion`, `useCollapse`, `useDrawer`, `usePopover`, `useTooltip`, `useToaster`, `useToast` and more |
| `@artisanpack-ui/behavior/vue` | Vue composables, with the same names |
| `@artisanpack-ui/behavior/icons` | The icon registry: `resolveIcon`, `iconSvg`, `registerIcons`, `registerDirectionalIcons` |
| `@artisanpack-ui/behavior/icons.json` | The default Lucide icon set as JSON |
| `@artisanpack-ui/behavior/alpine.global.js` | The Alpine plugin as one classic script, for pages without a bundler |

## Guides

- [Behavior Engine](Behavior): what it does and when you need it.
- [Alpine and Livewire](Behavior-Alpine-And-Livewire), [React and Vue](Behavior-React-And-Vue), [Positioning](Behavior-Positioning) and [Helpers](Behavior-Helpers).
