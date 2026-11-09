# ImageLibrary

A media manager: search, filter, select, upload and inspect assets.

## Anatomy

Root `.apui-image-library`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, toolbar, bulk bar, grid, asset, thumb, check, name, meta, details panel, preview, metadata.

## Props

| Prop | Values | Default |
|---|---|---|
| `view` | 'grid' \| 'list' | grid |
| `selectable` | 'single' \| 'multiple' | multiple |
| `accept` | string | — |

## Accessibility

- Grid is a listbox with aria-multiselectable; the bulk bar announces the count.
- Alt text is editable in the details panel.

## Do

- Ask for alt text at upload time.

## Don’t

- Don’t delete without confirmation.
