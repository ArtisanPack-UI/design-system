# Clipboard

Copy a value with clear confirmation.

## Anatomy

Root `.apui-copy · .apui-copy-field`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: button, field, value, tooltip.

## Props

| Prop | Values | Default |
|---|---|---|
| `value` | string | — |
| `timeout` | ms — How long “Copied” shows | 2000 |

## Accessibility

- The result is announced in a live region; the label changes to “Copied”.

## Do

- Use a copy field for links, keys and IDs.

## Don’t

- Don’t copy silently.
