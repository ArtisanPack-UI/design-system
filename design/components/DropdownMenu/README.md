# DropdownMenu

A list of actions or options anchored to a trigger.

## Anatomy

Root class `.apui-dropdown-menu`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: trigger, root, label, item, icon, text, shortcut, check, separator.

## Props

| Prop | Values | Default |
|---|---|---|
| `items` | action, checkbox and radio items; groups with labels | — |
| `surface` | overlay · glass | overlay |
| `align` | start · center · end | start |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-menu-radius, --apui-menu-item-radius, --apui-surface-overlay, --apui-elevation-overlay, --apui-state-hover, --apui-selected-bg, --apui-color-error-text (danger item)

## Accessibility

- role=menu with menuitem, menuitemcheckbox and menuitemradio.
- Arrow keys move, typeahead jumps, Escape closes and returns focus.

## Do

- Put destructive items last, after a separator.

## Don’t

- Don’t hide the only way to do a primary task in a menu.
