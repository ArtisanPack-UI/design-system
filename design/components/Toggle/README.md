# Toggle

A switch for settings that take effect immediately.

## Anatomy

Root class `.apui-toggle`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, track, thumb, input, label, description.

## Props

| Prop | Values | Default |
|---|---|---|
| `checked` | boolean | false |
| `size` | sm · md · lg | md |
| `color` | any of the 8 colors | primary |
| `disabled` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-radius-full, --apui-surface-sunken (off track), --apui-border-default (off outline, 3:1), --apui-color-{c}, --apui-color-{c}-foreground

## Accessibility

- input type=checkbox with role=switch.
- Off state keeps a 3:1 outline so the control is visible without color.
- Thumb motion is removed under prefers-reduced-motion.

## Do

- Label the setting, not the state (“Dark mode”, not “On”).

## Don’t

- Don’t use in forms that need a submit; use Checkbox.
