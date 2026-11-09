# DatePicker

A text field with a calendar popover for a single date or a range.

## Anatomy

Root class `.apui-input / .apui-date-picker`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: field, label, control, icon, popover, header, month, nav buttons, grid, weekday, day, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `mode` | single · range | single |
| `min · max · disabledDates` | dates | — |
| `weekStartsOn` | 0–6, follows locale | locale |
| `format` | locale pattern | locale |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-input-radius, --apui-menu-radius, --apui-radius-full (day), --apui-color-primary (selected), --apui-color-primary-soft (range), --apui-border-strong (today ring)

## Accessibility

- Typing a date always works; the calendar is an aid.
- Grid uses role=grid with arrow-key navigation; PageUp/PageDown change month.
- Previous and next arrows mirror in RTL.

## Do

- Show the expected format as the hint.

## Don’t

- Don’t force the calendar for birthdates; let people type.
