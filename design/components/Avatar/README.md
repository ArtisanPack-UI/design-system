# Avatar

Represents a person or organization with an image or initials.

## Anatomy

Root class `.apui-avatar`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, image, initials, status; group.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | xs · sm · md · lg · xl (matches control heights) | md |
| `shape` | circle · square | circle |
| `color` | for initials | neutral |
| `status` | online · away · offline | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-avatar-radius, --apui-control-height-xs…xl, --apui-color-{c}-soft, --apui-focus-ring-offset-color (ring in groups), --apui-color-success / --apui-color-warning (status)

## Accessibility

- Image has alt text; initials get role=img with the full name.
- Status is also announced in text.

## Do

- Pick the initials color from a stable hash of the name.

## Don’t

- Don’t use status color alone to convey presence.
