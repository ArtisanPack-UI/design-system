# SelectGroup

Select with labeled option groups, and attached controls that share an edge.

Built from **Select**.

## Anatomy

Root `[data-scope="dropdown-menu"][data-part="label"] · .apui-input-group`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: listbox, group label, option, separator; input group, fixed part.

## Props

| Prop | Values | Default |
|---|---|---|
| `groups` | Array<{label, options}> | — |
| `attached` | boolean — Join with a neighboring Input or Button | false |

## Accessibility

- Groups use role=group with aria-labelledby on the label.
- Attached controls keep separate labels (visible or aria-label).

## Do

- Use attached groups for unit + value pairs (currency, country code).

## Don’t

- Don’t attach more than two controls.
