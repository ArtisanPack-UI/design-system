# Steps

Shows progress through a sequence.

## Anatomy

Root `.apui-steps`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: list, step, marker, title, connector, description.

## Props

| Prop | Values | Default |
|---|---|---|
| `steps` | Array<{title, description?, state}> | — |
| `orientation` | 'horizontal' \| 'vertical' | horizontal |
| `clickable` | boolean — Allow returning to completed steps | false |

## Accessibility

- Ordered list; the current step has aria-current=step.
- Complete and error states have text alternatives, not only icons.

## Do

- Use 3–6 steps.

## Don’t

- Don’t use Steps as tabs.
