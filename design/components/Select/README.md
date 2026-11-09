# Select

Chooses one value from a list; the listbox uses the DropdownMenu surface.

## Anatomy

Root class `.apui-select / .apui-input`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: field, label, trigger (control), value, chevron, listbox, option, check, hint, error.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | sm · md · lg | md |
| `placeholder` | string | “Select…” |
| `searchable` | boolean, adds a filter input to the listbox | false |
| `invalid · disabled` | boolean | false |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-input-radius, --apui-menu-radius, --apui-menu-item-radius, --apui-surface-overlay, --apui-elevation-overlay, --apui-selected-bg

## Accessibility

- Native select is used when searchable is off and no rich options are needed; otherwise role=combobox with listbox.
- Arrow keys move, Enter selects, Escape closes and returns focus.

## Do

- Use RadioGroup instead when there are 2–5 options people should compare.

## Don’t

- Don’t hide required choices behind a placeholder that looks like a value.
