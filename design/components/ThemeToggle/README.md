# ThemeToggle

Lets people choose light, dark, high contrast or system.

## Anatomy

Root `.apui-tabs[role=radiogroup]`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: segmented control, icon button, menu.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | 'light' \| 'dark' \| 'high-contrast' \| 'system' | system |
| `variant` | 'segmented' \| 'icon' \| 'menu' | segmented |

## Accessibility

- Radio semantics with labels, even when icons are shown alone.
- Choice persists and is applied before first paint to avoid a flash.

## Do

- Default to System.

## Don’t

- Don’t hide high contrast behind settings only.
