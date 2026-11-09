# UserMenu

The account menu: identity, workspace switcher, theme and sign out.

Built from **Avatar + DropdownMenu**.

## Anatomy

Root `Avatar + .apui-dropdown-menu`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: trigger, avatar, name, role, menu, header, workspace items, theme control, items, log out.

## Props

| Prop | Values | Default |
|---|---|---|
| `user` | {name, email, avatar?} | — |
| `workspaces` | Array<{id,name}> | — |
| `showTheme` | boolean | true |

## Accessibility

- Trigger is a button with aria-haspopup=menu and the person’s name.
- Workspace items are menuitemradio.

## Do

- Keep sign out last.

## Don’t

- Don’t hide account settings anywhere else.
