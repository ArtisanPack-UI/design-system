---
title: Motion
menu_order: 6
---

# Motion

Motion is short and functional: it shows where something came from and where it went. Components use three durations and three easings.

| Token | Value |
|---|---|
| `--apui-motion-duration-fast` | `150ms` |
| `--apui-motion-duration-moderate` | `200ms` |
| `--apui-motion-duration-slow` | `300ms` |
| `--apui-motion-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--apui-motion-ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--apui-motion-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |

| Token | Use |
|---|---|
| `--apui-motion-duration-fast` | Most interaction: hover and press feedback, toggles, accordions, menus, popovers and tooltips |
| `--apui-motion-duration-moderate` | Larger overlays: dialogs, drawers, Spotlight and the image gallery's lightbox |
| `--apui-motion-duration-slow` | Progress animation and toasts |
| `--apui-motion-ease-standard` | Things that move within the page |
| `--apui-motion-ease-enter` | Things that appear |
| `--apui-motion-ease-exit` | Things that leave |

The primitive durations (`--apui-duration-75` to `--apui-duration-1000`) are available for your own use.

## Reduced motion

Under `prefers-reduced-motion: reduce`, components remove movement and slow spinners down. Carousels and image sliders never autoplay for visitors who prefer reduced motion. Do the same in your own CSS:

```css
.panel {
  transition: transform var(--apui-motion-duration-moderate) var(--apui-motion-ease-enter);
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
}
```
