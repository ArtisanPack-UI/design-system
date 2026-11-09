# Tags

Several free or suggested values shown as removable chips inside the field.

Built from **Combobox**.

## Anatomy

Root `.apui-input[data-multi] .apui-chip`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: field, control, chip, chip remove, input, listbox, create.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | string[] | — |
| `suggestions` | string[] — Combobox options | — |
| `max` | number — Maximum tags | — |
| `color` | per tag | 'neutral' |

## Accessibility

- Each chip’s remove button is labeled “Remove {tag}”.
- Backspace in an empty input removes the last tag; the change is announced.

## Do

- Normalize case so “Rooftop” and “rooftop” don’t both exist.

## Don’t

- Don’t color tags by meaning unless the colors are explained.
