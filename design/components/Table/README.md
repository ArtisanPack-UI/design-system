# Table

Rows of structured data with sorting, selection and density.

## Anatomy

Root class `.apui-table / .apui-table-grid`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: wrap, toolbar, title, scroll, table, head cell, sort, row, cell, select, primary, secondary, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `density` | compact · default · comfortable (via data-density) | default |
| `selectable` | boolean | false |
| `sortable columns` | per column | — |
| `stickyHeader` | boolean | true |
| `surface` | default · glass | default |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-table-radius, --apui-table-head-weight, row, --apui-cell-padding-x, --apui-surface-sunken (header), --apui-border-muted (dividers), --apui-state-hover, --apui-selected-bg, --apui-color-accent-soft (emphasis row)

## Accessibility

- Real table markup; sortable headers use aria-sort and a button.
- Selected rows set aria-selected; the select-all box can be mixed.
- Cell focus uses an inset ring so it never overlaps neighbors.

## Do

- End-align numbers with tabular figures.
- Use compact for operational screens, comfortable for browsing.

## Don’t

- Don’t color whole rows by status; use a Badge.
