# Stat

A single headline number with label, change and context.

## Anatomy

Root class `.apui-stat`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, label, icon, value, unit, delta, foot.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | sm · md · lg | md |
| `trend` | up · down · flat | — |
| `emphasis` | boolean: soft color fill for the one stat that matters | false |
| `color` | tints the icon tile and the emphasis fill | neutral |
| `bare` | boolean: no container | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

stat-sm / stat-md / stat-lg type styles, --apui-card-radius, --apui-card-padding, --apui-color-{c}-soft, --apui-color-success-text, --apui-color-error-text

## Accessibility

- Delta has visible text and an arrow; color is never the only signal.
- Value uses tabular figures.

## Do

- Emphasize at most one Stat per row.

## Don’t

- Don’t bold the value; size carries the hierarchy.
