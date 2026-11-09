# Divider

Separates content with --apui-border-muted; horizontal, vertical or labeled.

## Anatomy

Root `.apui-divider`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, label.

## Props

| Prop | Values | Default |
|---|---|---|
| `orientation` | 'horizontal' \| 'vertical' | horizontal |
| `label` | string | — |
| `strength` | 'subtle' \| 'strong' | subtle |

## Accessibility

- role=separator; decorative dividers are hidden from assistive tech.

## Do

- Prefer spacing; add a divider only when groups blur together.

## Don’t

- Don’t stack dividers with card edges.
