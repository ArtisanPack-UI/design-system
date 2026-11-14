---
title: Behavior Engine
menu_order: 8
---

# Behavior Engine

`@artisanpack-ui/behavior` is the interaction engine under every interactive component. It runs [Zag](https://zagjs.com) state machines for the hard widgets (dialogs, menus, comboboxes, tabs and the rest), positions floating content with [Floating UI](https://floating-ui.com), and has an adapter per stack:

| Stack | Import | Shape |
|---|---|---|
| Alpine (Livewire, Blade) | `@artisanpack-ui/behavior/alpine` | An Alpine plugin: `x-data="apuiDialog(…)"` and `x-apui:<part>` |
| React | `@artisanpack-ui/behavior/react` | Hooks: `useDialog`, `useCombobox`, … |
| Vue | `@artisanpack-ui/behavior/vue` | Composables: `useDialog`, `useCombobox`, … |

Every adapter runs the same widget definitions, so the markup, ARIA, `data-scope` and `data-part` attributes are identical in all three. That's what keeps a Blade dialog and a React dialog behaving the same.

## Do you need this?

**Usually not directly.** The Livewire, React and Vue components use the engine for you. Reach for it when you're building a widget of your own that the component libraries don't cover, and you want it to behave like the rest of the system.

## The widgets

The engine powers Accordion and Collapse, Dialog and Drawer, DropdownMenu, Combobox, Popover, Tooltip, Tabs, DatePicker, ColorPicker, the Toast stack and Spotlight. Simple components (Button, Input, Select, Checkbox and the like) stay native in each stack and don't need it.

| Page | Covers |
|---|---|
| [Alpine and Livewire](Behavior-Alpine-And-Livewire) | The Alpine plugin, `x-apui:<part>`, and the rules that keep widgets alive through Livewire morphs |
| [React and Vue](Behavior-React-And-Vue) | The hooks and composables, controlled and uncontrolled state |
| [Positioning](Behavior-Positioning) | Placing floating content, logically in right-to-left |
| [Helpers](Behavior-Helpers) | The theme helpers, the icon registry and the helpers behind the editors and data components |
