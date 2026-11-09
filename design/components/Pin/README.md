# Pin

A row of single-character cells for one-time codes.

## Anatomy

Root `.apui-pin`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, cell, separator.

## Props

| Prop | Values | Default |
|---|---|---|
| `length` | number | 6 |
| `mask` | boolean | false |
| `type` | 'numeric' \| 'alphanumeric' | numeric |
| `size` | 'sm' \| 'md' | md |

## Accessibility

- One real input with autocomplete=one-time-code drives the cells, so SMS autofill and paste work.
- Group is labeled; errors are linked with aria-describedby.

## Do

- Auto-submit when the last digit is entered.

## Don’t

- Don’t clear the code on error without telling people.
