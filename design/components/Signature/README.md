# Signature

Capture a signature by drawing, typing or uploading.

## Anatomy

Root `.apui-signature`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: pad, line, mark, placeholder, ink, typed, tools.

## Props

| Prop | Values | Default |
|---|---|---|
| `mode` | 'draw' \| 'type' \| 'upload' | draw |
| `penColor` | token | text |
| `required` | boolean | false |

## Accessibility

- Type mode is the keyboard-accessible path and is always offered.
- Clear and undo are labeled buttons.

## Do

- Show who is signing and the date under the pad.

## Don’t

- Don’t make drawing the only option.
