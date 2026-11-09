# Badge

A small label for status, category or count.

## Anatomy

Root class `.apui-badge`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, dot, icon, label.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | solid · soft · outline · ghost | soft |
| `color` | any of the 8 | neutral |
| `size` | sm · md · lg | md |
| `dot` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-badge-radius, --apui-color-{c}-soft / -on-soft / -solid / -on-solid / -edge

## Accessibility

- Text always present; the dot is decorative.
- In high-contrast, soft badges gain an edge.

## Do

- Use the same color for the same status everywhere.

## Don’t

- Don’t make badges clickable; use a Button or filter chip.
