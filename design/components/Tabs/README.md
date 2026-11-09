# Tabs

Switches between views of the same content.

## Anatomy

Root class `.apui-tabs`. Each part carries `data-part`, scoped by `data-scope` so nested components never collide, and each package also exposes it through `classes` and slots. Parts: root, list, trigger, count, panel.

## Props

| Prop | Values | Default |
|---|---|---|
| `variant` | segmented · underline | segmented |
| `size` | sm · md | md |
| `value` | string | — |

Livewire, React and Vue packages expose the same props; each maps to a `data-*` attribute, so `bundle.css` styles all three.

## Tokens

--apui-tabs-radius, --apui-surface-sunken (track), --apui-surface-raised (selected), --apui-selected-indicator-width, --apui-color-primary (underline)

## Accessibility

- role=tablist/tab/tabpanel with arrow-key navigation and automatic or manual activation.

## Do

- Use segmented for filters and small view switches, underline under a PageHeader.

## Don’t

- Don’t use Tabs for steps in a process.
