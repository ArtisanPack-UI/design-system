# Dialog

A modal window for a focused task or a confirmation.

## Anatomy

Root class `.apui-dialog`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: scrim, root, header, icon, title, description, close, body, footer.

## Props

| Prop | Values | Default |
|---|---|---|
| `size` | sm · md · lg | md |
| `role` | dialog · alertdialog | dialog |
| `surface` | overlay · glass | overlay |
| `color` | for the header icon in confirmations | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-dialog-radius, --apui-dialog-width, --apui-surface-overlay, --apui-elevation-overlay, scrim, --apui-z-modal

## Accessibility

- Focus moves into the dialog and is trapped; Escape closes; focus returns to the trigger.
- Title is linked with aria-labelledby.
- Destructive confirmations use alertdialog and focus the safe action first.

## Do

- Name the action on the confirm button (“Delete listing”), not “OK”.

## Don’t

- Don’t put long forms in a Dialog; use a page.
