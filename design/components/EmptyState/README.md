# EmptyState

Explains why there’s nothing here and what to do next.

## Anatomy

Root `.apui-empty-state`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, icon tile, title, description, actions.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | 'first-use' \| 'no-results' \| 'cleared' | first-use |
| `size` | 'sm' \| 'md' | md |
| `align` | 'center' \| 'start' | center |

## Accessibility

- Title is a heading at the right level for its container.

## Do

- Offer one primary action.

## Don’t

- Don’t use illustrations that carry meaning without text.
