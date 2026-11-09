# ProgressRadial

Circular progress with the value in the center, built from Progress.

Built from **Progress**.

## Anatomy

Root `.apui-progress-radial`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, svg, track, bar, value, label.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | number | — |
| `size` | px | 64 |
| `thickness` | px | 6 |
| `color` | 'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info' | primary |

## Accessibility

- Same semantics as Progress.
- The ring fills in the reading direction.

## Do

- Use for a single headline percentage.

## Don’t

- Don’t place many rings side by side to compare values; use bars.
