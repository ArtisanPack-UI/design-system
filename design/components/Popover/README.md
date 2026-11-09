# Popover

An anchored, non-modal panel with interactive content.

## Anatomy

Root `.apui-popover`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, arrow, title, body, actions.

## Props

| Prop | Values | Default |
|---|---|---|
| `placement` | 'top' \| 'bottom' \| 'start' \| 'end' | bottom |
| `arrow` | boolean | true |

## Accessibility

- role=dialog with a label; focus moves in when it opens and returns on close; Esc closes.

## Do

- Use for short tasks tied to one control.

## Don’t

- Don’t put long forms in a popover.
