# ArtisanPack UI Design System

Token-driven design system for ArtisanPack UI: DTCG design tokens, a plain-CSS component layer, theme presets and a generator, and one component API shared by Livewire, React and Vue.

**Documentation:** [docs/](docs/home.md), published on the [ArtisanPack UI docs site](https://docs.artisanpackui.dev/documentation/design-system/home): getting started for each stack, foundations, theming, styling, every component, accessibility and the upgrade guides.

**Contributing:** the [design spec](design/README.md) sets the visual direction and specifies every component; [contributing/](contributing) holds the [decision log](contributing/decisions.md), the Phase 0 [inventory](contributing/inventory/README.md), the [token source format](contributing/tokens/README.md) and the [CSS conventions](contributing/css-conventions.md).

## Packages

| Package | Purpose |
|---|---|
| [`@artisanpack-ui/tokens`](packages/tokens) | Design tokens in W3C DTCG JSON, built to CSS, TypeScript and PHP; the Ledger and Harbor presets and the brand preset generator |
| [`@artisanpack-ui/css`](packages/css) | Plain-CSS component layer in cascade layers (Tailwind not required), a headless build and an optional Tailwind v4 preset |
| [`@artisanpack-ui/behavior`](packages/behavior) | Interaction engine on Zag and Floating UI, with Alpine, React and Vue adapters, the icon registry and the theme helpers |
| [`@artisanpack-ui/manifest`](packages/manifest) | One JSON API contract per component, with its examples in all three stacks |
| [`@artisanpack-ui/testing`](packages/testing) | Quality gates: cross-stack visual regression, axe and API parity |
| [`@artisanpack-ui/codemods`](packages/codemods) | Upgrade rules, the React and Vue codemods and the [upgrade guides](docs/upgrade.md) |

The repo root is also a Composer package, `artisanpack-ui/design-system`, with the PHP side of the manifest and the gates ([D-016](contributing/decisions.md#d-016-the-quality-gates-ship-as-artisanpack-uitesting-plus-a-composer-kit)).

None is published from this repo yet. The 1.0 releases are tracked in #81.

## Tools

| Tool | What it's for |
|---|---|
| [Token playground](apps/playground) | Explore the tokens live: switch preset, theme, density and direction, edit semantic tokens and watch sample UI change. `npm run playground` |
| [Figma variables](contributing/figma.md) | The tokens as Figma variables for outside designers, synced one-way from the code |

## Development

```bash
npm install
npm run build
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

MIT. See [LICENSE](LICENSE).
