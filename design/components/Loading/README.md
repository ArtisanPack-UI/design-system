# Loading

Shows that work is in progress.

## Anatomy

Root `.apui-spinner · .apui-dots · .apui-loading-overlay`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: spinner, dots, label, overlay.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | md |
| `label` | string | Loading |
| `delay` | ms — Wait before showing | 300 |

## Accessibility

- role=status with a text label; overlays set aria-busy on the region.
- Animation slows under reduced motion.

## Do

- Delay spinners so fast loads don’t flash.

## Don’t

- Don’t block the whole page for a partial load.
