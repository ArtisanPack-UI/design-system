# Tooltip

A short label on hover and focus.

## Anatomy

Root `.apui-tooltip`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, arrow, kbd.

## Props

| Prop | Values | Default |
|---|---|---|
| `content` | string | — |
| `placement` | 'top' \| 'bottom' \| 'start' \| 'end' | top |
| `delay` | ms | 400 |

## Accessibility

- Shown on hover and keyboard focus; dismissible with Esc; hoverable (WCAG 1.4.13).
- Linked with aria-describedby; never the only label for an icon button.

## Do

- Show shortcuts in tooltips.

## Don’t

- Don’t put links or buttons in a tooltip; use Popover.
