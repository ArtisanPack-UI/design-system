# RadioGroup

Chooses exactly one option from a small set; default, horizontal and card layouts.

## Anatomy

Root class `.apui-radio-group / .apui-choice[data-type=radio]`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root (fieldset), legend, items, radio, dot, label, description, meta.

## Props

| Prop | Values | Default |
|---|---|---|
| `orientation` | vertical · horizontal | vertical |
| `variant` | default · cards | default |
| `value` | string | — |
| `invalid · disabled` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-selected-bg, --apui-selected-border, --apui-radius-md (cards), --apui-border-default, --apui-color-primary

## Accessibility

- Rendered as fieldset and legend; arrow keys move between options.

## Do

- Use cards when options need a price or description to compare.

## Don’t

- Don’t use for more than about 6 options; use Select.
