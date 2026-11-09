# ThemePreview

Selectable cards that show a live miniature of each theme or preset.

## Anatomy

Root `.apui-theme-card`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: card, frame, miniature, label.

## Props

| Prop | Values | Default |
|---|---|---|
| `options` | Array<{value, label, theme?, preset?}> | — |
| `value` | string | — |

## Accessibility

- Radio group; the miniature is decorative and the label carries the name.

## Do

- Render miniatures with the real tokens, so they stay accurate after a rebrand.

## Don’t

- Don’t use screenshots that go stale.
