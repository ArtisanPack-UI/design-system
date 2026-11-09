# Navbar

The top bar: brand, primary links or search, and account actions.

## Anatomy

Root class `.apui-navbar`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, brand, mark, links, link, search, actions, indicator.

## Props

| Prop | Values | Default |
|---|---|---|
| `layout` | bar · island | bar |
| `surface` | default · glass | default |
| `sticky` | boolean | true |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-navbar-height, --apui-radius-lg (island), --apui-radius-full (links), --apui-surface-default, --apui-border-muted, glass tokens

## Accessibility

- header landmark with a nav for links; current link uses aria-current.
- Notification indicator also announced in the button label.

## Do

- Use island inside AppShell, bar on marketing pages.

## Don’t

- Don’t put more than ~6 links in the bar.
