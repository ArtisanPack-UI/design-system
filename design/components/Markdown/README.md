# Markdown

Renders Markdown with the shared prose styles; optional write and preview tabs.

## Anatomy

Root `.apui-prose`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, headings, paragraphs, lists, task list, blockquote, code, table, image.

## Props

| Prop | Values | Default |
|---|---|---|
| `source` | string | — |
| `mode` | 'preview' \| 'write' \| 'split' | preview |
| `sanitize` | boolean | true |

## Accessibility

- Headings keep their levels; tables keep header cells.
- Task-list checkboxes are real checkboxes.

## Do

- Cap line length with measure.

## Don’t

- Don’t render untrusted HTML.
