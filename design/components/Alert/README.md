# Alert

An inline message about the state of a page or section.

## Anatomy

Root class `.apui-alert`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, icon, title, description, actions, close.

## Props

| Prop | Values | Default |
|---|---|---|
| `color` | info · success · warning · error · neutral … | neutral |
| `variant` | soft · outline · solid | soft |
| `surface` | glass optional | — |
| `dismissible` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-alert-radius, --apui-color-{c}-soft, --apui-color-{c}-soft-foreground, --apui-color-{c}-border, --apui-color-{c}

## Accessibility

- role=alert for errors, role=status otherwise.
- Meaning carried by the icon and title, not color alone.

## Do

- Say what happened and what to do next.

## Don’t

- No colored left border; status comes from the tint and icon.
