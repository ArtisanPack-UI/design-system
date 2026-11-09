# KpiCard

A headline metric with change, trend and target, built from Stat.

Built from **Stat**.

## Anatomy

Root `.apui-card .apui-kpi-card`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: card, label, icon, value, delta, sparkline, target, period select.

## Props

| Prop | Values | Default |
|---|---|---|
| `stat` | StatProps | — |
| `trend` | number[] | — |
| `target` | {value, label} | — |
| `period` | string | — |

## Accessibility

- Sparkline and progress have text equivalents.

## Do

- Show a target only when one exists.

## Don’t

- Don’t put more than one sparkline in a card.
