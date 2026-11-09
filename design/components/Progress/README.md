# Progress

Linear progress: determinate, indeterminate or segmented.

## Anatomy

Root `.apui-progress`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, head, label, value, track, bar, segments.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | number | — |
| `max` | number | 100 |
| `indeterminate` | boolean | false |
| `size` | 'sm' \| 'md' \| 'lg' | md |
| `color` | 'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info' | primary |

## Accessibility

- role=progressbar with aria-valuenow and a label.
- Track has an edge so it’s visible at 3:1.

## Do

- Show units (“8 of 12”) when they’re meaningful.

## Don’t

- Don’t use red unless something is wrong.
