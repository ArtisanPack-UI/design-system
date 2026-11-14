---
'@artisanpack-ui/tokens': minor
---

Add presets (#23, D-010): named token reassignments switched by `data-preset` on any element, with the Ledger and Harbor presets from the spec and a `forest` example brand preset. Each preset is validated like the token source, passes every contrast pair in every theme, and builds to `@artisanpack-ui/tokens/presets/<name>.css` plus `presets` in the TypeScript and PHP maps. Add `font-family.display`, used by the display, large heading and stat styles. Add the `apui-generate-preset` brand preset generator (#27): it rebuilds the color ramps around a primary (and optional secondary and accent) color with luminance-matched steps, so generated presets keep the default theme's contrast, and outputs CSS, DTCG source, PHP or JSON.
