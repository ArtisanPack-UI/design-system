# Token playground

A page for exploring the ArtisanPack UI Design System tokens live (#29). It isn't published.

```bash
npm run playground
```

This builds `apps/playground/dist/` and prints a `file://` URL. Open it in a browser; it needs no server.

## What it does

- **Foundations:** color (surfaces, text, edges and states, the eight roles, charts, syntax), typography (every type style), spacing and density, radius, elevation, motion, focus and glass. Every value shown is read from the preview's computed style, so it reflects the current preset, theme, density and your edits.
- **Switchers:** preset (Strata, Ledger, Harbor and the brand presets), theme, density and direction. They set `data-preset`, `data-theme`, `data-density` and `dir` on the preview only, the way an app scopes them to a subtree. The query string keeps them, so a link opens the same view: `?preset=ledger&theme=dark&density=compact`.
- **Live editing:** change any semantic or component token. Overrides apply to the preview and cascade to every token that aliases them. **Your overrides** shows them as CSS to paste into an app.

The sample UI is a stand-in built from semantic and component tokens until the components ship. It isn't the component CSS.

Making a brand preset is the generator's job: `apui-generate-preset` ([docs](../../docs/tokens/README.md#brand-presets-the-generator-27)), and the web theme builder on the docs site ([D-013](../../docs/decisions.md#d-013-the-theme-generator-is-a-cli-plus-a-web-builder-on-the-docs-site)).

## Tests

`npm test --workspace @artisanpack-ui/playground` builds the page into a temporary directory and drives it in Chromium.
