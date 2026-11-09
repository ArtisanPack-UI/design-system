# Toast

A brief, non-blocking message about something that just happened.

## Anatomy

Root class `.apui-toast`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: region, root, icon, title, description, actions, close.

## Props

| Prop | Values | Default |
|---|---|---|
| `color` | status color for the icon | neutral |
| `variant` | default · inverse | default |
| `surface` | overlay · glass | overlay |
| `duration` | ms; paused on hover and focus; 0 = sticky | 5000 |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-toast-radius, --apui-surface-overlay, --apui-surface-inverse, --apui-elevation-overlay, --apui-color-{c}-text (icon), --apui-z-toast

## Accessibility

- Region is aria-live=polite (assertive for errors).
- Toasts with actions don’t auto-dismiss.
- Never the only place an error is reported.

## Do

- Offer Undo for reversible actions.

## Don’t

- Don’t use Toast for errors that block work; use Alert.
