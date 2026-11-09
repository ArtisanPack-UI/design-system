# CheckboxGroup

A labeled set of related checkboxes with shared hint and error.

## Anatomy

Root `.apui-checkbox-group`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root (fieldset), legend, select all, items, checkbox, error.

## Props

| Prop | Values | Default |
|---|---|---|
| `options` | Array<{value,label,description?}> | — |
| `value` | string[] | — |
| `columns` | 1 \| 2 \| 3 | 1 |
| `orientation` | 'vertical' \| 'horizontal' | vertical |
| `variant` | 'default' \| 'cards' | default |
| `invalid` | boolean | false |

## Accessibility

- fieldset and legend; the group error is linked with aria-describedby.
- Select all is a real checkbox or button with a mixed state.

## Do

- Order options by frequency, not alphabetically, when one is common.

## Don’t

- Don’t use for mutually exclusive options; use RadioGroup.
