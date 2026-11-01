# Unified API vocabulary

> **Status:** Accepted (#4), 2026-10-31. It feeds the manifest schema in Phase 2.

One vocabulary for props, parts, slots and events across Blade, React and Vue. Each rule below reflects what the [API catalogue](api-differences.md) found in today's code. Machine-readable versions are [data/component-map.json](data/component-map.json) for component names and [data/api-aliases.json](data/api-aliases.json) for member names. The rename counts in the [codemod report](codemod-scope.md) follow from these, so changing a rule here means changing those files.

## Core props

| Prop | Values | Replaces |
|---|---|---|
| `variant` | `solid` · `soft` · `outline` · `ghost` · `link` | Livewire Button `variant` (which holds colors today), React/Vue `color="ghost"` and `color="outline"` |
| `color` | `primary` · `secondary` · `accent` · `neutral` · `success` · `warning` · `error` · `info` | Livewire's open string (Tailwind names and hex), `bgColor`, `textColor`, `colorAdjustment` |
| `size` | `xs` · `sm` · `md` · `lg` · `xl` | Adds `xl` to React and Vue. Today Livewire's `xl` silently renders `btn-lg` |
| `surface` | `default` · `raised` · `sunken` · `glass` | `glass`, `glassTint`, `glassTintOpacity` |
| `classes` | Map of part name to class string | `*Class`, `*Classes`, `*ClassName` (see Parts) |

Components only declare the props that apply to them. Component-specific values are allowed where the shared list doesn't fit: Tabs `variant` (`bordered` · `lifted` · `boxed`) and Loading `variant` (`spinner` · `dots` · …) are visual treatments, so the prop name still means the same thing.

### Decision: no arbitrary colors

Livewire's `color` accepts Tailwind names and hex values, resolved by `ColorGenerator`. Keeping that would mean runtime color math in every component in all three stacks, so it is dropped. `color` is the eight semantic names only, and anything else is set through tokens or `classes`. One-off colors stay possible:

```blade
<x-artisanpack-button style="--apui-button-bg: #7c3aed">Launch</x-artisanpack-button>
```

## Naming rules

| Rule | Use | Not |
|---|---|---|
| Direction is logical, so RTL works | `end`, `start` | `right`, `left` |
| One prop for orientation | `orientation="vertical"` | `vertical`, `horizontal`, and `inline` on option groups |
| Links use the HTML name | `href` | `link` |
| Booleans are positive adjectives or `hide*` | `hideError`, `collapsible` | `noIcon`, `withoutArrows`, `omitError` |
| Controlled selection | `value`, `defaultValue` | `selected`, `activeTab`, `defaultTab` |
| Controlled visibility | `open` | Stack-specific names |
| Tooltip position is one prop | `tooltip` + `tooltipPosition` | `tooltipLeft`, `tooltipRight`, `tooltipBottom` |

Today's Livewire API uses `no*`, `with*`, `without*`, `hide*`, `show*` and `has*` booleans interchangeably: compare `noIcon`, `withArrows`, `withoutArrows`, `hideProgress` and `showValue`. `hide*` is the one exception to "positive" because the default of showing something is what most components want.

Livewire keeps three conveniences that have no meaning elsewhere: `errorField`, `firstErrorOnly` and `navigate`.

## Parts

Every component exposes named parts, emitted as `data-part` and targeted through `classes`. These names apply wherever the part exists. A component may add its own, but must not rename a standard one.

| Part | Element |
|---|---|
| `root` | Outermost element |
| `label` | Field or group label |
| `control` | The interactive element (`input`, `select`, `button`) |
| `hint` | Help text |
| `error` | Validation message |
| `icon` | Leading icon |
| `iconEnd` | Trailing icon |
| `prefix`, `suffix` | Content inside the control's box |
| `prepend`, `append` | Attached content outside the control's box |
| `header`, `body`, `footer` | Regions of a container |
| `title`, `description` | Text within a container |
| `actions` | Button row |
| `trigger`, `content` | Overlay opener and panel |
| `item`, `indicator` | Repeated child and its state marker |

```blade
<x-artisanpack-input :classes="['label' => 'font-bold', 'hint' => 'text-xs']" />
```

```tsx
<Input classes={{ label: 'font-bold', hint: 'text-xs' }} />
```

`class` / `className` always goes to `root`. Glass on a single part, such as Table's `headerGlass`, is done through `classes` and a token rather than a dedicated prop.

## Slots

Slots use the same names as parts, in camelCase, with the same meaning everywhere.

| Stack | Convention | Example |
|---|---|---|
| Blade | Named slot | `<x-slot:actions>` |
| Vue | Named slot | `<template #actions>` |
| React | ReactNode prop | `actions={<Button />}` |

Scoped render content is named after the part and takes the item in every stack: `@scope('item', $item)` in Blade, `#item="{ item }"` in Vue and `renderItem` in React.

### Icons

This is the sharpest split in the API today. `icon` is a **string name** in Blade, a **ReactNode** in React and a **named slot** in Vue. **Decision:** all three stacks accept both forms. A string resolves through the icon registry, and a slot or node overrides it. String names are what make the Blade API and the manifest fixtures portable, so they need to work in React and Vue too.

## Events

One concept name, spelled the way each stack expects.

| Concept | Livewire / Alpine | React | Vue |
|---|---|---|---|
| Value changed | `wire:model` | `onValueChange` | `v-model` / `update:modelValue` |
| Open state changed | `wire:model` plus `open-change` | `onOpenChange` | `v-model:open` / `update:open` |
| Other events | `x-on:row-click`, `wire:row-click` | `onRowClick` | `@row-click` |

- Livewire and Alpine events are kebab-case browser events with no package prefix, except global bus events.
- Tense is present: `complete`, not `completed`. Livewire's Pin uses `completed` and React uses `onComplete`.
- Bare `onChange` stays the native DOM event in React. Today some components use it for value changes.
- Close is not a separate event. `onClose` (React), `close` (Livewire) and `update:open` (Vue) all become `open-change`.

## Data-driven vs compositional

Today Menu, Tabs, Steps and Timeline are compositional in Livewire (`<x-artisanpack-tab>` children) and data-driven in React and Vue (`tabs={[…]}`). Neither model can be codemodded into the other, so this has to be settled before those components are specified.

**Decision: support both, with composition as the base.** Composition is the only form that handles arbitrary content in a Blade slot, and it maps directly onto parts. Add the data prop as a convenience that renders the same children. All 26 downstream `tab` and 26 `menu-item` usages then keep working with their names unchanged.

Children are named `{parent}-item` or the singular form. New names follow that rule: `DropdownMenu` + `DropdownMenuItem`.

## Component names

Names describe what the component is, and the same word never means two things. Full list: [parity-matrix.md](parity-matrix.md).

| Today | Proposed | Why |
|---|---|---|
| `modal`, `Modal` | Dialog | Matches the pilot issue and the native element |
| `dropdown`, `Dropdown` | DropdownMenu | Distinguishes it from Select and Popover |
| `Radio`, `radio`, `radio-group`, `group` | RadioGroup | All are options-driven groups; `group` becomes a `variant` |
| Livewire `editor` | RichTextEditor | Matches React and Vue |
| React/Vue `Editor` | CodeEditor | `Editor` means TinyMCE in Livewire and a monospace textarea here |
| `SpotlightSearch` | Spotlight | Matches Livewire and #57 |
| `ErrorDisplay` | ErrorState | Pairs with EmptyState |
| Livewire `errors` | ValidationSummary | It is not ErrorState |
| `nav` | Navbar | Matches React and Vue |
| `header` | PageHeader | It is a section title, not a site header |
| `main` | AppShell | `main` is an HTML element name |
| `separator` | Divider | Matches React and Vue |
| `profile` | UserMenu | It is an avatar dropdown, not a profile |
| `colorpicker` | ColorPicker | Blade tag becomes `color-picker`, matching the other stacks |

Blade tags are the kebab-case form: `<x-artisanpack-dropdown-menu>`.

## Legacy consolidations

| Merge | Into | Status |
|---|---|---|
| `choices` + `choices-offline` | Combobox with `searchable` and `remote` modes | Planned (#54) |
| `radio` + `radio-group` + `group` | RadioGroup | Proposed |
| `heading` + `subheading` | Heading with `level` / `size` | Proposed |
| `menu*` | Menu family | Proposed |
| `step` + `steps`, `tab` + `tabs` | Keep as parent and child | Proposed |
| `tags` | Combobox `multiple` + `allowCustom` | Open |
| `select-group` | Select with option groups | Open |
| `datetime` | DatePicker `time` mode | Open (#55) |
| `progress-radial` | Progress `variant="radial"` | Open |
| `kpi-card` | Stat layout option | Open |
| `image-slider` | Carousel image mode | Open |
| `profile` | Docs recipe: Avatar + DropdownMenu | Open |
| `widget-grid` | Grid | Open |

"Open" items need a look at each component's spec before merging. They are the natural place to reduce the 25 Livewire-only components that would otherwise need React and Vue ports.

## Decisions

Accepted on 2026-10-31:

1. `color` takes the eight semantic names only.
2. `icon` accepts a string name or a node/slot in every stack.
3. Composition is the base, with data props as a convenience.
4. The renames under "Component names" stand, including `header → page-header` and `main → app-shell`.
5. `File` keeps its name, matching #53 and two of the three stacks. Vue's `FileUpload` is renamed, despite `File` shadowing the browser global in React and Vue.
