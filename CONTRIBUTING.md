# Contributing to the ArtisanPack UI Design System

Read [CLAUDE.md](CLAUDE.md) first: it lists the decisions, conventions and sources of truth every change follows.

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer

## Setup

```bash
git clone git@github.com:ArtisanPack-UI/design-system.git
cd design-system
npm install
npm run build
```

## Layout

```text
packages/
├── tokens/     # @artisanpack-ui/tokens: DTCG source tokens and generated outputs (docs/tokens)
├── css/        # @artisanpack-ui/css: plain-CSS component layer (/tailwind preset planned in #24)
├── behavior/   # @artisanpack-ui/behavior: interaction engine with Alpine, React and Vue adapters
└── manifest/   # @artisanpack-ui/manifest: per-component API manifest
design/         # Phase 1 design spec (the visual target)
docs/           # Decisions and the Phase 0 inventory
tools/          # Inventory and design tooling (not workspaces)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | Builds every package. Fails if the committed token outputs are stale |
| `npm test` | Runs every package's tests. The CSS cascade tests need Chromium: `npx playwright install chromium` once |
| `npm run lint` | ESLint |
| `npm run lint:css` | Stylelint: layers, `apui` prefix, logical properties ([conventions](docs/css-conventions.md)) |
| `npm run tokens` | Validates the DTCG tokens and regenerates their CSS, TS and PHP outputs |
| `npm run format` / `format:check` | Prettier |
| `npm run type-check` | `tsc --noEmit` in every package |
| `npm test --prefix tools/inventory` | Checks the inventory data, including the D-003 exceptions |

CI runs all of these on every pull request.

## Workflow

- One issue per branch, named `<type>/<issue>-<slug>` (for example `feat/21-css-layers`).
- Small commits with conventional prefixes: `feat:`, `fix:`, `docs:`, `chore:`.
- Open a PR to `main` that closes the issue. CodeRabbit reviews every PR.
- New decisions go in `docs/decisions.md` with the next D-number.

## Changesets

Any change to a published package needs a changeset:

```bash
npm run changeset
```

Pick the packages, the bump type and a one-line summary. On merge to `main`, CI opens a "version packages" PR; merging that publishes to npm.

The packages are `private` until their first release (#81), so changesets doesn't publish them yet. `@artisanpack-ui/tokens` now lives here at 1.0.1; 1.x is frozen and its next release is 2.0.0 (D-007).
