# PageHeader

Title block at the top of a page: breadcrumbs, title, description, meta, actions and tabs.

## Anatomy

Root class `.apui-page-header`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, breadcrumbs, row, title, description, meta, actions, tabs.

## Props

| Prop | Values | Default |
|---|---|---|
| `title` | string | — |
| `description` | string | — |
| `actions` | slot | — |
| `tabs` | slot | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

heading-xl, --apui-text-muted, measure, --apui-space-2

## Accessibility

- Title is the page’s h1.

## Do

- Keep the primary action at the inline end.

## Don’t

- Don’t put more than three actions; overflow into a menu.
