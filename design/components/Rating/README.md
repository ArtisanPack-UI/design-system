# Rating

Shows or collects a 1–5 star score.

## Anatomy

Root `.apui-rating`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, star, half, value, count.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | number | — |
| `readOnly` | boolean | true |
| `size` | 'sm' \| 'md' \| 'lg' | md |
| `count` | number — Number of reviews | — |

## Accessibility

- Read-only: role=img with “4.2 out of 5”.
- Input: a radio group of 5 options with arrow-key support.

## Do

- Show the numeric value next to the stars.

## Don’t

- Don’t use stars for anything that isn’t a quality judgment.
