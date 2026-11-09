# Drawer

A panel that slides in from an edge for filters, details or secondary tasks.

## Anatomy

Root `.apui-drawer · .apui-sheet`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: scrim, root, header, title, description, close, body, footer; sheet, handle.

## Props

| Prop | Values | Default |
|---|---|---|
| `side` | 'end' \| 'start' \| 'bottom' | end |
| `size` | 'sm' \| 'md' \| 'lg' | md |
| `modal` | boolean | true |

## Accessibility

- Modal drawers trap focus and close on Esc; focus returns to the trigger.
- Side follows reading direction (end = right in LTR, left in RTL).

## Do

- Put the primary action in the footer.

## Don’t

- Don’t open a drawer from a drawer.
