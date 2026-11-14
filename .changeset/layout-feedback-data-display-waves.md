---
'@artisanpack-ui/tokens': minor
'@artisanpack-ui/css': minor
'@artisanpack-ui/manifest': minor
'@artisanpack-ui/behavior': minor
'@artisanpack-ui/testing': minor
---

Add the Layout, Feedback and Data Display waves, Tooltip and Table (#58 to #62, D-029 to D-044).

- `@artisanpack-ui/tokens` adds `border.soft-edge-width` (`--apui-border-soft-edge-width`): 0 in light and dark, 1px in high contrast, the edge soft Badges and Alerts draw there (D-035).
- `@artisanpack-ui/manifest` adds 33 manifests with docs examples: Accordion, Collapse, AppShell, PageHeader, Divider, Grid, Stack, Drawer, Popover, Tooltip, Heading, Text, ListItem, UserMenu, Avatar, Badge, Alert, Loading, Progress, ProgressRadial, Skeleton, EmptyState, ErrorState, StreamableContent, Stat, KpiCard, Sparkline, Timeline, Diff, ImageGallery, ImageSlider, ImageLibrary and Table. StreamableContent and ImageLibrary are Livewire only (D-003, D-037).
- `@artisanpack-ui/css` ships each of them in `apui.components`.
- `@artisanpack-ui/behavior` adds the Drawer, Popover, Tooltip, Accordion, Collapse, carousel (ImageSlider) and lightbox (ImageGallery) widgets on Zag (`@zag-js/popover`, `@zag-js/tooltip`, `@zag-js/accordion`, `@zag-js/collapsible`, `@zag-js/carousel`), each with an Alpine component and React and Vue hooks, plus `apuiImageLibrary`. The new `data` helpers (`sparklineGeometry`, `sparklineLabel`, `diffText`, `splitRows`, `wordDiff`) draw Sparkline and Diff with no library (D-038). More Lucide icons for the new components.
- `@artisanpack-ui/testing`: `ManifestParity` knows the new widgets' events (`apuiDrawer`, `apuiPopover`, `apuiTooltip`, `apuiCollapse`, `apuiLightbox`, `apuiCarousel`, `apuiImageLibrary`).
