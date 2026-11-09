# Card

The default container: a surface with an edge, plus optional header, body, footer and media parts.

## Anatomy

Root class `.apui-card`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, media, header, title, description, actions, body, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `surface` | default · raised · sunken · glass | default |
| `interactive` | boolean, adds hover edge and makes the whole card a link or button | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-card-radius, --apui-card-padding (follows density), surface-*, --apui-border-muted, --apui-elevation-raised (none in Strata), glass tokens

## Accessibility

- Interactive cards have one primary link; nested buttons stay separately focusable.
- Glass falls back to --apui-surface-raised under reduced transparency.

## Do

- Nest a raised Card for grouped facts inside a Card; inner radius = outer − padding.

## Don’t

- Don’t raise the radius above --apui-radius-lg or add shadows to in-page cards.
- Don’t stack glass on glass.
