# File

Upload files by dropping or browsing, with a file list that shows progress and errors.

## Anatomy

Root `.apui-file-dropzone · .apui-file-item`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: dropzone, icon, title, hint, file list, file, thumb, name, meta, progress, actions.

## Props

| Prop | Values | Default |
|---|---|---|
| `accept` | string | — |
| `multiple` | boolean | false |
| `maxSize` | number — Bytes | — |
| `variant` | 'dropzone' \| 'compact' | dropzone |

## Accessibility

- The dropzone is a button that opens the file dialog; drag-and-drop is an enhancement.
- Progress and errors are announced; each row’s actions are labeled with the file name.

## Do

- State limits (types, size, count) before upload.

## Don’t

- Don’t reject a whole batch for one bad file.
