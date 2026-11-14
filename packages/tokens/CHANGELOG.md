# @artisanpack-ui/tokens

## 2.0.0

### Major Changes

- [#95](https://github.com/ArtisanPack-UI/design-system/pull/95) [`002f570`](https://github.com/ArtisanPack-UI/design-system/commit/002f5707e5e64343cba240fb5e912776e9bdcb5f) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Rebuild the tokens on W3C DTCG JSON ([#18](https://github.com/ArtisanPack-UI/design-system/issues/18), [#19](https://github.com/ArtisanPack-UI/design-system/issues/19), [#20](https://github.com/ArtisanPack-UI/design-system/issues/20), [#22](https://github.com/ArtisanPack-UI/design-system/issues/22)). The source lives in `tokens/` in three tiers (primitive, semantic, component) with theme and density modes, and one build writes CSS custom properties in the `apui.tokens` layer, a typed TypeScript map and a PHP array. Every custom property moves to the `--apui-*` namespace (D-002) and the values follow the Strata + edges spec. The 1.x exports (`cn`, `resolveColor`, the glass helpers, the DaisyUI color maps and the Tailwind plugin) are removed.

### Minor Changes

- [#98](https://github.com/ArtisanPack-UI/design-system/pull/98) [`b00ea76`](https://github.com/ArtisanPack-UI/design-system/commit/b00ea767e8e101ae1e8800960b7eae14189004d4) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add Figma variables ([#28](https://github.com/ArtisanPack-UI/design-system/issues/28)). `npm run tokens` also writes `generated/figma/variables.json` (exported as `@artisanpack-ui/tokens/figma`): three collections (Tokens by preset, Theme, Density) covering every token in all three tiers, with aliases kept, role-based scopes and the custom property as WEB code syntax. A generated development plugin and `npm run figma:chunks` sync it into a Figma file one-way and idempotently.

- [#105](https://github.com/ArtisanPack-UI/design-system/pull/105) [`47c44ca`](https://github.com/ArtisanPack-UI/design-system/commit/47c44ca3ba0036faf0a28ad0c869a45b747151af) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Layout, Feedback and Data Display waves, Tooltip and Table ([#58](https://github.com/ArtisanPack-UI/design-system/issues/58) to [#62](https://github.com/ArtisanPack-UI/design-system/issues/62), D-029 to D-044).
  
  - `@artisanpack-ui/tokens` adds `border.soft-edge-width` (`--apui-border-soft-edge-width`): 0 in light and dark, 1px in high contrast, the edge soft Badges and Alerts draw there (D-035).
  - `@artisanpack-ui/manifest` adds 33 manifests with docs examples: Accordion, Collapse, AppShell, PageHeader, Divider, Grid, Stack, Drawer, Popover, Tooltip, Heading, Text, ListItem, UserMenu, Avatar, Badge, Alert, Loading, Progress, ProgressRadial, Skeleton, EmptyState, ErrorState, StreamableContent, Stat, KpiCard, Sparkline, Timeline, Diff, ImageGallery, ImageSlider, ImageLibrary and Table. StreamableContent and ImageLibrary are Livewire only (D-003, D-037).
  - `@artisanpack-ui/css` ships each of them in `apui.components`.
  - `@artisanpack-ui/behavior` adds the Drawer, Popover, Tooltip, Accordion, Collapse, carousel (ImageSlider) and lightbox (ImageGallery) widgets on Zag (`@zag-js/popover`, `@zag-js/tooltip`, `@zag-js/accordion`, `@zag-js/collapsible`, `@zag-js/carousel`), each with an Alpine component and React and Vue hooks, plus `apuiImageLibrary`. The new `data` helpers (`sparklineGeometry`, `sparklineLabel`, `diffText`, `splitRows`, `wordDiff`) draw Sparkline and Diff with no library (D-038). More Lucide icons for the new components.
  - `@artisanpack-ui/testing`: `ManifestParity` knows the new widgets' events (`apuiDrawer`, `apuiPopover`, `apuiTooltip`, `apuiCollapse`, `apuiLightbox`, `apuiCarousel`, `apuiImageLibrary`).

- [#96](https://github.com/ArtisanPack-UI/design-system/pull/96) [`13485d1`](https://github.com/ArtisanPack-UI/design-system/commit/13485d115ff877d038481f67ee494a5348282df1) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add presets ([#23](https://github.com/ArtisanPack-UI/design-system/issues/23), D-010): named token reassignments switched by `data-preset` on any element, with the Ledger and Harbor presets from the spec and a `forest` example brand preset. Each preset is validated like the token source, passes every contrast pair in every theme, and builds to `@artisanpack-ui/tokens/presets/<name>.css` plus `presets` in the TypeScript and PHP maps. Add `font-family.display`, used by the display, large heading and stat styles. Add the `apui-generate-preset` brand preset generator ([#27](https://github.com/ArtisanPack-UI/design-system/issues/27)): it rebuilds the color ramps around a primary (and optional secondary and accent) color with luminance-matched steps, so generated presets keep the default theme's contrast, and outputs CSS, DTCG source, PHP or JSON.

## 1.0.1

### Patch Changes

- Linked version bump alongside `@artisanpack-ui/react@1.0.1` and `@artisanpack-ui/react-laravel@1.0.1`. No source changes in this package.

## 1.0.0

### Major Changes

- [`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial release
