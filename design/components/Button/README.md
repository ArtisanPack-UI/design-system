# Button

Triggers an action; the one solid primary Button marks the main action of a view.

## Anatomy

Root class `.apui-button`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, icon, label, spinner.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | solid · soft · outline · ghost · link | solid |
| `color` | primary · secondary · accent · neutral · success · warning · error · info | primary |
| `size` | xs · sm · md · lg · xl | md |
| `iconOnly` | boolean, requires aria-label | false |
| `loading` | boolean, sets aria-busy and keeps width | false |
| `disabled` | boolean | false |
| `href` | renders an anchor with the same styles | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-button-radius, --apui-button-weight, --apui-control-height-xs…xl, --apui-color-{c}, -hover, -foreground, -soft, -soft-foreground, -border, -text, --apui-state-hover, --apui-state-pressed, --apui-focus-ring-color

## Accessibility

- Uses a native button element (or anchor with href).
- Icon-only buttons need aria-label; xs buttons extend their hit area to --apui-target-size-min (24px).
- Loading keeps the label for screen readers and sets aria-busy.
- Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.

## Do

- One solid primary per view; pair it with outline or ghost neutral for secondary actions.
- Use error solid only for destructive confirmation, usually inside a Dialog.

## Don’t

- Don’t use accent for actions; it is reserved for emphasis.
- Don’t stack more than three buttons in a row; move the rest into a DropdownMenu.
