# ListItem

A row with leading, title, description and trailing slots.

## Anatomy

Root `.apui-list · .apui-list-item`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: list, item, leading, title, description, trailing.

## Props

| Prop | Values | Default |
|---|---|---|
| `interactive` | boolean | false |
| `selected` | boolean | false |
| `disabled` | boolean | false |
| `variant` | 'plain' \| 'bordered' \| 'divided' | plain |

## Accessibility

- Interactive rows are links or buttons; selection uses aria-selected or aria-current.

## Do

- Keep trailing content short.

## Don’t

- Don’t put two primary actions in one row.
