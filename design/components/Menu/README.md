# Menu

Navigation lists with nested sections, and an application menubar.

## Anatomy

Root `.apui-menu · .apui-menubar`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: list, item, icon, badge, chevron, sub list; menubar, menubar item.

## Props

| Prop | Values | Default |
|---|---|---|
| `items` | tree | — |
| `collapsible` | boolean | true |

## Accessibility

- nav landmark; current item uses aria-current=page; expandable items use aria-expanded.
- Menubar follows the ARIA menubar pattern.

## Do

- Keep nesting to two levels.

## Don’t

- Don’t use Menu for actions; use DropdownMenu.
