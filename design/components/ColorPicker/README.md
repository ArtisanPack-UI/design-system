# ColorPicker

A field with a swatch that opens a picker: saturation area, hue, opacity, value input and swatches.

## Anatomy

Root `.apui-color-picker`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: field, swatch, popover, area, cursor, hue slider, alpha slider, format select, value input, eyedropper, swatches.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | string | — |
| `format` | 'hex' \| 'rgb' \| 'hsl' \| 'oklch' | hex |
| `alpha` | boolean | true |
| `swatches` | string[] | — |

## Accessibility

- Area and sliders are keyboard-operable sliders with aria-valuetext.
- The value input is always available for typing.
- Swatches are options with accessible names.

## Do

- Offer the brand palette as swatches.

## Don’t

- Don’t show only the picker; always include a text value.
