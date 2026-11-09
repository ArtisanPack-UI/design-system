# Icon

Lucide icons at four sizes, and soft-colored icon tiles.

## Anatomy

Root `.apui-icon · .apui-icon-tile`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: svg, tile.

## Props

| Prop | Values | Default |
|---|---|---|
| `name` | string — Lucide name | — |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | md |
| `label` | string — Accessible name when meaningful | — |
| `mirror` | boolean — Flip in RTL | auto |

## Accessibility

- Decorative icons are aria-hidden; meaningful icons have a label.
- Directional icons mirror in RTL.

## Do

- Swap the icon set by passing icons as slots; keep a 24px grid.

## Don’t

- Don’t mix icon sets in one view.
