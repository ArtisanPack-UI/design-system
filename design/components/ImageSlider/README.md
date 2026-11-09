# ImageSlider

One large image per view with glass caption, counter, dots and thumbnails, built from Carousel.

Built from **Carousel**.

## Anatomy

Root `.apui-image-slider`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, image, counter, nav, caption, dots, thumbs.

## Props

| Prop | Values | Default |
|---|---|---|
| `images` | Array<{src, alt, caption?}> | — |
| `aspectRatio` | string | 21 / 9 |

## Accessibility

- Same semantics as Carousel; captions are text, not baked into images.

## Do

- Use glass overlays only over photos.

## Don’t

- Don’t put essential text over busy image areas.
