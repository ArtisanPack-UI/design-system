# DateTime

Date and time in one field, built from DatePicker plus a time list.

Built from **DatePicker**.

## Anatomy

Root `.apui-input + .apui-date-picker`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: field, control, popover, calendar, time list, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | string (ISO) | — |
| `step` | minutes | 30 |
| `timeZone` | string — Shown as a hint | local |

## Accessibility

- Typing works; the popover is an aid.
- The time list is a listbox; the time zone is always visible.

## Do

- Show the time zone whenever people in different zones use the data.

## Don’t

- Don’t use a time spinner for long ranges.
