# AppShell

The application frame: sidebar, top bar and content as islands separated by a gutter.

## Anatomy

Root class `.apui-app-shell / .apui-nav`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, sidebar, nav section, nav item, badge, footer, main, content.

## Props

| Prop | Values | Default |
|---|---|---|
| `collapsed` | boolean: icon-only sidebar | false |
| `sidebarWidth` | token | --apui-sidebar-width |
| `gutter` | token | --apui-shell-gutter |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-sidebar-width, --apui-shell-gutter, --apui-radius-lg, --apui-radius-full (nav items), --apui-selected-bg, --apui-surface-page, --apui-surface-default

## Accessibility

- aside and main landmarks; a skip link to main content.
- Current nav item uses aria-current=page.
- Layout uses logical properties, so the sidebar moves to the right in RTL.

## Do

- Keep 5–8 top-level items; group the rest under section labels.

## Don’t

- Don’t weld the sidebar to the top bar; the gutter is part of the look.
