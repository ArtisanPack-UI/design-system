---
title: Component Markup
menu_order: 2
---

# Component Markup

All three stacks render the same markup for a component, so the same CSS targets it whether it came from Blade, React or Vue.

```html
<button class="apui-button" data-variant="soft" data-color="success" data-size="sm">
  <span data-scope="button" data-part="icon" aria-hidden="true">…</span>
  Approve
</button>
```

## One root class

Each component has one root class, `apui-` plus its name in kebab-case: `apui-button`, `apui-card`, `apui-dropdown-menu`. There are no modifier classes.

## Variants are data attributes

| Attribute | Values |
|---|---|
| `data-variant` | The component's variants, such as `solid`, `soft`, `outline`, `ghost`, `link` |
| `data-color` | `primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error`, `info` |
| `data-size` | `xs`, `sm`, `md`, `lg`, `xl`, where the component has sizes |
| `data-surface` | `default`, or `glass` on components that support [glass](Theming-Glass) |

## State is native or a data attribute

Where the platform has a state, the components use it: `:hover`, `:focus-visible`, `:disabled`, `[aria-expanded="true"]`, `[aria-selected="true"]`. Otherwise:

| Attribute | Meaning |
|---|---|
| `data-state` | `open` or `closed`, `checked` or `unchecked`, and the like |
| `data-invalid` | The field has an error |
| `data-disabled` | The component is disabled where `:disabled` doesn't apply |
| `data-orientation` | `horizontal` or `vertical` |

## Parts

Every element inside a component is a named **part**, marked with `data-scope` (the component) and `data-part` (the part):

```html
<div class="apui-card">
  <div data-scope="card" data-part="header">
    <h3 data-scope="card" data-part="title">Invoices</h3>
  </div>
  <div data-scope="card" data-part="body">…</div>
</div>
```

Scope part selectors by `data-scope`, so a card inside a dialog never picks up the dialog's `title` styles:

```css
[data-scope='card'][data-part='title'] { … }
```

Each [component page](Components) lists its parts. Part names are shared across components where they mean the same thing: `root`, `label`, `control`, `hint`, `error`, `icon`, `header`, `title`, `body`, `footer`, `trigger`, `content`.

## Adding classes to a part

Every stack takes extra classes per part through a `classes` prop, keyed by part name:

```blade
<x-artisanpack-card :classes="['title' => 'font-mono', 'body' => 'space-y-4']" title="Invoices">…</x-artisanpack-card>
```

```tsx
<Card classes={{ title: 'font-mono', body: 'space-y-4' }} title="Invoices">…</Card>
```

```vue
<Card :classes="{ title: 'font-mono', body: 'space-y-4' }" title="Invoices">…</Card>
```

A plain `class` (`className` in React) goes on the component's root. On overlays (Dialog, DropdownMenu, Drawer, Popover), the root is the panel itself.

## IDs

Every part gets a stable `id` derived from the component's `id`. Set `id` on the component when you need to reference a part from elsewhere (for example `aria-describedby`), or to keep IDs stable across renders.
