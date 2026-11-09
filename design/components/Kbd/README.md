# Kbd

Shows a keyboard key or shortcut.

## Anatomy

Root `.apui-kbd`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: key, combo.

## Props

| Prop | Values | Default |
|---|---|---|
| `keys` | string[] | — |
| `size` | 'sm' \| 'md' | md |

## Accessibility

- Rendered as kbd elements; symbols like ⌘ have text alternatives where needed.

## Do

- Show platform-appropriate keys (⌘ on macOS, Ctrl elsewhere).

## Don’t

- Don’t use Kbd for buttons.
