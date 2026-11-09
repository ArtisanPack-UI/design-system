# Textarea

Multi-line text entry that shares Input’s field anatomy and adds an optional counter.

## Anatomy

Root class `.apui-input[data-multiline]`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: field, label, control, count, hint, error.

## Props

| Prop | Values | Default |
|---|---|---|
| `rows` | number | 4 |
| `maxLength` | number, shows the counter | — |
| `autoResize` | boolean | false |
| `invalid · disabled` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-input-radius, --apui-border-default, --apui-text-muted (count), measure

## Accessibility

- Counter is announced politely as the limit approaches, not on every keystroke.

## Do

- Size it to the expected length of the answer.

## Don’t

- Don’t use a Textarea for single values.
