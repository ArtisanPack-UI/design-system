# Password

Password input with reveal toggle, optional strength meter and live requirements.

## Anatomy

Root `.apui-input + .apui-strength`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: field, control, reveal button, strength, segment, label, requirements.

## Props

| Prop | Values | Default |
|---|---|---|
| `showStrength` | boolean | false |
| `requirements` | Array<{label, test}> | — |
| `autocomplete` | 'current-password' \| 'new-password' | current-password |

## Accessibility

- Reveal button toggles aria-pressed and its label (“Show password” / “Hide password”).
- Strength text is announced politely; the meter itself is decorative.
- Never block paste.

## Do

- Show requirements before people type, not only after an error.

## Don’t

- Don’t rely on the meter color alone; the label says Weak, Fair or Strong.
