# Spotlight

A command palette: search across pages, records and actions.

## Anatomy

Root `.apui-spotlight`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: dialog, search, query, results, group label, item, tile, shortcut, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `groups` | Array<{label, items}> | — |
| `shortcut` | string | ⌘K |
| `recent` | boolean | true |

## Accessibility

- Dialog with a combobox and listbox; arrow keys move, Enter opens, Esc closes.
- Results count is announced.

## Do

- Show recent items when the query is empty.

## Don’t

- Don’t put destructive actions here without confirmation.
