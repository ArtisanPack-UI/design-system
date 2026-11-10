---
'@artisanpack-ui/tokens': minor
---

Add Figma variables (#28). `npm run tokens` also writes `generated/figma/variables.json` (exported as `@artisanpack-ui/tokens/figma`): three collections (Tokens by preset, Theme, Density) covering every token in all three tiers, with aliases kept, role-based scopes and the custom property as WEB code syntax. A generated development plugin and `npm run figma:chunks` sync it into a Figma file one-way and idempotently.
