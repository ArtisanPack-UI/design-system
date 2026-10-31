# Phase 0 inventory

What exists across Livewire, React and Vue before anything is redesigned (#1).

| Report | Issue | What it answers |
|---|---|---|
| [parity-matrix.md](parity-matrix.md) | #2 | Which components exist where, under what name, and in which wave |
| [api-differences.md](api-differences.md) | #3 | How props, slots and events differ, summarized |
| [data/api-differences.json](data/api-differences.json) | #3 | The full catalogue, used to seed the manifest and upgrade rules |
| [vocabulary.md](vocabulary.md) | #4 | The accepted unified API |
| [codemod-scope.md](codemod-scope.md) | #5 | How much downstream code the migration touches |
| [token-audit.md](token-audit.md) | #6 | Where existing tokens land in the new tiers |

The decisions in #7, #8 and #9 are still open. The parity matrix is the input to #8.

## Key findings

**The gap is Livewire against the other two, not three-way.** React and Vue nearly match, while 25 of 81 canonical components are Livewire-only and 7 are React and Vue only. The wave issues list only Livewire names, so 6 React/Vue components have no issue yet: CodeEditor, Stack, Skeleton, EmptyState, ErrorState and Clipboard.

**"Exists in all three" overstates parity.** `Editor` means TinyMCE in Livewire and a monospace textarea in React and Vue. Menu, Tabs, Steps and Timeline are compositional in Livewire and data-driven elsewhere. `icon` is a string, a ReactNode or a slot depending on the stack.

**The migration is bigger than the plan says.** The plan lists 9 Blade packages and about 190 files. The scan finds 17 packages touching the UI layer, 250 Blade files, and 1,916 raw DaisyUI component classes. Not in the plan: `ecommerce-storefront-livewire` (212 usages), `bookings` (216 raw classes, no library components at all), `privacy` and `visual-editor`.

**Five planned packages also ship React and Vue UIs.** `forms`, `media-library`, `seo`, `analytics` and `pagespeed-insights` have about 450 usages each way, but Phase 7 treats them as Blade-only.

**Most of the work is raw classes, not attributes.** Codemods can rewrite about 530 component and attribute usages. The classes need a report and a person: 1,916 component classes, 1,087 ambiguous names, and 999 `bg-base-*` / `*-content` utilities with no token equivalent yet.

**One codemod rule carries most of the risk.** `variant` on Button appears 272 times and means color today. The rule has to read the value, because `variant="ghost"` stays and `variant="primary"` becomes `color`.

**Removing glass tints is free downstream.** No package uses any of the `glass*` props, so replacing them with `surface="glass"` has no migration cost.

## Regenerating

The reports are generated, except `vocabulary.md`, `token-audit.md` and the two curated maps. Snapshots go stale, so rerun this before Phases 6 and 7.

```bash
cd tools/inventory
npm install
npm run all   # extract APIs, scan downstream, build reports
npm test
```

The tools expect this repo beside the other packages. Set `AP_PACKAGES_DIR` otherwise.

| File | Role |
|---|---|
| `data/api-{livewire,react,vue}.json` | Generated: each stack's API |
| `data/downstream-usage.json` | Generated: per-package usage |
| `data/component-map.json` | **Curated:** component names, waves, consolidations |
| `data/api-aliases.json` | **Curated:** member renames and removals |
| `data/token-map.json` | **Curated:** token tiers and decisions |

The tests fail if a new component is exported and not mapped, so the matrix can't silently fall behind.

## Known limits

- **Static analysis.** Livewire slots and events are read from Blade source. Anything built dynamically won't appear, and Livewire `color` and `variant` values are only captured where a docblock lists them.
- **`missing` is an upper bound.** A concept with no alias yet counts as missing in each stack rather than as a rename.
- **Rename counts follow the vocabulary.** They change if the vocabulary does. DaisyUI counts don't.
- **Mixed snapshot.** Packages were scanned at their checked-out branch, or `origin/main` when that holds more UI. Each row in the codemod report shows its ref.
- **Downstream class counts include strings in `cn()` and `@class()`,** but not classes assembled in plain PHP. They are a floor.
