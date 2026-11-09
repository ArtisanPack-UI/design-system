# Pagination

Moves between pages of a long list.

## Anatomy

Root class `.apui-pagination / .apui-pagination-item`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, page, current, ellipsis, previous, next, summary.

## Props

| Prop | Values | Default |
|---|---|---|
| `page · pageCount` | numbers | — |
| `siblings` | pages shown around current | 1 |
| `showSummary` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-radius-full, --apui-control-height-sm, --apui-selected-bg, --apui-selected-border, --apui-state-hover

## Accessibility

- nav with aria-label; current page uses aria-current=page.
- Previous and next arrows mirror in RTL.

## Do

- Pair with a “Rows per page” Select on tables.

## Don’t

- Don’t paginate fewer than ~25 items.
