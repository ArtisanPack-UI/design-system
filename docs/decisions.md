# Decision log

Decisions that shape the design system. To change one, add a new entry that supersedes it rather than editing the old one.

| ID | Decision | Issue | Date |
|---|---|---|---|
| [D-001](#d-001-no-separate-brand) | No separate brand: it stays ArtisanPack UI | #7 | 2026-11-01 |
| [D-002](#d-002-the-css-namespace-is-apui) | The CSS namespace is `apui` | #7 | 2026-11-01 |
| [D-003](#d-003-full-parity-at-launch-with-four-exceptions) | Full parity at launch, with four exceptions | #8 | 2026-11-01 |
| [D-004](#d-004-rtl-is-a-launch-requirement) | RTL is a launch requirement | #9 | 2026-11-01 |
| [D-005](#d-005-visual-direction-strata--edges) | Visual direction: Strata + edges | #14 | 2026-11-08 |
| [D-006](#d-006-glass-is-a-surface-not-a-theme-preset) | Glass is a surface, not a theme preset | #23 | 2026-11-08 |
| [D-007](#d-007-tokens-moves-here-1x-is-frozen-next-release-is-200) | `tokens` moves here; 1.x is frozen, next release is 2.0.0 | #17 | 2026-11-08 |
| [D-008](#d-008-token-source-format-and-build) | Token source format and build | #18, #19 | 2026-11-09 |
| [D-009](#d-009-css-lint-scope-and-a-scoped-reset) | CSS lint scope and a scoped reset | #21 | 2026-11-09 |

## D-001: No separate brand

**Decision.** The system has no brand name of its own. Docs call it the ArtisanPack UI Design System, descriptively. The package names in #16 stand: `@artisanpack-ui/tokens`, `css`, `behavior` and `manifest`.

**Why.** ArtisanPack UI already owns the npm scope (`@artisanpack-ui/react` 1.0.1, `vue` 1.0.0, `tokens` 1.0.1), the Composer vendor and the docs domain. A second name would add something to maintain and explain without unlocking anything.

## D-002: The CSS namespace is `apui`

**Decision.** Everything the design system puts in the global CSS namespace uses `apui`, replacing the `ap` planned in #18 and #21:

| Kind | Example |
|---|---|
| Root class | `.apui-button` |
| Custom property | `--apui-color-primary`, `--apui-button-radius` |
| Cascade layer | `@layer apui.reset, apui.tokens, apui.components, apui.utilities` |

**Why.** `visual-editor` is released and already uses `ap`. Its frontend output includes `.ap-tabs` and `.ap-accordion`, about 630 `.ap-*` selectors in all, and `--ap-*` variables in 105 files. The design system's Tabs and Accordion would collide with those rules on any page that mixes editor content with design-system components. Nothing from the design system has shipped, so renaming here costs only documents. Renaming in `visual-editor` would need deprecations for saved content.

`apui` had no matches across the packages when this was decided.

**Scope.** This covers only the CSS namespace. The `ap.` hook prefix, the `ap*` PHP helpers and `visual-editor`'s own `ap-` classes stay as they are.

## D-003: Full parity at launch, with four exceptions

**Decision.** Every component ships in Livewire, React and Vue at launch, except:

| Component | At launch | Why |
|---|---|---|
| **ImageLibrary** | Livewire only | Tied to Livewire uploads and `WithMediaSync`. React and Vue already have `media-library`'s own `MediaModal` and `MediaGrid`. |
| **StreamableContent** | Livewire only | Built on `wire:stream`. React and Vue would need a different transport, and nothing downstream asks for one. |
| **ThemePreview** | Livewire only | A theming dev tool, not a UI component. May move to the theme builder (#30). |
| **RichTextEditor** | All three, different engines | TinyMCE stays Livewire-only. React and Vue keep their lighter editor, so the component exists everywhere but its capabilities differ. |

Signature is **not** an exception, though #8 named it as a candidate. `forms` already has working React and Vue signature pads, so the port starts from those.

**Why.** One API across stacks is the point of the project, so deferring components because they are unused today would build in the drift it exists to remove. The port list is also shorter than it looks in the parity matrix, because several entries are consolidation candidates. "Zero downstream use" is weak evidence as well: the scan only covers first-party packages.

**What this requires.**

- The manifest records which stacks a component ships in, and any per-stack capability differences (#26).
- The parity tests and visual regression run only for those stacks (#39, #41).
- An exception is not a removal. These components still get rebuilt on the design system in the stacks they ship in.

## D-004: RTL is a launch requirement

**Decision.** Every component works in RTL at launch, with these rules:

- **CSS:** logical properties only, enforced by stylelint from #21. Physical properties need an explicit, commented exception.
- **API:** `start` and `end`, never `left` and `right`, as the [vocabulary](inventory/vocabulary.md) already says.
- **Behavior:** arrow-key navigation and positioning follow the text direction.
- **Icons:** directional icons mirror. Icons that do not imply direction stay as they are.
- **Visual regression:** one RTL pass per fixture from the pilot on, in all three stacks, using the default theme and density only. RTL is not multiplied across themes and densities, so it adds a single pass instead of doubling the matrix.
- **Stays LTR:** Chart plot content, and the content of Code and Diff. The controls around them still mirror.

**Why.** All the CSS is being rewritten, so logical properties cost almost nothing now, whereas a retrofit would touch every component in three stacks. Today's libraries have no RTL support: about 2,450 physical Tailwind utilities against 42 logical ones (a rough count), and only `en`, `de`, `es` and `fr` locales ship. Fixtures are part of the decision because logical CSS alone would not catch arrow-key or positioning bugs, and that breakage would build up unseen.

## D-005: Visual direction: Strata + edges

**Decision.** The default visual language is **Strata + edges**:

- Surfaces separate by tone: each layer is one lightness step from the one below.
- Every container carries a hairline edge (`--apui-border-muted`), so a component reads correctly whatever it is placed on.
- Shadows mark only things that float.
- Controls are round (`--apui-radius-control`), text fields gently rounded and containers rectangular.
- Geist and Geist Mono (OFL), Lucide icons (ISC).
- A neutral, steel-blue primary with grays tinted toward it.

Ledger (lines, near-square, tight) and Harbor (space and soft shadow, ink primary) ship as alternate presets that change token values only. The full spec is in [`design/`](../design/README.md).

**Why.** Three directions were explored (#13): Strata (tone), Ledger (lines) and Harbor (space). Judged as a component library rather than as screens, tone alone fails when a component lands on a same-toned background, shadow-led depth only works in light mode, and lines alone read as generic enterprise UI. Strata with an edge token on every surface keeps the calm tonal look of the references while working on any background and in both themes. Shipping the other two as presets proves the token structure lets developers change the whole personality without touching components.

**Answers to the token audit's open questions** (#6), for #20:

| # | Question | Answer |
|---|---|---|
| 1 | Surface mapping | Add `--apui-surface-page`. Order: sunken, page, default, raised, overlay, plus glass and inverse |
| 2 | Glass count | One recipe: 80% surface tone, blur, saturation, rim and `--apui-elevation-glass` |
| 3 | Glass as surface or preset | A surface only (D-006) |
| 4 | Glass and text | 80% opacity floor plus `--apui-text-muted-glass`, checked against black, white, red and blue backdrops |
| 9 | Elevation levels | A named set: `raised` (none in Strata), `overlay`, `glass` |
| 10 | Theme selector | One attribute, `data-theme`, on any element |

## D-006: Glass is a surface, not a theme preset

**Decision.** Glass is `surface="glass"` (`data-surface="glass"`) on container components: Card, Dialog, DropdownMenu, Toast, Navbar, Alert and Table. There is no `glass` theme preset. #23 ships light, dark and high-contrast, plus the Ledger and Harbor style presets.

**Why.** A glass theme would put glass on every surface, which the brief rules out, and it can't guarantee text contrast without knowing the backdrop. As a surface it is opt-in where a backdrop is worth showing, with a contrast floor, and it falls back to `--apui-surface-raised` under `prefers-reduced-transparency`, without `backdrop-filter` support, and in high contrast.

## D-007: `tokens` moves here; 1.x is frozen, next release is 2.0.0

**Decision.** `@artisanpack-ui/tokens` lives in this repo from 1.0.1, with its history. The React monorepo no longer contains it.

- **1.x is frozen at 1.0.1.** No more 1.x releases. React and Vue depend on `^1.0.1` from npm until they migrate to the new tokens.
- **The next release is 2.0.0**, cut with the other design-system packages in #81. It switches the format to W3C DTCG (#18 to #20) and the custom properties to `--apui-*` (D-002), so it is a breaking change.
- The package stays `private` here until then, so changesets can't publish a 1.x by accident.

**Why.** The issue already expected a major, because the format changes. Freezing 1.x keeps one source of truth without publishing anything in between: React and Vue keep working against the 1.0.1 already on npm, and pinning `^1.0.1` instead of `*` stops them from picking up 2.0.0 before they're ready for it. A fix that can't wait for 2.0.0 can still go out as a 1.0.x from this repo by lifting `private` for that release.

## D-008: Token source format and build

**Decision.**

- The source is DTCG 2025.10 JSON with object values (`{ "value": 16, "unit": "px" }`, `{ "colorSpace": …, "components": … }`), in `packages/tokens/tokens/`. The directory sets the tier: `primitive/`, `semantic/`, `component/`.
- Two extensions are documented: `dimension` also takes `em` and `ch`, and `color` takes only `srgb` (with a matching hex) and `oklch`.
- Modes are one file per mode under `modes/<axis>/`, for `theme` and `density`, switched by `data-theme` and `data-density` on any element.
- A small dependency-free Node build writes CSS (in `@layer apui.tokens`), a typed TypeScript map and a PHP array. The outputs are committed, and `npm run build` fails when they are stale.
- The 1.x modules (`cn`, `resolveColor`, glass helpers, DaisyUI color maps, the Tailwind plugin) are removed in 2.0.0. The Tailwind preset returns in #24, generated from the tokens.
- Motion, which the spec doesn't define, takes the 1.x duration scale and standard easings, plus semantic `motion.*` tokens.

**Why.**

- Object values are the stable DTCG form, and the string forms are deprecated. The extensions cover the three spec values DTCG can't express (letter spacing in `em`, `measure` in `ch`, and exact hex output) without bending the rest.
- One file per mode keeps every file valid DTCG on its own.
- Re-declaring the tokens that alias a mode token in every mode block is what makes subtree theming and density work in CSS. Style Dictionary would need custom formats for that, and for PHP, so a ~500-line builder is simpler and fully deterministic.
- Committing outputs lets PHP consumers read the array without Node, and makes every token change reviewable as a diff.

## D-009: CSS lint scope and a scoped reset

**Decision.**

- Stylelint bans every physical side property (`*-left`, `*-right`, `*-top`, `*-bottom`, `left`, `right`, `top`, `bottom`, the physical corner radii, and `left`/`right` values of `float`, `clear`, `text-align` and `caption-side`), plus box shorthands whose left and right values differ.
- `width` and `height` stay allowed.
- An exception takes `stylelint-disable-next-line … -- reason`, and an exception without a reason fails.
- The reset applies only inside elements with an `apui-` class, at zero specificity through `:where()`.
- An element with `data-theme` also gets `color: var(--apui-text-default)` and the matching `color-scheme`. It gets no background.

**Why.**

- Banning the block-axis sides as well keeps one simple rule ("logical only") and leaves room for vertical writing modes.
- Sizes don't flip in RTL, and the spec uses them throughout, so banning them would add exceptions without catching a bug.
- A page-wide reset would restyle the host app's markup, which a component library loaded into existing Laravel, React and Vue apps must not do.
- Text inherits as a computed color, so without the `data-theme` rule a dark region on a light page keeps the page's dark text. The element opts in through the attribute, so this stays scoped. Backgrounds are left to the surfaces the components paint.

