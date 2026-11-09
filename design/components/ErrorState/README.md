# ErrorState

Explains what failed, what’s safe, and how to recover.

## Anatomy

Root `.apui-empty-state`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, icon tile or numeral, title, description, code, actions.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | 'request' \| 'offline' \| 'not-found' \| 'forbidden' | request |
| `code` | string — Reference for support | — |

## Accessibility

- Errors that replace content are announced; focus moves to the title on full-page errors.

## Do

- Include a reference code people can quote.

## Don’t

- Don’t blame the person.
