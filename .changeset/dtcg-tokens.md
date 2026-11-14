---
'@artisanpack-ui/tokens': major
---

Rebuild the tokens on W3C DTCG JSON (#18, #19, #20, #22). The source lives in `tokens/` in three tiers (primitive, semantic, component) with theme and density modes, and one build writes CSS custom properties in the `apui.tokens` layer, a typed TypeScript map and a PHP array. Every custom property moves to the `--apui-*` namespace (D-002) and the values follow the Strata + edges spec. The 1.x exports (`cn`, `resolveColor`, the glass helpers, the DaisyUI color maps and the Tailwind plugin) are removed.
