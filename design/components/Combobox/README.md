# Combobox

Text input that filters a listbox; pick a match, or create a new value.

## Anatomy

Root `.apui-combobox`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: field, label, control, icon, listbox, option, mark, description, create, empty.

## Props

| Prop | Values | Default |
|---|---|---|
| `options` | Array<{value,label,description?}> — Options to filter | — |
| `allowCreate` | boolean — Offer “Create …” for unmatched text | false |
| `async` | boolean — Load options as the person types | false |
| `size` | 'sm' \| 'md' \| 'lg' | md |

## Accessibility

- role=combobox with aria-expanded, aria-controls and aria-activedescendant.
- Matches are shown with weight and underline, not color.
- Empty state explains what to do next.

## Do

- Debounce async search and show a spinner in the trailing icon.

## Don’t

- Don’t use when there are fewer than ~8 options; use Select.
