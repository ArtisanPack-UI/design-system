# ArtisanPack UI Design System

Token-driven design system for ArtisanPack UI: DTCG design tokens, a plain-CSS component layer, theme presets and a generator, and one component API shared by Livewire, React and Vue.

Phase 0 and Phase 1 are complete. The [inventory](docs/inventory/README.md) records what existed across the three stacks, the [design spec](design/README.md) sets the visual direction and specifies every component, and the [decision log](docs/decisions.md) records what has been settled.

## Packages

| Package | Purpose | Status |
|---|---|---|
| [`@artisanpack-ui/tokens`](packages/tokens) | Source tokens in W3C DTCG JSON plus generated CSS, TypeScript and PHP | 2.0.0 in progress: DTCG source, themes and density built ([docs](docs/tokens/README.md)) |
| [`@artisanpack-ui/css`](packages/css) | Plain-CSS component layer (Tailwind not required), plus an optional Tailwind v4 preset at `/tailwind` (planned in #24) | Layers, reset and utilities; components next ([conventions](docs/css-conventions.md)) |
| [`@artisanpack-ui/behavior`](packages/behavior) | Shared interaction engine with Alpine, React and Vue adapters | Scaffold |
| [`@artisanpack-ui/manifest`](packages/manifest) | Per-component JSON manifest | Scaffold |

None is published from this repo yet. The 1.0 releases are tracked in #81.

## Tools

| Tool | What it's for |
|---|---|
| [Token playground](apps/playground) | Explore the tokens live: switch preset, theme, density and direction, edit semantic tokens and watch sample UI change. `npm run playground` |
| [Figma variables](docs/figma.md) | The tokens as Figma variables for outside designers, synced one-way from the code |

## Development

```bash
npm install
npm run build
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

MIT. See [LICENSE](LICENSE).
