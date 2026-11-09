# Breadcrumbs

Shows where the current page sits in the hierarchy.

## Anatomy

Root class `.apui-breadcrumbs`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root (nav), list, item, link, separator, current, overflow.

## Props

| Prop | Values | Default |
|---|---|---|
| `items` | label + href | — |
| `maxItems` | collapses the middle into a menu | 4 |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-text-muted (links), --apui-text-subtle (separator), body-sm

## Accessibility

- nav aria-label=Breadcrumb; the current page has aria-current and is not a link.
- Separators are aria-hidden and mirror in RTL.

## Do

- Start at the section, not always at Home.

## Don’t

- Don’t use for steps or history.
