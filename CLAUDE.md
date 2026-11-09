# ArtisanPack UI Design System

Token-driven design system for ArtisanPack UI: DTCG tokens, a plain-CSS component layer, theme presets, a shared behavior engine, and one component API for Livewire (Blade + Alpine), React and Vue. The plan lives in the GitHub issues (#1 to #89), grouped into phases 0 to 8.

## Read first

| File | Why |
|---|---|
| `docs/decisions.md` | Settled decisions (D-001 onward). Don't relitigate them; supersede with a new entry if something must change |
| `docs/inventory/vocabulary.md` | The unified API: props, parts, slots, events, component names |
| `docs/inventory/parity-matrix.md` | Which components exist in which stack, and their issues |
| `docs/inventory/token-audit.md` + `data/token-map.json` | Where existing tokens land in `--apui-*` |
| `design/README.md` | The visual spec (Phase 1). The target every token and component must match |
| `design/brand-book.md` | The design rules: tokens, color roles, type, spacing, density, focus, glass, RTL |

## Sources of truth

1. **Decisions and vocabulary** (`docs/`) decide names and API.
2. **Design spec** (`design/`) decides how things look. Match its values, states and themes.
3. **DTCG tokens** (from #20 on) become the source of truth for values in code. Build them from `design/tokens/tokens.json`, keeping its names. After that, design changes arrive as diffs against the DTCG JSON.
4. **Manifest** (#26) is the per-component API contract the parity tests check.

If two of these disagree, stop and ask rather than picking one.

## Conventions

- **Namespace `apui` (D-002):** `.apui-<component>` root class, `--apui-*` custom properties, `@layer apui.reset, apui.tokens, apui.components, apui.utilities`. Never `ap-` in CSS (it collides with `visual-editor`).
- **Markup (#21):** one root class per component. Variants and state are data attributes: `data-variant`, `data-color`, `data-size`, `data-surface`, `data-state`, `data-invalid`, `data-disabled`. Parts carry `data-scope="<component>" data-part="<part>"`, matching Zag. Part names come from the vocabulary.
- **Tokens:** three tiers. Components read semantic and component tokens, never primitives. Themes and presets reassign semantic tokens only. Use the audit's names (`--apui-surface-page`, `--apui-text-default`, `--apui-border-muted`, `--apui-color-<c>-soft-foreground`, `--apui-elevation-*`, `--apui-space-4` = 16px).
- **No Tailwind dependency.** The Tailwind preset (#24) is optional and generated from tokens.
- **RTL (D-004):** logical properties only, enforced by stylelint. `start`/`end`, never `left`/`right`. Directional icons mirror. Chart plots and Code/Diff content stay LTR.
- **Accessibility:** WCAG 2.2 AA. Text 4.5:1 and control edges and focus 3:1 against every surface in every theme, checked by script, not by eye. Visible focus ring on `:focus-visible`, never removed.
- **Parity (D-003):** every component ships in all three stacks except ImageLibrary, StreamableContent and ThemePreview (Livewire only) and RichTextEditor (different engines).
- **Strings:** every user-facing string is translatable.

## Using the design spec

- `design/css/components.css` is reference CSS: right selectors, data attributes and token use, but one file and with private `--apui-_x` variables. Rebuild each component properly in `@artisanpack-ui/css` with component-tier tokens.
- `.is-hover`, `.is-focus`, `.is-active`, `.is-selected` exist only to force states in previews. Don't ship them.
- Open `design/components/<Name>/preview.html?theme=dark` to compare a build against the spec. `design/screens/` has PNGs of every preview in three themes.
- Glass is a surface (`data-surface="glass"`), not a theme preset (D-006).

## Workflow

- Work one issue at a time, in phase order: #16 → #17 → #18 → #19 → #20 → #21 → #22 → #23 → #24 to #31 → #32 to #37 → pilot #44 to #51 → waves.
- Each component follows its issue's steps and definition of done: spec (already in `design/`), manifest, CSS, Livewire, React, Vue, then the gates (visual regression ×3 stacks, RTL fixture, axe, keyboard and screen-reader checklist, API parity, docs page).
- Branch per issue, small commits with conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`), PR that closes the issue. CodeRabbit reviews PRs.
- Record any new decision in `docs/decisions.md` with the next D-number, and update affected issues.
- Don't regenerate `docs/inventory/*` reports by hand; use `tools/inventory`.
