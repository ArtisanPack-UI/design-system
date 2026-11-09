# ImageGallery

A grid of images that opens a lightbox.

## Anatomy

Root `.apui-image-gallery · .apui-lightbox`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: grid, item, caption, lightbox, bar, stage, nav, thumbs.

## Props

| Prop | Values | Default |
|---|---|---|
| `images` | Array<{src, alt, caption?}> | — |
| `columns` | number | 4 |
| `featured` | boolean — First image spans 2×2 | false |

## Accessibility

- Every image has alt text; the lightbox is a dialog with arrow-key navigation and a counter.

## Do

- Lazy-load thumbnails.

## Don’t

- Don’t crop faces or text out of thumbnails.
