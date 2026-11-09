# Diff

Shows changes between two versions, unified or split.

## Anatomy

Root `.apui-diff`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, header, file, counts, hunk, line number, sign, line, ins, del.

## Props

| Prop | Values | Default |
|---|---|---|
| `view` | 'unified' \| 'split' | unified |
| `wordLevel` | boolean | true |
| `context` | number | 3 |

## Accessibility

- Signs (+ and −) and counts carry meaning in text, not only color.
- Diff tables stay left-to-right.

## Do

- Show word-level changes for short edits.

## Don’t

- Don’t use red and green alone; keep the signs.
