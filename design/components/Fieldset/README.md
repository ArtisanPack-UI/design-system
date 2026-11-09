# Fieldset

Groups related fields under a legend and description.

## Anatomy

Root `.apui-fieldset`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, legend, title, description, row.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | 'panel' \| 'divided' \| 'plain' | panel |
| `disabled` | boolean — Disables every control inside | false |

## Accessibility

- Native fieldset and legend so the group name is announced with each field.

## Do

- Use panels to break a long form into scannable sections.

## Don’t

- Don’t nest fieldsets more than one level.
