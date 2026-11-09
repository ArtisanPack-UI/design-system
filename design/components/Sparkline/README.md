# Sparkline

A word-sized trend line, area or bar with no axes.

## Anatomy

Root `.apui-sparkline`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: svg, line, area, dot, bar, baseline.

## Props

| Prop | Values | Default |
|---|---|---|
| `data` | number[] | — |
| `kind` | 'line' \| 'area' \| 'bar' | line |
| `width · height` | px | 96 · 28 |

## Accessibility

- role=img with a label that states the latest value and trend.
- Values are available in the table or tooltip.

## Do

- Use the same scale for sparklines in one column.

## Don’t

- Don’t color by up or down; the number beside it says that.
