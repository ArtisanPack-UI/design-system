# CodeEditor

Editable code with tabs, line numbers, active line, diagnostics and status bar.

## Anatomy

Root `.apui-code-editor`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, tabs, tab, language select, gutter, line, caret, diagnostic, status.

## Props

| Prop | Values | Default |
|---|---|---|
| `language` | string | — |
| `readOnly` | boolean | false |
| `diagnostics` | Array<{line, message, severity}> | — |

## Accessibility

- Tab inserts indentation; Esc then Tab leaves the editor (documented).
- Diagnostics are listed in text, not only underlined.

## Do

- Use the syntax tokens so themes and brands carry over.

## Don’t

- Don’t hard-code a dark editor inside a light theme.
