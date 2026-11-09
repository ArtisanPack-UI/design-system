# Range

A slider for a single value or a two-thumb range.

## Anatomy

Root `.apui-range`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, track, fill, thumb, bubble, ticks.

## Props

| Prop | Values | Default |
|---|---|---|
| `min · max · step` | number | 0 · 100 · 1 |
| `value` | number \| [number, number] | — |
| `showValue` | 'never' \| 'focus' \| 'always' | focus |
| `marks` | Array<{value,label}> | — |
| `color` | 'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info' | primary |

## Accessibility

- Native input type=range per thumb, with aria-valuetext for formatted values (“$200k”).
- Arrow keys step, PageUp/PageDown step by 10%, Home/End jump.
- Thumb is 18px with a 24px hit area.

## Do

- Pair with number inputs when exact values matter.

## Don’t

- Don’t use for values people need to type precisely, like prices.
