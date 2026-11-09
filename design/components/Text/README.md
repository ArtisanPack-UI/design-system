# Text

Body text with size, tone, weight, truncation and clamping.

## Anatomy

Root `.apui-text`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'lead' | md |
| `tone` | 'default' \| 'muted' \| 'success' \| 'warning' \| 'error' | default |
| `weight` | 'regular' \| 'medium' \| 'semibold' | regular |
| `truncate · clamp` | boolean · number | — |

## Accessibility

- Truncated text has its full value available (title or tooltip).
- Status tones are never the only signal.

## Do

- Keep paragraphs within measure.

## Don’t

- Don’t use muted text for anything people must read.
