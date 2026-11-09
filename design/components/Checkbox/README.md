# Checkbox

Turns a single option on or off, or selects items in a list or table.

## Anatomy

Root class `.apui-choice`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, box, input, check icon, label, description.

## Props

| Prop | Values | Default |
|---|---|---|
| `checked` | true · false · “indeterminate” | false |
| `invalid · disabled` | boolean | false |
| `description` | string or slot | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-checkbox-radius, --apui-color-primary, --apui-color-primary-foreground, --apui-border-default, --apui-color-error-border

## Accessibility

- Native input type=checkbox stays in the DOM, visually hidden over the box.
- Indeterminate sets aria-checked=mixed.

## Do

- Use for independent options and for consent.

## Don’t

- Don’t use a Checkbox for settings that apply instantly; use Toggle.
