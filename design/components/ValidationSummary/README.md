# ValidationSummary

Lists every error in a form, each linked to its field.

## Anatomy

Root `.apui-validation-summary`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, icon, title, list, link.

## Props

| Prop | Values | Default |
|---|---|---|
| `errors` | Array<{field, message}> | — |
| `color` | 'error' \| 'warning' | error |

## Accessibility

- Rendered at the top of the form on submit, receives focus, role=alert.
- Each link moves focus to the field.
- Fields keep their own inline errors.

## Do

- Use the same wording as the inline errors.

## Don’t

- Don’t show it before the first submit.
