# Chart

A plot inside a Card: header, legend, plot and tooltip, using the chart tokens.

## Anatomy

Root class `.apui-chart`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, header, legend, swatch, plot, grid, axis, tooltip.

## Props

| Prop | Values | Default |
|---|---|---|
| `type` | bar · line · area · donut | — |
| `series` | assigned --apui-chart-1…6 in fixed order | — |
| `showTable` | boolean: data table view | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-chart-1…6, --apui-chart-grid, --apui-chart-axis, --apui-surface-overlay (tooltip)

## Accessibility

- Every chart has a title, a legend for 2+ series, and a table view.
- Tooltips open on hover and on keyboard focus of each mark.
- Light-mode --apui-chart-2, -4 and -6 sit under 3:1, so values are always reachable as labels or in the table.

## Do

- Assign series colors in order and keep them stable when filters change.
- Label one point (the max, the latest) rather than every point.

## Don’t

- No dual axes.
- Don’t reuse status colors for series.
