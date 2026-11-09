# Carousel

Scroll-snapped slides with controls and position dots.

## Anatomy

Root `.apui-carousel`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, header, viewport, track, slide, nav, dots.

## Props

| Prop | Values | Default |
|---|---|---|
| `perView` | number | 1 |
| `loop` | boolean | false |
| `autoplay` | boolean — Requires a pause control | false |

## Accessibility

- region with aria-roledescription=carousel; slides are labeled “n of N”.
- Never autoplay without a visible pause; respect reduced motion.

## Do

- Let the next slide peek so people know there’s more.

## Don’t

- Don’t hide important content in later slides.
