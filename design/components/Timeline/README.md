# Timeline

Events in order, with icon or dot markers.

## Anatomy

Root `.apui-timeline`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: list, item, marker, head, time, body, card.

## Props

| Prop | Values | Default |
|---|---|---|
| `items` | Array<{icon?, color?, title, time, body?}> | — |
| `variant` | 'icon' \| 'dot' | icon |

## Accessibility

- Ordered list; times use time elements with datetime.

## Do

- Use relative times for recent events and dates for older ones.

## Don’t

- Don’t use Timeline for steps still to come; use Steps.
