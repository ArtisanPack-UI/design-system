# Code

Read-only code blocks with header, copy and optional line numbers; inline code.

## Anatomy

Root `.apui-code`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, header, file, language, copy, pre, line, highlight.

## Props

| Prop | Values | Default |
|---|---|---|
| `language` | string | — |
| `numbered` | boolean | false |
| `highlight` | number[] — Lines to emphasize | — |
| `fileName` | string | — |

## Accessibility

- Blocks are scrollable regions with a label; copy is announced.
- Code stays left-to-right inside RTL pages.

## Do

- Highlight at most a few lines to make a point.

## Don’t

- Don’t wrap code by default.
