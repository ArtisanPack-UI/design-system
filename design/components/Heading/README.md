# Heading

Titles from the type scale; semantic level and visual size are set separately.

## Anatomy

Root `.apui-heading`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, eyebrow.

## Props

| Prop | Values | Default |
|---|---|---|
| `level` | 1–6 — Semantic level | — |
| `size` | 1–6 — Visual size, defaults to level | — |

## Accessibility

- Keep one h1 per page and don’t skip levels.

## Do

- Use the eyebrow for section context, not a second heading.

## Don’t

- Don’t go heavier than 600.
