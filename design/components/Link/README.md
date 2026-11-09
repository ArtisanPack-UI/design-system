# Link

Navigates somewhere; inline links are always underlined.

## Anatomy

Root `.apui-link`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, icon.

## Props

| Prop | Values | Default |
|---|---|---|
| `tone` | 'primary' \| 'muted' | primary |
| `standalone` | boolean | false |
| `external` | boolean — Adds an icon and “opens in a new tab” | false |

## Accessibility

- Inline links are underlined so color isn’t the only cue.
- External links announce that they open a new tab.

## Do

- Use Button for actions and Link for navigation.

## Don’t

- Don’t write “click here”.
