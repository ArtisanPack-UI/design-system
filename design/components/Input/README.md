# Input

Single-line text entry with label, hint and error parts.

## Anatomy

Root class `.apui-field / .apui-input`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: field (root), label, control, icon, addon, kbd, hint, error.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | sm · md · lg | md |
| `invalid` | boolean or error message | false |
| `disabled · readonly` | boolean | false |
| `leadingIcon · trailingIcon` | icon name or slot | — |
| `prefix · suffix` | addon text, e.g. USD | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-input-radius, --apui-control-height-sm…lg, --apui-border-default, --apui-border-strong (hover), --apui-color-error-border, --apui-surface-default (field-bg), --apui-surface-sunken (disabled, read-only), --apui-text-muted (placeholder, hint)

## Accessibility

- Label is always visible and linked with for/id; placeholder never replaces it.
- Error text is linked with aria-describedby and the control gets aria-invalid.
- Required fields show a mark and set aria-required.

## Do

- Write hints that prevent errors (format, units).
- Use addons for units and currency so the value stays clean.

## Don’t

- Don’t round text fields to pills; that breaks with long values and multi-line.
