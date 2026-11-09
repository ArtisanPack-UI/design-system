# RichTextEditor

Formatted text editing with a toolbar over the shared prose styles.

## Anatomy

Root `.apui-rich-text-editor`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, toolbar, button, divider, content, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `toolbar` | preset or list | default |
| `maxLength` | number | — |
| `output` | 'html' \| 'markdown' \| 'json' | html |

## Accessibility

- Toolbar is role=toolbar with roving focus; toggles use aria-pressed.
- Content is role=textbox with aria-multiline.
- Markdown shortcuts and keyboard shortcuts are documented.

## Do

- Keep the toolbar to the formats your output supports.

## Don’t

- Don’t offer colors or fonts; let the prose styles decide.
