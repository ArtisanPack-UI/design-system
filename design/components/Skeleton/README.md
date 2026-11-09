# Skeleton

Placeholder shapes that match the layout while content loads.

## Anatomy

Root `.apui-skeleton`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: block, text line, circle.

## Props

| Prop | Values | Default |
|---|---|---|
| `shape` | 'block' \| 'text' \| 'circle' | block |
| `width · height` | length | — |

## Accessibility

- The container sets aria-busy; skeletons are hidden from assistive tech.
- Shimmer stops under reduced motion.

## Do

- Match the real layout so nothing jumps.

## Don’t

- Don’t show skeletons for more than a few seconds; switch to a status.
