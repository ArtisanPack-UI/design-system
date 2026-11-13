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
| [D-010](#d-010-presets-may-reassign-color-ramps-and-the-radius-scale) | Presets may reassign color ramps and the radius scale | #23, #27 | 2026-11-09 |
| [D-011](#d-011-the-tailwind-preset-only-adds-and-apui-sits-under-utilities) | The Tailwind preset only adds, and `apui` sits under utilities | #24 | 2026-11-09 |
| [D-012](#d-012-headless-means-no-apuicomponents-layer) | Headless means no `apui.components` layer | #25 | 2026-11-09 |
| [D-013](#d-013-the-theme-generator-is-a-cli-plus-a-web-builder-on-the-docs-site) | The theme generator is a CLI, plus a web builder on the docs site | #30 | 2026-11-09 |
| [D-014](#d-014-without-a-bundler-use-the-prebuilt-composer-asset-no-official-cdn-build-at-10) | Without a bundler, use the prebuilt Composer asset; no official CDN build at 1.0 | #31 | 2026-11-09 |
| [D-015](#d-015-the-behavior-engine-is-zag-with-floating-ui) | The behavior engine is Zag, with Floating UI | #32, #37 | 2026-11-09 |
| [D-016](#d-016-the-quality-gates-ship-as-artisanpack-uitesting-plus-a-composer-kit) | The quality gates ship as `@artisanpack-ui/testing`, plus a Composer kit | #39, #40, #41, #43 | 2026-11-10 |
| [D-017](#d-017-icon-names-resolve-against-one-lucide-set-shipped-by-behavior) | Icon names resolve against one Lucide set, shipped by `behavior` | #44 | 2026-11-10 |
| [D-018](#d-018-form-fields-share-one-anatomy-and-route-attributes-to-the-native-control) | Form fields share one anatomy and route attributes to the native control | #45, #46, #47 | 2026-11-10 |
| [D-019](#d-019-overlays-put-the-root-class-on-the-panel-keep-zags-part-names-and-render-in-place-for-the-gates) | Overlays put the root class on the panel, keep Zag's part names, and render in place for the gates | #49, #50, #51 | 2026-11-11 |
| [D-020](#d-020-combobox-is-one-family-on-the-field-anatomy-tags-is-its-multiple--allowcreate-mode) | Combobox is one family on the field anatomy; Tags is its `multiple` + `allowCreate` mode | #54 | 2026-11-11 |
| [D-021](#d-021-datetime-is-datepickers-time-mode) | DateTime is DatePicker's `time` mode | #55 | 2026-11-11 |
| [D-022](#d-022-spotlight-composes-the-dialog-and-combobox-machines) | Spotlight composes the dialog and combobox machines | #57 | 2026-11-11 |
| [D-023](#d-023-the-navigation-menu-is-a-list-of-links-with-disclosure-sub-menus-tabs-is-an-engine-widget) | The navigation Menu is a list of links with disclosure sub-menus; Tabs is an engine widget | #56 | 2026-11-11 |
| [D-024](#d-024-router-links-plug-into-navigation-items-without-a-component-prop) | Router links plug into navigation items without a component prop | #56 | 2026-11-11 |
| [D-025](#d-025-form-wave-consolidations-selectgroup-radio-and-group) | Form wave consolidations: SelectGroup, Radio and `group` | #53 | 2026-11-11 |
| [D-026](#d-026-colorpicker-is-an-engine-widget) | ColorPicker is an engine widget | #53 | 2026-11-11 |
| [D-027](#d-027-a-field-with-several-controls-binds-through-x-modelable) | A field with several controls binds through `x-modelable` | #53 | 2026-11-11 |
| [D-028](#d-028-form-helpers-that-arent-machines-live-in-behaviorform) | Form helpers that aren't machines live in `behavior/form` | #53 | 2026-11-11 |
| [D-029](#d-029-drawer-popover-and-tooltip-draw-their-own-arrow-and-take-the-authors-control-as-the-trigger) | Drawer, Popover and Tooltip draw their own arrow and take the author's control as the trigger | #58, #59 | 2026-11-12 |
| [D-030](#d-030-accordion-and-collapse-are-engine-widgets) | Accordion and Collapse are engine widgets | #58 | 2026-11-12 |
| [D-031](#d-031-appshells-navigation-is-a-menu) | AppShell's navigation is a Menu | #58 | 2026-11-12 |
| [D-032](#d-032-grid-and-stack-are-token-driven-layout-primitives-in-every-stack) | Grid and Stack are token-driven layout primitives in every stack | #58 | 2026-11-12 |
| [D-033](#d-033-divider-replaces-separator) | Divider replaces `separator` | #58 | 2026-11-12 |
| [D-034](#d-034-loading-progress-progressradial-and-alert) | Loading, Progress, ProgressRadial and Alert | #60 | 2026-11-12 |
| [D-035](#d-035-soft-status-surfaces-get-their-high-contrast-edge-from-a-theme-token) | Soft status surfaces get their high-contrast edge from a theme token | #60, #61 | 2026-11-12 |
| [D-036](#d-036-emptystate-and-errorstate-share-one-anatomy) | EmptyState and ErrorState share one anatomy | #60 | 2026-11-12 |
| [D-037](#d-037-the-livewire-only-components-as-built-streamablecontent-and-imagelibrary) | The Livewire-only components as built: StreamableContent and ImageLibrary | #60, #61 | 2026-11-12 |
| [D-038](#d-038-data-display-helpers-live-in-behaviordata) | Data-display helpers live in `behavior/data` | #61 | 2026-11-12 |
| [D-039](#d-039-stat-and-kpicard-statgroup-is-dropped) | Stat and KpiCard; StatGroup is dropped | #61 | 2026-11-12 |
| [D-040](#d-040-timeline-follows-the-composition-rule) | Timeline follows the composition rule | #61 | 2026-11-12 |
| [D-041](#d-041-imageslider-is-a-carousel-widget-imagegallerys-lightbox-is-a-dialog) | ImageSlider is a carousel widget; ImageGallery's lightbox is a dialog | #61 | 2026-11-12 |
| [D-042](#d-042-table-has-one-table-scope) | Table has one `table` scope | #62 | 2026-11-12 |
| [D-043](#d-043-heading-and-text-listitem-lives-in-a-list) | Heading and Text; ListItem lives in a List | #58 | 2026-11-12 |
| [D-044](#d-044-usermenu-composes-dropdownmenu-avatar-colors-initials-by-name) | UserMenu composes DropdownMenu; Avatar colors initials by name | #58, #61 | 2026-11-12 |
| [D-045](#d-045-chart-draws-its-own-svg-from-shared-geometry) | Chart draws its own SVG from shared geometry | #63 | 2026-11-12 |
| [D-046](#d-046-chart-tooltips-are-a-shared-dom-controller-and-chart-scope-is-limited-to-the-spec) | Chart tooltips are a shared DOM controller, and chart scope is limited to the spec | #63 | 2026-11-12 |
| [D-047](#d-047-calendar-date-math-is-shared-and-livewire-has-two-tags) | Calendar date math is shared, and Livewire has two tags | #64 | 2026-11-12 |
| [D-048](#d-048-calendar-anatomy-and-accessible-names) | Calendar anatomy and accessible names | #64 | 2026-11-12 |
| [D-049](#d-049-markdown-renders-the-same-html-in-every-stack) | Markdown renders the same HTML in every stack | #65 | 2026-11-12 |
| [D-050](#d-050-code-clipboard-and-kbd) | Code, Clipboard and Kbd | #65 | 2026-11-12 |
| [D-051](#d-051-icon-and-the-directional-icon-list) | Icon and the directional icon list | #65 | 2026-11-12 |
| [D-052](#d-052-swap-is-a-token-driven-primitive-in-every-stack) | Swap is a token-driven primitive in every stack | #65 | 2026-11-12 |
| [D-053](#d-053-carousel-runs-on-the-d-041-carousel-widget) | Carousel runs on the D-041 carousel widget | #65 | 2026-11-12 |
| [D-054](#d-054-theme-choice-lives-in-behavior-and-applies-before-first-paint) | Theme choice lives in `behavior` and applies before first paint | #65 | 2026-11-12 |
| [D-055](#d-055-themepreview-is-a-blade-card-picker) | ThemePreview is a Blade card picker | #65 | 2026-11-12 |
| [D-056](#d-056-upgrade-rules-are-generated-and-every-stack-applies-the-same-ones) | Upgrade rules are generated, and every stack applies the same ones | #67 to #70 | 2026-11-12 |

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

**Extended by [D-037](#d-037-the-livewire-only-components-as-built-streamablecontent-and-imagelibrary):** StreamableContent and ImageLibrary as built.

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

## D-010: Presets may reassign color ramps and the radius scale

**Decision.**

- A **preset** is a named set of token reassignments, switched by `data-preset` on any element. It lives in `packages/tokens/presets/<name>/` as a `base.json` plus optional `<axis>/<mode>.json` files, all plain DTCG. The build validates the merged token set and writes `generated/presets/<name>.css` in `@layer apui.tokens`, plus TypeScript and PHP maps.
- A preset reassigns **existing** tokens only. It may reassign semantic and component tokens and, of the primitives, **color ramps and the radius scale**. Spacing, durations, font weights and other primitives stay fixed.
- **Themes** (`light`, `dark`, `high-contrast`) still reassign semantic tokens only.
- Components still read semantic and component tokens only, so a preset never needs a component change.
- Every preset passes the same contrast checks as the default, in every theme.
- Ledger and Harbor ship in `@artisanpack-ui/css`. Brand presets, including the `forest` example, are opt-in imports.

**Why.**

- The spec's Ledger preset reassigns the gray ramp and the radius scale (`design/presets.md`), and its rebrand guide reassigns the primary and gray ramps. Expressing that through semantic tokens alone would mean restating every gray-based role in every theme, and a ramp edit couldn't cascade.
- Allowing only color ramps and radii keeps the rhythm (space) and motion fixed, so a preset changes personality without breaking layout.
- A custom property is computed where it is declared. The preset CSS therefore re-declares every token that depends on a reassigned one, for every mode it varies by. Its selectors cover the preset on the same element as the mode, inside it and around it, so `data-theme` and `data-density` keep working at any nesting.

**Limits.** Presets don't nest back: `data-preset="ledger"` inside a Harbor region works, but there is no `strata` preset that restores the default inside a preset region. With two different themes nested *above* a preset element, the last mode block in source order wins over the nearer one. Put `data-theme` on the preset element, or inside it, when you mix them.

## D-011: The Tailwind preset only adds, and `apui` sits under utilities

**Decision.**

- `@artisanpack-ui/css/tailwind` is one `@theme inline` block, generated from the token map by mapping rules, with no hand-written list. Each utility reads the `--apui-*` property, so utilities follow theme, density and preset at runtime.
- It **only adds** theme variables. It never redefines one of Tailwind's defaults, which a test checks against `tailwindcss/theme.css`. The token font families map to `font-ui`, `font-code` and `font-display`, not to `font-sans` and `font-mono`.
- Apps put the whole `apui` layer between Tailwind's `base` and `components`:

  ```css
  @layer theme, base, apui, components, utilities;
  @import 'tailwindcss';
  @import '@artisanpack-ui/css';
  @import '@artisanpack-ui/css/tailwind';
  ```

**Why.**

- If `font-sans` were remapped, importing the preset would change the base font of every Tailwind app, and components that inherit their font would render differently with and without it. Additive means the preset is safe to add or remove.
- `apui.reset` … `apui.utilities` are sublayers of one `apui` layer, so a single statement places them. Above `base`, Preflight never overrides what a component sets. Below `utilities`, a utility class on a component still wins. The tests compile this setup with Tailwind and compare the rendering in Chromium.

## D-012: Headless means no `apui.components` layer

**Decision.**

- `@artisanpack-ui/css/headless` (`dist/headless.css`) is the full bundle minus every `./components/` import. It is built from the same entry, so the two can't drift.
- It keeps the reset, tokens, presets and utilities. `.apui-sr-only` still hides text, the focus ring utility still works, and headless markup can still read the tokens.
- Markup, ARIA and behavior are identical in both modes. The tests compare the DOM and the accessibility tree before and after interaction.
- Component CSS must not change what assistive technology gets: no `display: none` for state and no text in `content`. State is markup (`hidden`, `aria-*`, `data-state`).
- `dist/assets.php` lists the entry points (`default`, `headless`, `tailwind`) for the Livewire package's published assets (#42).

**Why.** Dropping one layer is the only form of headless that can't drift from the styled build. Keeping the utilities avoids a headless build that suddenly shows screen-reader text.

## D-013: The theme generator is a CLI, plus a web builder on the docs site

**Decision.**

- The generator is the CLI: `apui-generate-preset` from `@artisanpack-ui/tokens` (#27), and `php artisan artisanpack:generate-theme` in Livewire UI Components 3.0, on the same generator core.
- A **web theme builder** also ships, on docs.artisanpackui.dev: brand inputs in, a live preview in every theme and density, the contrast report, and the preset out as CSS, DTCG, PHP or JSON. It's tracked in the docs repo (ArtisanPack-UI/artisanpack-ui-docs#196), not here, because the docs site UI is rebuilt after the design system is complete.
- The builder runs the generator core in the browser rather than reimplementing it, so the CLI and the web produce the same preset from the same inputs.
- The token playground (#29) stays a token explorer. It doesn't export presets.

**Why.** The builder is the strongest showcase of the token structure: one color in, a fully re-themed system out, with contrast guaranteed by the same checks as the build. Putting it in the docs repo keeps it out of the 1.0 critical path and lets it use the rebuilt docs UI instead of being built twice. Sharing the generator core means the two can't disagree.

## D-014: Without a bundler, use the prebuilt Composer asset; no official CDN build at 1.0

**Decision.**

- Apps without a bundler use the **prebuilt CSS and JS** that Livewire UI Components publishes through `vendor:publish` (#42), from the `dist/assets.php` entry points (D-012). That is the only supported bundler-free path at 1.0.
- There is **no official CDN build** at 1.0. Once the packages are public (#81), jsDelivr and unpkg serve their files anyway, but without a global bundle, integrity hashes or a compatibility promise, so the docs don't present them as supported.
- An official CDN build (a self-registering Alpine adapter bundle, minified CSS, SRI hashes, pinned URLs) is a future release, tracked in #97.

**Why.** The audience without a bundler is almost entirely Livewire apps, which already have Composer, so the published asset covers them with nothing new to build or support. A CDN build adds a separate bundle format and a smoke test to every release, which isn't worth doing before 1.0 when nothing asks for it yet. Keeping it as a tracked future release means the behavior package's build doesn't have to change shape for it later.

## D-015: The behavior engine is Zag, with Floating UI

**Decision.**

- **Zag.js is confirmed** as the state machine library for the engine widgets (Menu and DropdownMenu, Combobox, Select and Choices, Popover, Tooltip, Dialog, Modal and Drawer, Tabs, DatePicker, the Toast stack and Spotlight). **Floating UI** positions everything Zag doesn't. The fallback (Floating UI plus small in-house machines) isn't needed.
- `@artisanpack-ui/behavior` defines each widget once (`machine` + `connect`). Alpine runs it through the package's own adapter, `createWidget` plus `x-apui:<part>` directives; React and Vue run the same definitions through Zag's framework adapters (#36). Parts carry Zag's `data-scope` and `data-part`, as the CSS conventions require (#21).
- Zag is pinned to a minor (`~1.47.0`) and updated deliberately: the adapter relies on its DOM ids and effects, which a minor can change.
- **Every part of a Livewire component has a stable, server-rendered `id`.** The Blade components render one per part; items use `wire:key`.

**Evidence: the spike (#33 to #35).** Dialog and Combobox ran through the Alpine adapter on Livewire 3.7.3 and 4.4.2, driven by Playwright, and passed 35 of 35 checks on each:

| Requirement | Result |
|---|---|
| Morphing | A dialog stays open, labelled and focus-trapped while server round trips re-render its teleported content. Combobox ARIA, the selected option and the input label survive `$refresh`. A morphed option list replaces the collection, and keyboard selection runs over the new items |
| `wire:model` | `open` and `value` are Alpine state, entangled both ways: the server opens and closes the dialog, and selections (single and multiple) reach the server |
| `wire:navigate` | Teardown releases the focus trap, scroll lock and `aria-hidden`, and adds no listeners per widget across round trips |
| Focus trap, Escape, scroll lock, portal | Pass, with `x-teleport` as the portal |
| Remote search | Typing updates an entangled `search`; the server's results replace the options |
| Livewire 3 and 4 | Both, with the same build |

The package tests repeat these in Chromium with Alpine's morph plugin, plus RTL positioning.

**What the spike found, and how the adapter handles it.**

- Livewire keys morphed elements by `wire:key`, then **`id`**. Zag gives every part an id, so a part rendered without one gets a different key from the server's and is replaced, stranding the machine's effects on a detached node. Hence the id rule above; the adapter passes author ids to the machine and warns about parts without one.
- Zag writes some state from effects rather than part props: `aria-hidden` on the page behind a modal, and a layer's inline `pointer-events`. A morph resets those, so the page behind an open modal became readable to screen readers again. The adapter carries them through the morph (`keepClientState`, hooked into Livewire's `morph.updating`) and restores inline styles that something outside strips.
- Zag's `spreadProps` caches what it last wrote, so it can't restore attributes a morph reset. The adapter applies props against the DOM instead.
- A morph removes list items before Alpine runs their cleanup, so the combobox drops detached items before rebuilding its collection.
- The classic-script build must target the browser: Zag reads `process.env.NODE_ENV`.

**Costs.**

- The bundler-free asset with Dialog and Combobox is 132 KB minified, 44 KB gzipped. `@zag-js/dom-query`, the combobox and its collection are most of it. Apps that bundle only pay for the widgets they import.
- Zag's part names differ from the spec in places: Dialog `backdrop`, `content` and `closeTrigger` against the spec's scrim, root and close; Combobox `content` and `item` against listbox and option. The vocabulary's standard parts (`trigger`, `content`, `item`) match Zag, so the Dialog pilot (#49) and the Combobox family (#54) settle the spec names against it rather than rename Zag's.
- `open-change` and `value-change` report changes the widget makes, not changes to the bound state, as in React and Vue.

**Why.** Zag passed every requirement on both Livewire versions with one build, and the problems the spike hit were in the adapter, not the machines: each has a fix that is now tested. Zag supplies the hard parts (focus trap, dismissal layers, `aria-hidden`, typeahead, collections, positioning) for all three stacks from one definition, which in-house machines would have to rebuild and keep at parity. Floating UI is already inside Zag's positioning, so using it directly for the rest adds nothing new.

**Extended by [D-030](#d-030-accordion-and-collapse-are-engine-widgets) and [D-041](#d-041-imageslider-is-a-carousel-widget-imagegallerys-lightbox-is-a-dialog):** Accordion, Collapse and the carousel join the engine widgets.

## D-016: The quality gates ship as `@artisanpack-ui/testing`, plus a Composer kit

**Decision.**

- The gates live in one place and every component repo runs the same code: **`@artisanpack-ui/testing`** (`packages/testing`, private until #81) holds the fixture builder, the React and Vue fixture hosts, the Playwright runner (`apui-gates check`), axe, the image diffs and the parity checks.
- **Fixtures come from the manifest.** Every variant × size × state, plus every other color × variant, rendered in each theme at the default density, plus one RTL sheet in the default theme and density (D-004). The states are hover, focus-visible and active for interactive components, forced through the DevTools protocol (no preview-only classes), plus each state prop (`disabled`, `loading`, …). A manifest can tune this with its optional `fixture` block. Stacks a component doesn't ship in are skipped (D-003).
- **One baseline per sheet, shared by all stacks.** Each stack diffs against it, and when several stacks render in one run they're diffed against each other. Baselines are Linux renders from CI.
- **Parity checks read rendered markup**, the same way in every stack: root class and element, `data-*` for variant/color/size/surface/orientation, evidence for state props, every other prop changes the markup, every part renders as `[data-scope][data-part]` and nothing else does. Vue's declared props and emits, and Blade's constructor and dispatched events, are compared too. Components are checked once their manifest is past `planned`.
- **The repo root is a Composer package, `artisanpack-ui/design-system`**, for the PHP side: the manifest classes, the docs example reader, the Blade fixture host and the Blade parity checks with a Pest `toMatchManifest` expectation. Livewire UI Components and the docs site require it.
- **Docs examples live next to the manifest**, in `packages/manifest/examples/<Name>/`: an `examples.json` and one source per shipping stack. `docsTables()` (TS) and `ManifestDocs::tables()` (PHP) build the props, parts, slots and events tables in each stack's spelling.

**Why.** Three copies of the gates, one per component repo, would drift exactly the way the components did. Reading markup, instead of each framework's type system, gives one rule set for Blade, React and Vue, and a broken reference component in each stack holds the TypeScript and PHP checks to the same messages. Composer is how PHP consumers already get ArtisanPack packages; a root `composer.json` avoids a second repo for a few classes that must match the manifests they read.

## D-017: Icon names resolve against one Lucide set, shipped by `behavior`

**Decision.**

- A string icon name (`leadingIcon="plus"`) resolves through a registry, in every stack. The default set is a Lucide subset (ISC) in `packages/behavior/icons/lucide.json`: the icons the components draw and the fixtures and docs use. Names are Lucide's, in kebab-case.
- React and Vue read it through `@artisanpack-ui/behavior/icons` (`resolveIcon`, `iconSvg`, `registerIcons`). Livewire UI Components copies the same JSON into PHP when it builds its assets (#42), so a name renders the same SVG, and the same pixels, in all three stacks. Apps register more names, or replace one, in each stack's registry.
- Every icon is the same `<svg>`: 24×24 viewBox, `stroke="currentColor"`, stroke 1.5, `aria-hidden="true"`. Its part sizes it. A slot or node overrides the name (vocabulary, Icons).
- Livewire falls back to blade-icons for names outside the registry, so `o-*` and `fa-*` names keep rendering during the migration.
- **Registered bodies are trusted markup.** Every stack injects them as HTML, so `registerIcons` (and Livewire's registry) check an allowlist: only `path`, `circle`, `rect`, `line`, `polyline`, `polygon`, `ellipse` and `g`, and no event handlers, `href`, `style`, character references or `javascript:`/`vbscript:`/`data:` URLs (`isSafeIconBody`). Never register user or CMS input. The registry is one store per page (`Symbol.for`), so the CJS and ESM builds share it.
- **The Lucide notice ships with the set.** `icons/LICENSE-lucide.txt` (ISC, plus MIT for the Feather-derived icons) travels with `lucide.json` wherever it is copied.

**Why.** The vocabulary made string names portable across stacks, and the visual-regression gate compares pixels across them, so all three need one source for the SVGs. `behavior` is the runtime package every stack already loads, and Livewire already copies its build. Shipping all of Lucide would cost every bundle hundreds of icons; a small default set plus registration keeps the brand book's Lucide look and lets any open-licensed 24px set be swapped in.

## D-018: Form fields share one anatomy and route attributes to the native control

**Decision.**

- **One anatomy.** Input, Select and Checkbox render a field root (`.apui-input`, `.apui-select`, `.apui-checkbox`) holding `label`, `control` (the native element), `hint` or `description`, and `error`. Input and Select draw the border on a `box` part around the control, its icons and its addons. `field.css` holds the shared rules; later form components (Textarea, DatePicker, Combobox) reuse it.
- **Attributes go to the control.** `class` goes to the root, and every other attribute (`wire:model`, `name`, `autocomplete`, `aria-*`) goes to the native control, so `wire:model` binds natively with no Alpine. The Blade parity kit counts a native `<input>`, `<select>` or `<textarea>` that receives `$attributes` as `wire:model` binding.
- **Select is the native element.** It is the first control with options, and the platform supplies the listbox, keyboard and screen-reader support. A searchable or rich listbox is the Combobox family (#54), on Zag (D-015). This takes Select off D-015's list of engine widgets.
- **Checkbox reports `checked-change`**, spelled `wire:model`, `onCheckedChange` and `update:checked` (`v-model:checked`). `value` stays the native submitted value, not the state. Its CSS reads the native `:checked`, so the box follows a click before a deferred `wire:model` round trip re-renders `data-state`.
- **The gates force pseudo-states on the control.** A field's root is a wrapper, so `:hover`, `:focus-visible` and `:active` are forced on its `[data-part="control"]` instead, where the browser puts them. The fixtures also render every non-default `surface` once (D-006).

**Why.** Five copies of label, hint and error markup is where form components drifted before (#3). Sending attributes to the native control is what Livewire, React and Vue users expect from a text field, and it keeps `wire:model` modifiers (`.live`, `.blur`) working. A native Select is accessible and small, and leaves the custom listbox to the component built for it instead of growing two.

## D-019: Overlays put the root class on the panel, keep Zag's part names, and render in place for the gates

**Decision.**

- **The root class goes on the panel.** `.apui-dialog` and `.apui-dropdown-menu` are Zag's `content` part, the element the spec draws, so the manifests' `root` part and `content` part are the same element. The trigger, backdrop and positioner are parts around it. Toast's root is the toast itself.
- **Spec names settle against Zag's (D-015).** Dialog: scrim → `backdrop`, root → `content`, close → `closeTrigger`, plus `positioner` and `trigger`. DropdownMenu: label → `itemGroupLabel`, text → `itemText`, check → `itemIndicator`, plus `itemGroup`, `positioner` and `content`; `icon` and `shortcut` are ours. Toast: close → `closeTrigger`; the region is Zag's `group` and the toaster's action button its `actionTrigger`, both rendered by the toaster, not by a Toast on its own, so they aren't in the Toast manifest.
- **Manifests name parts in camelCase; Zag writes kebab-case** (`data-part="close-trigger"`). The parity checks, TypeScript and PHP, compare the two as kebab-case, and look for parts in the whole render, since an overlay's trigger, backdrop and positioner sit outside the panel.
- **Binding spellings need the bound prop.** `value-change`, `open-change` and `checked-change` become `wire:model`, `update:modelValue`, `update:open` and `update:checked` only when the component has `value`, `open` or `checked`. DropdownMenu's `checked-change` reports an item (`{ value, checked }`), so it stays `checked-change` in Livewire and Vue; Toast has no `open`, so its close button's `open-change` stays `open-change`.
- **A root can take another role in some states.** The manifest's `a11y.roles` lists them (Toast: `alert` for errors), and the gate accepts them.
- **Built-in labels are props.** The icon-only close buttons take `closeLabel` (Dialog `Close`, Toast `Dismiss notification`), so React and Vue apps can translate them; Livewire defaults them through `__()`.
- **DropdownMenu's scope is `dropdown-menu`.** Zag scopes its menu `menu`, which is the navigation Menu's scope here, so the widget definition renames it through `rescope()`. Zag finds the menu's elements by id; only its fallbacks for several triggers on one menu query by scope, so a DropdownMenu has exactly one trigger.
- **Overlays take `portal`** (default true): `x-teleport`, a React portal or Vue Teleport to the body. The fixtures render them with `open: true, portal: false` (and `modal: false` for Dialog), so every case is in `#apui-fixture`, the server renders it for the parity checks, and open dialogs on one sheet don't fight over focus.
- **The harness puts overlay parts in the case.** A positioner sits in flow under its trigger and a backdrop fills the case behind it, as the spec's previews show them (`HARNESS_CSS`, with `!important` over the machines' inline positioning). Every stack gets the same rule, so the comparison is still between the components' own CSS.
- **Toasts are created from data, the same in every stack.** `createToaster()` wraps Zag's store with the design system's defaults (bottom-end, 8px gap, 5000ms, at most 5). `color` maps onto Zag's `type`, and `error` makes a toast an alert; `duration: 0` and an action keep a toast on screen. Duration is a toaster option, not a Toast prop, since a Toast rendered on its own (docs, fixtures, inline status) is static. Livewire's toaster listens for a `toast` browser event, so `$this->dispatch('toast', title: …)` shows one, and `ApuiBehavior.toast()` does from JavaScript.

**Why.** Rooting the class on the panel keeps the spec's CSS and the machine's parts on one element, so nothing wraps the panel only to carry a class. Renaming Zag's parts would mean rewriting its connect output and DOM queries for every widget, which is the cost D-015 avoided. Rendering overlays in place for the gates is the only way to compare them pixel for pixel and to read them from server markup; the harness rule keeps that out of the components.

## D-020: Combobox is one family on the field anatomy; Tags is its `multiple` + `allowCreate` mode

**Decision.**

- **Choices and ChoicesOffline become Combobox** (#54), on Zag's combobox machine (D-015). Filtering is local by default, by label, ignoring case and accents. `remote` hands the search to the app (`search-change`, and in Livewire a `search-model` set after `debounce`) and shows the options it's given. There's no non-searchable mode: a short list without search is Select (D-018).
- **Tags is not a component.** It's Combobox with `multiple` and `allowCreate`. Chosen values render as chips (`chip`, `chipRemove`); Backspace in the empty input removes the last one and announces it through a `status` live region; `max` caps the count. "Create …" is offered for text that matches no option or chosen value, ignoring case and accents, and choosing it fires `create`. `allowCreate` is the spec's name; the engine's `allowCustom` (accept free text with no option) is a different behavior and stays an engine option.
- **Combobox uses the field anatomy (D-018), which wins over D-019's "keep Zag's names" for field parts.** The root `.apui-combobox` is the field, not the panel. Zag's `control` and `input` render as `box` and `control` through `repart()`, a normalize proxy like `rescope()`: Zag finds the combobox's elements by id and its options by `role=option`, never by part. Its other parts keep Zag's names: `content` (spec listbox), `item` (option), `itemText`, `itemIndicator`, `trigger`, `clearTrigger`, `positioner`.
- **Built-in strings are props** with `{search}`, `{value}`, `{label}` placeholders (Livewire passes them through `__()` with `:search`, `:value`, `:label`). Matches are marked in `<mark data-part="mark">`: weight and underline, never color alone.
- `value` is a string or null, or an array with `multiple`. `wire:model` entangles it. With `name`, hidden inputs submit the value in a plain form.
- Livewire's `choices`, `choices-offline` and `tags` stay in 3.0 as deprecated aliases. The old Choices was multiple by default; the upgrade rules say so.

**Why.** The three Livewire components shared one option API and differed only in where filtering happened and whether values were chips. The Tags spec is "built from Combobox", and a second component would duplicate the listbox, keyboard and chip code in three stacks. The field anatomy is what D-018 asked later form components to reuse, and the validator already treats `input` as a rename of `control`.

**Known limit.** Zag's result-count announcement is English; Livewire translates it, React and Vue take it as a prop.

## D-021: DateTime is DatePicker's `time` mode

**Decision.**

- **One component.** DateTime ships as `DatePicker` with `time`: a time list (`role=listbox`, every `step` minutes) beside the month, and values that carry the time. Time mode takes single dates only. Livewire keeps `datetime` (rendering the time mode) and `datepicker` as deprecated aliases of `date-picker`.
- **Values are ISO 8601 strings in every stack**: `2026-11-12`, `2026-11-12T11:00`, and an array of two with `mode="range"`. `wire:model` binds them through `$wire.entangle()`; hidden inputs submit them under `name` (`name[]` for a range).
- **Typing always works.** The text field takes a numeric pattern, the locale's by default or `format`. Month and weekday names come from `Intl` in `locale`.
- **The root class is on the field**, like Combobox (D-020): a DatePicker is a form field whose popover is an aid, so D-019's panel rule doesn't apply. The panel is the `content` part. Zag's `control` and `input` render as `box` and `control` through `repart()`; the calendar parts keep Zag's names (spec grid → `table`, weekday → `tableHeader`, day → `tableCellTrigger`, month → `rangeText`).
- Livewire renders the month on the client from the widget's state, inside a `wire:ignore` positioner.

**Why.** The spec draws DateTime with DatePicker's root class and parts, plus a time column. A second component would duplicate the machine, the CSS and three stacks of code for one column.

## D-022: Spotlight composes the dialog and combobox machines

**Decision.**

- Spotlight has no machine of its own. Zag's dialog is the overlay and Zag's combobox the search, its listbox open whenever the dialog is. Escape and outside clicks reach the dialog.
- Both machines' parts carry the `spotlight` scope. Where their names collide (`trigger`, `positioner`, `content`), the dialog keeps Zag's (D-019: `content` is the root) and the combobox's take the spec's: `search` (Zag `control`), `query` (`input`), `results` (`content`).
- Result-count announcements live inside the panel, so a modal's `aria-hidden` doesn't silence them.
- Livewire searches three ways: `groups` filtered in the browser, `remote` with `search-change`, or a JSON `url`, which defaults to the 2.x `artisanpack.spotlight` route because a palette usually sits in a layout outside any Livewire component.
- Recent choices in `localStorage` are opt-in (`recent`), so nothing about what someone searched for is kept on the device unless the app asks for it.
- React and Vue export `Spotlight`; `SpotlightSearch` stays as a deprecated alias.

**Why.** Rebuilding the focus trap, dismissal, active descendant and announcements for one component would duplicate two machines that are already tested (D-015).

## D-023: The navigation Menu is a list of links with disclosure sub-menus; Tabs is an engine widget

**Decision.**

- **Menu is not an engine widget.** It's a nav landmark of links, not an ARIA `menu`: Zag's menu machine is a popup `role=menu`, which is wrong for site navigation (DropdownMenu keeps it, D-019). A sub-menu is the disclosure pattern: a button with `aria-expanded` and `aria-controls` toggling a list that is `hidden` while closed. A sub-menu holding the current page renders open. Livewire keeps the open state in Alpine with `wire:ignore.self`, so a morph keeps what the person left. This takes Menu off D-015's list.
- **Tabs is an engine widget** on `@zag-js/tabs`, with automatic or manual activation and arrow keys that follow the text direction. The spec's `panel` is Zag's `content`. Tabs `variant` is the spec's `segmented` · `underline`.
- **Composition is the base and data is a convenience** (vocabulary), in all three stacks: Tabs and `tab`/`Tab` with `tabs`, Menu and `menu-item`, `menu-sub`, `menu-title`, `menu-separator` with `items`, Navbar and `navbar-item` with `links`, Steps and `step` with `steps`. Data renders before composed children.
- Navbar's parts are the spec's `brand`, `links`, `link`, `search` and `actions`. On a narrow bar the links scroll sideways. Livewire `nav` stays as a deprecated alias of `navbar`.
- The spec's Menubar isn't built in this wave.

**Why.** A navigation list read as an application menu makes screen readers announce menu semantics and swallow arrow keys, which is the wrong model for links. Tabs is the one navigation widget with the roving focus and selection a machine is for.

**Extended by [D-031](#d-031-appshells-navigation-is-a-menu) and [D-040](#d-040-timeline-follows-the-composition-rule):** AppShell's navigation is a Menu, and Timeline follows the composition rule.

## D-024: Router links plug into navigation items without a component prop

**Decision.**

- **React:** link items take `renderLink` (Breadcrumbs items, Menu items and `MenuItem`). It receives the part's props, which the router's link spreads, so the markup matches a plain item. It's used only for an enabled item with an `href`.
- **Vue:** a wrapper provides the router's link component through `MENU_LINK_KEY` (`provide(MENU_LINK_KEY, Link)`); `MenuItem` renders it in place of the `<a>` with the same attributes. Breadcrumbs has a scoped `link` slot.
- **Livewire** uses `navigate` (`wire:navigate`), on by default as in 2.x, for internal links only: off-site, `#`, `mailto:` and new-tab links load normally (`SafeUrl::navigable()`). `:navigate="false"` turns it off, and the 2.x `no-wire-navigate` still does, deprecated.
- `react-laravel` and `vue-laravel` wrap these for Inertia (`InertiaMenu`, `InertiaBreadcrumbs`) and keep their 2.x item shapes.

**Why.** A link component isn't part of the component's API: it's how an app routes. Keeping it out of the declared props keeps the manifest the same in every stack, and lets Inertia, Vue Router or a plain `<a>` render identical markup.

## D-025: Form wave consolidations: SelectGroup, Radio and `group`

**Decision.**

- **SelectGroup is Select with option groups.** Select's `options` accepts `{ label, options }` entries, rendered as native `<optgroup>` in every stack. Livewire's `select-group` is a deprecated alias. The spec's "attached controls that share an edge" half belongs to Input's `prepend`/`append`, not to Select.
- **There is no standalone Radio.** Radios are RadioGroup parts (`item`, `box`, `control`, `indicator`, `itemText`, `itemDescription`), scoped `radio-group`, not the spec's shared `choice` scope: parity finds parts by the component's own scope.
- **RadioGroup `variant` is `default` · `cards` · `segmented`.** `segmented` replaces Livewire's `group`; the spec doesn't draw it, so it's built from Button's tokens.
- **CheckboxGroup reuses the pilot Checkbox** for its items and select-all (mixed state).
- **File** keeps its name in every stack (vocabulary rule 5); Vue's `FileUpload` is a deprecated alias.

**Why.** The platform renders option groups accessibly with no new component, and the spec says SelectGroup is "built from Select". A shared `choice` scope would hide the items from the parity gate.

## D-026: ColorPicker is an engine widget

**Decision.**

- ColorPicker joins D-015's engine widgets, on `@zag-js/color-picker`. The spec's popover needs a 2D area and channel sliders with pointer and keyboard handling, which the machine supplies for all three stacks.
- The root class is on the field (as in D-020 and D-021). The spec's swatch is Zag's `trigger`; the popover is `positioner` + `content`; the area, sliders, swatches and eyedropper keep Zag's names. The text value (`control`) stays outside the popover, so a color can always be typed.
- Values are text in `format`: `hex` (default), `rgb`, `hsl` or `oklch`. Zag's color utilities don't do OKLCH, so the widget converts sRGB ↔ OKLab ↔ OKLCH itself, clipped to the sRGB gamut. `alpha: false` drops the opacity slider.
- Zag mirrors the area and sliders in RTL but doesn't swap ArrowLeft and ArrowRight, so the widget does. Zag's English labels are replaced by translatable props. The eyedropper is hidden where the browser has no `EyeDropper`.

**Why.** A native `<input type=color>` can't draw the spec's picker, and an in-house area and sliders would be one more machine to keep at parity.

## D-027: A field with several controls binds through `x-modelable`

**Decision.**

- A field with one native control keeps D-018: every attribute but `class` goes to the control, and `wire:model` binds natively.
- A field whose value spans several native controls (Range with `dual`) puts `wire:model` on its root with `x-modelable`, holds the value in Alpine, and passes the other attributes to each control. The parity kit counts `x-modelable` as `wire:model` binding.
- Alpine state that mirrors a natively bound control (Textarea's counter, Password's strength meter, Pin's cells, Range's fill) re-reads the control after each Livewire commit, because a server change sets `el.value` without an input event.

**Why.** Two controls can't share one native `wire:model`. `x-modelable` is how Livewire binds a composite value, and keeping the other attributes on the controls keeps `name`, `aria-*` and modifiers where people expect them.

## D-028: Form helpers that aren't machines live in `behavior/form`

**Decision.**

- Signature, RichTextEditor and CodeEditor aren't Zag machines. Their logic (drawing on a canvas, sanitizing and converting rich text, indenting code) lives once in `@artisanpack-ui/behavior`'s `src/form`, with Chromium tests. Alpine registers `apuiSignature`, `apuiRichTextEditor` and `apuiCodeEditor`; React and Vue call the helpers directly. This amends the behavior README's "engine widgets only".
- RichTextEditor is the D-003 exception: Livewire runs TinyMCE under the design-system toolbar when the page loads it and the built-in editor otherwise; React and Vue use the built-in editor. The manifest records the difference. Output is `html` or `markdown`.
- Every Signature mode (drawn, typed, uploaded) produces a PNG data URL, so `value` has one shape.
- CodeEditor is a textarea with code keys (indent, outdent, line numbers); it has no syntax highlighting, and its content stays LTR (D-004).

**Why.** Three hand-written copies of a signature pad and a sanitizer are where the stacks drifted before. One tested implementation in the package every stack already loads keeps them identical, which the cross-stack gate checks pixel for pixel.

**Extended by [D-037](#d-037-the-livewire-only-components-as-built-streamablecontent-and-imagelibrary) and [D-038](#d-038-data-display-helpers-live-in-behaviordata):** ImageLibrary's client logic, and the data-display helpers in `behavior/data`.

## D-029: Drawer, Popover and Tooltip draw their own arrow and take the author's control as the trigger

**Decision.**

- **Drawer runs Zag's dialog machine, rescoped `drawer`** (as DropdownMenu is, D-019). Its parts are `trigger`, `backdrop` (spec scrim), `positioner`, `content` (the root `.apui-drawer`, D-019), `title`, `description`, `closeTrigger`, `handle`, `header`, `body` and `footer`. `side` is `end` (default) · `start` · `bottom`, written as `data-side`. `bottom` is the spec's sheet: the same root with a `handle` part, not a separate `.apui-sheet`. Drawer and Popover use Dialog's `open` semantics.
- **Popover and Tooltip keep Zag's names and scopes.** Popover: `trigger`, `positioner`, `content` (root), `arrow`, `title`, `body`, `actions`; it opens on click as a non-modal dialog. Tooltip: `trigger`, `positioner`, `content` (root), `arrow`, `kbd`.
- **`placement` is one logical prop**: `top` · `bottom` · `start` · `end`, written as `data-placement`; the side the machine settles on after flipping is Zag's `data-side`. Popover aligns to `<side>-start`; Tooltip is centered. The gutter is 8px for Tooltip and 10px for Popover.
- **The arrow is drawn by CSS, not placed by the machine.** The `arrow` part is `display: contents` and a `::before` square draws it: centered on the trigger for Tooltip, and offset from the panel's start edge for Popover (24px, or 16px from the top on a side placement). Popover's `arrow` prop turns it off.
- **The trigger is the author's own control.** React clones its child, Vue clones the slot's vnode and Livewire puts the trigger attributes on the first element in the slot (`TriggerElement`), keeping its `id` and classes and joining `aria-describedby`. Text on its own is wrapped: in a `span` with `tabindex="0"` for Tooltip, and in an outline Button for Popover.
- **Tooltip** takes `content` (React's `tip` and Vue's `text` are renamed), `placement`, `delay` (400ms on hover, none on focus), `size` (`md` · `lg`) and `shortcut` (keys joined by `+`, each in a `kbd` part). `open` is tri-state: unset is uncontrolled, `true` or `false` forces it, and `wire:model` or `v-model:open` binds it. It stays open while the pointer is on it and closes on Escape (WCAG 1.4.13), and only one shows at a time.
- **Tooltip props on other components are gone.** Livewire's `tooltip`, `tooltipLeft`, `tooltipRight`, `tooltipBottom` and `tooltipPosition` (Button, Stat and others) become a `<x-artisanpack-tooltip>` around the component, and the raw DaisyUI `class="tooltip" data-tip="…"` becomes `<x-artisanpack-tooltip content="…">`. The upgrade rules map them.

**Why.** A machine-placed arrow can't match the Livewire server render, and the CSS tests ban the `!important` that overriding its inline styles would need. Wrapping the trigger in an element of our own would nest interactive controls and move `aria-describedby` off the control people focus. A tooltip prop on every component would repeat the trigger logic in each of them.

## D-030: Accordion and Collapse are engine widgets

**Decision.**

- Accordion and Collapse join D-015's engine widgets, on `@zag-js/accordion` and `@zag-js/collapsible`.
- **Accordion keeps the spec's part names** through `repart()` (D-020): Zag's `itemTrigger`, `itemIndicator` and `itemContent` render as `trigger`, `chevron` and `content`, beside `item` and `title`; Zag finds triggers by `data-controls`, not by part. The spec's `heading` is the vocabulary's `title`, rendered at `headingLevel`. The spec's `type` is the `multiple` boolean, `collapsible` lets the last open item close, and `value` is the array of open items (`defaultValue` is React's uncontrolled form). `variant` is `default` · `separated` · `flush`.
- Accordion's children are `accordion-item` / `AccordionItem` (the vocabulary's `{parent}-item` rule), with `items` as the data convenience. React and Vue `Collapse` children of an Accordion become `AccordionItem`.
- **Collapse runs the collapsible machine rescoped `collapse`**, its `indicator` rendered as `icon`. Its parts are `trigger`, `icon`, `content` and `fade`; the trigger text is `label` (`openLabel` while open). `variant` is `section` · `read-more`. Read-more clamps through the machine's `collapsedHeight` (`--apui-collapse-clamp-height`, 64px), so the hidden text stays in the accessibility tree.

**Why.** The machines give the ARIA, ids and arrow keys in all three stacks from one definition. Keeping the spec's part names keeps the spec's CSS on the parts it draws.

## D-031: AppShell's navigation is a Menu

**Decision.**

- AppShell is the page frame: its parts are `skipLink`, `sidebar`, `brand`, `footer`, `collapseTrigger`, `main` and `content`, and its slots `brand`, `sidebar`, `header` and `footer`.
- **The spec's navigation section, item and badge are Menu's title, item and badge** (D-023), placed in the `sidebar` slot. AppShell draws no navigation of its own.
- `collapsed` shrinks the sidebar and its Menu to icons; `collapsible` adds a `collapseTrigger` button with `aria-pressed` and a `collapsed-change` event. `sidebarWidth` and `gutter` size the frame; `skipLabel` and `collapseLabel` are translatable.
- Livewire `main` and React/Vue `Sidebar` stay as deprecated aliases.
- There's no mobile drawer at 1.0: below 48rem the sidebar stacks above the content. A drawer mode is a follow-up.

**Why.** Menu already draws the spec's pills, current page and disclosure sub-menus. A second navigation list inside AppShell would duplicate it in three stacks.

## D-032: Grid and Stack are token-driven layout primitives in every stack

**Decision.**

- Grid and Stack ship in all three stacks as minimal primitives with no spec of their own. Livewire gets `grid` and `stack`; `widget-grid` is a deprecated alias of `grid`.
- **Grid:** `columns` (1 to 12, `data-columns`), or `minItemWidth` (`--apui-grid-min-item-width`) for as many columns as fit; `gap`; `align` and `justify`. React and Vue's `cols`, `colsSm` to `colsXl`, `gapX` and `gapY` are dropped: responsive columns come from `minItemWidth`.
- **Stack:** `orientation` (`vertical` · `horizontal`, replacing `direction`, which is kept deprecated), `gap`, `align`, `justify` and `wrap`.
- `gap` takes a space-scale step (`0` to `16`, `data-gap`) in both, so a gap means the same `--apui-space-*` value everywhere.

**Why.** Tailwind is optional (D-011), so an app without it still needs a grid and a stack, and the system's own compositions (a row of Stats, an EmptyState's actions) need one gap scale with one spelling.

## D-033: Divider replaces `separator`

**Decision.**

- Livewire's `separator` becomes `divider`, kept as a deprecated alias; `vertical` becomes `orientation`.
- A plain horizontal Divider is an `<hr>`. A vertical or labelled one is a `div` with `role="separator"`, named by its `label`. `decorative` hides it from assistive technology. `align` (`start` · `center` · `end`) places the label (React and Vue's `labelPosition`); `strength` is `subtle` · `strong`.
- The 2.x loading bar (`progress`, `target`) is dropped: that's Progress's job. `color` and `image` are dropped.

**Why.** A rule that doubles as a loading indicator has two roles in one element. Progress already announces loading properly.

## D-034: Loading, Progress, ProgressRadial and Alert

**Decision.**

- **Loading** has one root `.apui-loading` with `role="status"`, one `indicator` part and a `label` (default "Loading", visually hidden). `variant` is `spinner` · `dots`; `overlay` (`data-overlay`) covers the nearest positioned ancestor; `delay` (300ms, through a private custom property) keeps quick loads from flashing a spinner.
- **Progress** puts `role="progressbar"` and `aria-value*` on the root (no `aria-valuenow` while `indeterminate`), named by `label` (`aria-labelledby`) or `aria-label`. `segmented` renders `max` `bar` parts with `data-done` instead of a separate segments part; `valueText` replaces the shown and announced value. React's `showValue` is dropped.
- **ProgressRadial stays its own component**, not a Progress variant. `size` and `thickness` are numbers in pixels; the ring mirrors in RTL; it takes `label`, `valueText`, `hideValue`, `indeterminate` and `max`. It's new to React and Vue.
- **Alert dismisses itself.** It has no `open` prop: `dismissible` adds a `closeTrigger` (the spec's close, labelled by `closeLabel`, default "Dismiss") that hides the alert and emits `open-change` with `false`. The root is `role="alert"` for `color="error"` and `role="status"` otherwise. `surface` is `default` · `glass`. React and Vue's `visible` and `onDismiss` become the built-in dismissal and `onOpenChange`; Livewire's `shadow`, glass tints and `colorAdjustment` are dropped.
- Alert, EmptyState and ErrorState fill `description` from the default slot.

**Why.** One root class per component, as the manifest requires, and the parity gate renders every part at once, so a Loading with two indicator elements or a Progress with a separate segments part couldn't be compared. A radial ring has its own anatomy (an SVG track and bar) and sizing, which a Progress variant would only hide behind conditionals.

## D-035: Soft status surfaces get their high-contrast edge from a theme token

**Decision.**

- A new semantic theme token, `border.soft-edge-width` (`--apui-border-soft-edge-width`), is `0` in light and dark and `1px` in high contrast.
- Soft Badge and soft, non-glass Alert keep the spec's transparent border and draw `outline: var(--apui-border-soft-edge-width) solid <tone border>` with `outline-offset: calc(-1 * var(--apui-border-width))`, so the outline lies over the border. Light and dark match the spec, with no edge.
- No component CSS reads `data-theme`. Other soft-tinted surfaces use the same token.

**Why.** In high contrast a soft tint alone sits too close to the page to mark the component's edge. A `[data-theme='high-contrast']` rule in a component would break the convention that themes only reassign tokens, and wouldn't follow a theme switched on a subtree or a preset. A theme-mode token keeps the difference where every other theme difference lives.

## D-036: EmptyState and ErrorState share one anatomy

**Decision.**

- EmptyState and ErrorState have their own roots (`.apui-empty-state`, `.apui-error-state`) and scopes, and share one stylesheet. Parts: `icon`, `title`, `description`, `actions`, plus ErrorState's `numeral` (404 on `not-found`) and `code`.
- `headingLevel` (1 to 6, default 3) sets the title's heading. EmptyState `variant` is `first-use` · `no-results` · `cleared`; ErrorState's is `request` · `offline` · `not-found` · `forbidden`.
- ErrorState is `role="alert"`; `focusTitle` moves focus to the title when it renders in place of content.
- React and Vue `ErrorDisplay` stays as a deprecated alias of ErrorState. React and Vue EmptyState's `heading` and `headingAs` become `title` and `headingLevel`. Skeleton, EmptyState and ErrorState are new to Livewire.

**Why.** The two differ in tone and role, not in layout, and they pair in the vocabulary. A heading level prop keeps the outline right wherever the state renders.

## D-037: The Livewire-only components as built: StreamableContent and ImageLibrary

**Decision.**

- **StreamableContent** ships in Livewire only (D-003): its manifest marks React and Vue `false` and gives the reason under the Livewire stack's differences. Its parts are `status` (`role="status"`), `stopTrigger` (dispatches `stop`), `content` (`aria-live="polite"`, `aria-busy` while streaming), `caret` and `actions`; `state` is `waiting` · `streaming` · `done` · `error` · `stopped`. The 2.x `tag`, `prose`, `placeholder` and `showCursor` are removed.
- **ImageLibrary** ships in Livewire only and keeps 2.x's `WithMediaSync` contract, so existing pages work: `wire:model` names the uploads, `wire:library` the collection, and upload, replace, remove, reorder and `refreshMediaSources` still call the trait. Crop runs Cropper.js inside the design system's Dialog; alt text edits `library.<key>.alt`. It has no dependency on `media-library`.
- ImageLibrary's client logic is `apuiImageLibrary` in `@artisanpack-ui/behavior` (as D-028's helpers are). It emits `selection-change` and `insert`, not `value-change`, because `wire:model` already names the uploads. `withDragDrop` becomes `droppable`, `dragDropClass` becomes `classes.dropzone`, and `preview` becomes `assets`.

**Why.** Both are tied to Livewire transports (`wire:stream`, Livewire uploads), as D-003 records. Building them as the exceptions they are, with manifests that say so, keeps the gates honest about what ships where.

## D-038: Data-display helpers live in `behavior/data`

**Decision.**

- Sparkline and Diff have no machine. Their logic lives once in `@artisanpack-ui/behavior`'s `src/data` (`sparklineGeometry`, `sparklineLabel`, `diffText`, `splitRows`, `wordDiff`), used directly by React and Vue. This extends D-028 to data display.
- Livewire ports them to PHP (`SparklineGeometry`, `DiffBuilder`) with the same formulas and tie-breaking, and renders the SVG and the diff table on the server, so `wire:poll` redraws them with no script.
- No stack loads a chart or diff library: Livewire's ApexCharts sparkline and diff2html are gone.
- **Sparkline** takes `data`, `variant` (`line` · `area` · `bar`; 2.x `type` and the spec's `kind`), `width`, `height` and `label`. **Diff** takes `oldContent` and `newContent` (Livewire `old`/`new`, Vue `before`/`after`), `view` (`unified` · `split`), `wordLevel` and `context`, renders hunks with word-level `ins` and `del`, and keeps its code LTR (D-004) while the header mirrors. Copy and view toggles go in the `actions` slot; they aren't built in.

**Why.** Pixel parity across stacks needs one geometry, and a server-rendered Livewire SVG is the only way a polled component redraws without client code. One tested implementation in the package every stack loads keeps them identical.

## D-039: Stat and KpiCard; StatGroup is dropped

**Decision.**

- **Stat** takes `label` (2.x `title`), `value`, `unit`, `icon`, `delta`, `change`, `trend` (`up` · `down` · `flat`), `description` (2.x `changeLabel`), `size`, `color`, `emphasis` and `bare`. `change` as a percentage sets `trend` when it's unset. The delta's direction is hidden text from `upLabel`, `downLabel` and `flatLabel`, and its arrows don't mirror in RTL. Stat's tooltip, layout, glass, sparkline and count-up props are dropped.
- **KpiCard is its own component built from Stat**, not a Stat option: the root is `.apui-card.apui-kpi-card`, its stat comes in one `stat` object, and it composes Sparkline (`area`) and a small Progress for `target`. The spec's `trend: number[]` is `sparkline`, because `trend` is a direction on Stat. 2.x's flat props move into `stat`, and `sparklineData` becomes `sparkline`.
- **StatGroup is dropped**: a row of stats is a Grid (D-032). React's `StatGroup` is removed with no alias.

**Why.** A KPI card is a card with a stat, a chart and a target, which a Stat layout option would only reach through a pile of conditionals; building it from Stat keeps one stat anatomy. A group component added nothing a Grid doesn't do.

## D-040: Timeline follows the composition rule

**Decision.**

- Timeline follows D-023: composition is the base and `items` a convenience. Livewire gets a `timeline` parent for its 2.x `timeline-item`; React and Vue add `TimelineItem` (Vue's data type becomes `TimelineItemData`).
- Items are `li` elements with `marker`, `head`, `time` (2.x `subtitle`), `body` and `card` parts. Markers are decorative. `variant` is `icon` · `dot`; `dot` drops the icons.
- React and Vue's `vertical`, `compact`, `snap` and `pending` are removed.

**Why.** Livewire had only the item, composed by hand into whatever list the author wrote, which axe rejects when it isn't a list.

## D-041: ImageSlider is a carousel widget; ImageGallery's lightbox is a dialog

**Decision.**

- **ImageSlider** runs a carousel widget on `@zag-js/carousel`, added to D-015's list. `carouselDefinition(scope)` is rescoped per component, so Carousel (#65) reuses it. It keeps Zag's parts: the dots are `indicatorGroup` and `indicator` (with `aria-current`), the counter is `progressText`, the arrows `prevTrigger` and `nextTrigger`, plus `viewport`, `itemGroup`, `item` and `autoplayTrigger`. Autoplay pauses on hover and focus. 2.x `autoPlay` and `autoPlayInterval` become `autoplay` and `interval`.
- **ImageGallery's lightbox** is Zag's dialog machine rescoped `image-gallery`: `backdrop`, `positioner`, `content` (`.apui-lightbox`), `title`, `trigger`, `image`, `prevTrigger`, `nextTrigger`, `thumbs`, `thumb` and `download`, with the shown image as adapter state. `lightbox` (2.x `enableLightbox`) is on by default. The PhotoSwipe hook is removed; ImageSlider has no lightbox.
- The shown image or slide is `index`, with `index-change`, not `value`: nothing is being chosen.
- Livewire renders the carousel's layout styles on the server, so the slider lays out before Alpine runs.
- ImageGallery and ImageSlider ship in all three stacks; React and Vue get `useLightbox` and `useCarousel`.

**Why.** A slider is a carousel, and one widget for both keeps their keyboard and announcements identical. A lightbox is a modal dialog, which D-019's machine already covers. D-019 keeps Zag's names.

## D-042: Table has one `table` scope

**Decision.**

- Table's parts carry one `data-scope="table"`, replacing the spec's `table-grid` scope and `.apui-table-grid` class. The manifest names parts in camelCase (`headCell`, `expandTrigger`), the markup in kebab-case, as D-019 does.
- The root is a `div` around the `<table>`, so classes and attributes move off the `<table>` element.
- `density` is `compact` · `default` · `comfortable`; compact steps the type down to `body-sm` through a `[data-density='compact']` rule, since density has no type token. `--apui-table-max-block-size` bounds the scroll area for `stickyHeader`.
- The empty row isn't a manifest part (`td[data-empty]`): the fixture can't render rows and the empty state at once. Empty always shows the empty state.
- Selection is `value` with `value-change`, sorting `sortBy` (`{ column, direction }`) with `sort-change`, expansion `expanded` with `expanded-change`; `selectable` and `expandable` combine. Livewire keeps `paginated`, `perPage` and `perPageValues`. Livewire's virtual scroll, export toolbar and events, `striped`, `noHover`, `containerClass` and header glass are removed; React and Vue keep their 2.x names as deprecated aliases.

**Why.** Parity reads parts by the component's own scope, as with D-025's radios. A second scope for the grid would hide its parts from the gate.

## D-043: Heading and Text; ListItem lives in a List

**Decision.**

- **Heading's `level` and `size` are separate.** `level` (1 to 6, default 2; 2.x defaulted to 1) sets the element, `size` the look and defaults to the level; both are data attributes. `eyebrow` renders as a sibling `<p>`, not inside the heading.
- **Subheading is Text with `size="lead"`.** Livewire `subheading` is a deprecated alias: 2.x rendered a paragraph, not a heading. Text takes `as`, `size`, `tone`, `weight`, `truncate` and `clamp`.
- **ListItem is a row in a List.** In a List (`.apui-list`, Livewire `list`, React and Vue `List`) it's an `li`; on its own a `div`. `variant` (`plain` · `bordered` · `divided`) and `ordered` belong to the List.
- `href` or `interactive` turns the title into a stretched link or button, so the row is one target while `trailing` stays clickable. `selected` sets `data-selected` and `aria-current`; `disabled` sets `aria-disabled` on the row. 2.x `link` becomes `href`; `item`, `value`, `subValue` and `avatar` still fill the row, deprecated.

**Why.** One `h1` per page and a correct outline need the level to be independent of the look. The spec frames rows in `.apui-list[data-variant]`; an `li` outside a list fails axe, a clickable `li` isn't operable by keyboard, and `aria-selected` isn't valid on an `li`.

## D-044: UserMenu composes DropdownMenu; Avatar colors initials by name

**Decision.**

- **UserMenu is a DropdownMenu** (D-019): the panel is `.apui-dropdown-menu.apui-user-menu`, and its trigger shows an Avatar. The workspace and theme pickers are radio items with prefixed values (`workspace:<id>`, `theme:<theme>`), reported as `workspace-change` and `theme-change`; other items fire `select`, Log out with the value `logout`. `hideTheme` replaces `showTheme` (no `show*` booleans). `logoutAction` is Livewire's: Log out posts to it through a hidden form with the CSRF token. Livewire `profile` is a deprecated alias.
- **Avatar's initials color is a stable hash of `name`**: the sum of its code points mod 7, over `primary`, `secondary`, `accent`, `success`, `warning`, `error` and `info`. Without a name it's neutral; `color` overrides the hash. Initials are the first letters of the first and last words.
- The status joins the accessible name ("Name (Online)") through a translatable `statusLabel`. The image layers over the initials, so a failed image falls back with no script. 2.x `image` and `placeholder` become `src` and `name`. Avatar groups are `avatar-group` / `AvatarGroup`.

**Why.** A user menu is a dropdown menu with a richer header; composing it reuses DropdownMenu's machine and keyboard. A hash gives the same person the same color in every stack and on every render, with no stored state.

## D-045: Chart draws its own SVG from shared geometry

**Decision.**

- Chart (`bar` · `line` · `area` · `donut`) is drawn from `chartGeometry` in `@artisanpack-ui/behavior`'s `src/data/chart.ts`, used directly by React and Vue. Livewire ports it to PHP (`ChartGeometry`) and renders the SVG on the server; shared vectors prove the two produce the same numbers. This extends D-038 to charts: no stack loads ApexCharts, and `ChartThemes` is removed.
- The root is `.apui-card.apui-chart` with `data-type`. Parts: `header`, `title`, `description`, `actions`, `legend`, `swatch`, `body`, `plot`, `grid`, `axis`, `mark`, `line`, `area`, `point`, `crosshair`, `dot`, `value`, `tooltip` and `table`. Series take `--apui-chart-1…6` in order through `data-series`.
- The default viewBox is 520×220, the donut 160 (radius 64, inner 44). The plot scales to its container; `width` and `height` are viewBox units. Ticks are nice numbers (about five intervals, always including zero). The first series' maximum is the one labeled value.
- The plot is a named `role="group"` and stays LTR (D-004); grid, axes and labels are `aria-hidden`. Each bar, slice, or line/area category column is a focusable `role="img"` whose name carries every series' value.
- The spec's `showTable` is `tabular`, since the manifest rejects `show*` booleans; Livewire also accepts `show-table`. The legend shows for two or more series.
- 2.x Apex `options` are dropped, except that categories, `labels` and the title still fill `labels` and `title`; `pie` becomes `donut`. React and Vue `data` becomes `series` plus `labels`, and `title` is required. `data` entries may still be ApexCharts points (`{x, y}`, `[x, y]`); the first pointed series' `x` labels the categories when `labels` is empty.
- Numbers round as JS `toFixed` does on the exact double; the PHP port uses `ChartGeometry::toFixed`, never `number_format`. Standard values print up to 2 decimals, or 2 significant digits below 1; ticks print at least 2 decimals, more when the step needs them; 10 at most. Compact values use one decimal and step up a unit when rounding reaches 1,000.

**Why.** A token-themed, server-rendered SVG gives pixel parity across stacks and full theme, RTL and high-contrast control, which a canvas or Apex SVG doesn't. Sparkline already proved the approach.

## D-046: Chart tooltips are a shared DOM controller, and chart scope is limited to the spec

**Decision.**

- `attachChartTooltip(root)` in `behavior` is one controller all stacks attach (Alpine `apuiChart`). Marks carry `data-tooltip-title`, `data-tooltip-body` and `data-anchor-x/y`; the controller listens on the root only, so Livewire's morph doesn't break it. The tooltip opens on hover and focus, closes on Escape, blur or pointer leave, and is `aria-hidden` because the mark's name already says everything.
- Bars draw the first series; the donut draws the first series' positive values. There are no stacked, grouped or dual-axis charts.
- Values format with `prefix`, `suffix` and `notation` (`standard` · `compact`). Formatting isn't locale-aware, and the chart has no built-in strings: everything shown comes from props.

**Why.** A tooltip that only repeats a mark's accessible name doesn't need a state machine. The spec shows none of the larger chart types, and its "no dual axes" rule rules out the rest.

**Addendum (review).** The y axis is clamped to ±1e300 (`CHART_LIMIT`), and values beyond it draw at the limit while the tooltip and table print the real value. The tick step is at least 1e-10 (`CHART_MIN_STEP`, the smallest step the labels print), and NaN counts as 0, so any finite input gives a finite axis. A viewBox that doesn't fit the padding (width ≤ 48, height ≤ 36) uses the default 520×220. Both ports parse powers of ten from `1e…` and print values of 1e21 and above as full digits, so TS and PHP agree at any magnitude.

## D-047: Calendar date math is shared, and Livewire has two tags

**Decision.**

- `calendarModel()` in `behavior/src/data/calendar.ts` builds the month, week, day and agenda views on `@internationalized/date`; Livewire ports it to PHP (`CalendarModel`) with the same formulas and tie-breaking. Dates format through ICU skeletons in both (`yMMMM`, `EEE`, `EEEE`, `yMMMMEEEEd`, `MMMd`, `yMMMd`); times are 24-hour `HH:mm` everywhere so stacks match. `timeZone` defaults to UTC and `today` can be pinned, so fixtures are deterministic.
- Livewire keeps `<livewire:artisanpack-calendar>` as the stateful public component (view and date on the server, `goToNextPeriod`, `goToPreviousPeriod`, `goToToday`, `loadEventModal`), with event-modal-content as its internal child. It renders `<x-artisanpack-calendar>`, a stateless view that dispatches `view-change`, `date-change`, `event-click` and `create` as browser events. Parity and the gates use the x-tag. It's no longer lazy by default.
- `weekStartsOn` defaults to the locale (2.x Livewire defaulted to Monday); 2.x `sunday-start` still maps to it.

**Why.** The parity and fixture hosts render x-tags only, and a stateless grid is what React and Vue ship too. Shared math keeps week starts, overflow and multi-day spans identical.

## D-048: Calendar anatomy and accessible names

**Decision.**

- The toolbar uses Button (Today, previous and next mirrored in RTL, New event), an `h2` title with `aria-live`, and a view switcher that reuses the Tabs markup and CSS but not the Tabs widget: a tablist whose tabs control the calendar body, with roving focus (`rovingKeydown`) and manual activation.
- The body is a `role="grid"` with one tab stop and arrow keys that follow text direction; they stop at the grid's edge. Agenda reuses the grid's parts as a list (`ul`, `li`, `h3`), and an empty agenda shows EmptyState. Event details open in Dialog in every stack. React and Vue keep the roving tab stop in state (the arrow-key target for the shown view and date), not in the `tabIndex` the shared keydown helper writes, so a re-render never leaves two tab stops; Livewire's morph resets it to the server's.
- An event is a button, or a link with `href`. Its name starts with the visible time and title, followed by a visually hidden category and full date and time; each day cell starts with a hidden full date. There are no `aria-label`s on cells or events (WCAG 2.5.3). Events and "+N more" are at least 24px tall.
- A month cell shows `maxEvents` (default 2) events, then "+N more", which opens that day. Multi-day events repeat on each day, a date `end` is inclusive, and a timed event ending at 00:00 ends the day before. Week and day views list events in columns with no hourly axis: the spec has no week or day design.

**Why.** The visible text must begin the accessible name, and axe flagged the label-based version. Reusing Tabs' look keeps the switcher consistent without nesting panels in the toolbar.

**Addendum (review).** Livewire UI Components doesn't require `ext-intl`: without it `CalendarModel` takes the week start from a CLDR region table (the one `@internationalized/date` falls back to) plus likely regions for bare languages, and names stay English. Impossible seconds or offsets skip the event in both stacks. A timed event ending at 00:00 is placed through the previous day, but its full date text names the actual end day. "+N more" moves focus to the day it opens in every stack. The Livewire calendar steps previous and next on the server (`goToPreviousPeriod`, `goToNextPeriod`), and `loadEventModal` carries the calendar's id so a default details child ignores other calendars.

## D-049: Markdown renders the same HTML in every stack

**Decision.**

- Livewire renders with `league/commonmark` (GFM, `html_input: escape`, `allow_unsafe_links: false`). React and Vue use `renderMarkdown` in `behavior/src/data/markdown.ts`, which tokenizes with `marked` and serializes commonmark's exact output; shared vectors check every case with `sanitize` on and off. Named character references outside a short table stay as written in React and Vue (same rendering, different bytes).
- Both stacks make the same four changes to commonmark's HTML: task items are `<li data-part="task"><label><input disabled type="checkbox"> text</label></li>`; table alignment is `data-align` (`start` · `center` · `end`); a link or image whose URL fails SafeUrl is dropped and its text kept; and `sanitize={false}` passes raw HTML through a tag-level allowlist (formatting, lists, tables, `details`, links and images, with `title`, `lang` and `dir` and SafeUrl-checked `href`/`src`). Other tags are escaped as text. There is no opt-in to unsafe HTML.
- The root is `.apui-markdown` with `data-mode` (D-002's one-root-class rule); `.apui-prose` carries the shared prose styles. `mode` `write` and `split` put Tabs over a Textarea; the edit event is `source-change` (Vue also `update:source`). Livewire renders every panel on the server and disables the hidden Textarea, and its `source` defaults to the `wire:model` value. EasyMDE and the Markdown image upload are removed; Livewire's default is now render-only.

**Why.** Prose that looks the same in every stack needs the same HTML. Escaping instead of sanitizing a DOM keeps the PHP and TypeScript paths identical and needs no DOMPurify.

**Addendum (review).** Both stacks cap block nesting at 100 (commonmark depth: a block quote is one level, a list two) and emphasis delimiter runs per inline container at 500; TS mirrors commonmark through a guarded marked Lexer/Tokenizer, byte for byte on the shared vectors at and past the limits. Raw-HTML `<img>` takes the same `data:` allowlist as Markdown images (PNG, GIF, JPEG, WebP). In Livewire, native control attributes go to the editor's Textarea, one named control posts from every tab, and a plain form (no `wire:model`) renders the draft in the browser with `renderMarkdown` through `apuiMarkdown`, the same HTML the server writes. That adds about 18 KB gzip to `alpine.global.js`. With `wire:model`, switching tabs flushes a debounced value before committing.

## D-050: Code, Clipboard and Kbd

**Decision.**

- **Clipboard** is `.apui-clipboard[data-variant]` (`button` · `icon` · `field`, default `button`) instead of the spec's `.apui-copy` and `.apui-copy-field`, per D-002. Parts: `button`, `field`, `value` and `tooltip` (a `role="status"` region, visible under the icon variant). It takes `value`, `timeout` (2000), `size` (`xs` · `sm` · `md`), `label`, `copiedLabel`, `copiedMessage` and `errorMessage`, and fires `copy` and `error`. Clipboard now ships in Livewire too.
- One copy helper (`createClipboard`, `writeClipboard` with an `execCommand` fallback) serves every stack and Code's copy button. Each copy resets to idle first, so a repeat is announced again; failures are announced, never silent.
- **Code** has no syntax highlighting. The `pre` is a focusable `role="region"` named by `label`, then the file name, then the language, then "Code", and stays LTR (D-004). `highlight` lines carry `data-highlight` on the `line` part; a hidden `status` part announces the copy. Props add `code`, `inline` and `copyable` (default true). Livewire's 2.x Ace editor is gone: editing is CodeEditor's job.
- **Kbd** renders `kbd.apui-kbd` keys; a shortcut is an outer `kbd.apui-kbd-combo` that keeps its order in RTL. Symbols are hidden from screen readers and followed by a translatable name. `platform` is `auto` · `mac` · `other`; `auto` renders the non-Apple keys on the server and swaps in ⌘, ⌥ and ⇧ after mount. Kbd now ships in React and Vue.

**Why.** A visible "Copied" plus a live region covers sighted and screen-reader users, and one helper keeps the timing identical. Code's spec has no token colors for syntax, and rendering the server's keys first avoids a hydration mismatch.

**Addendum (review).** Clipboard's success event is `copied` (React `onCopied`), apart from the native `copy` event a manual copy fires. React keeps `onCopy` and Vue still emits `copy` as deprecated aliases; neither can catch native copies. Livewire dispatches only `copied`. A new value clears a stale "Copied", even from a copy still in flight. After a failed copy, the button and icon variants show the `field` and `value` parts beside the button with the value selected, so it can be copied by hand. Code copies the exact source (a final newline and `\r` included), and its line parts are separated by newlines so the `pre` text reads line by line, with a column flexbox so they add no blank lines.

## D-051: Icon and the directional icon list

**Decision.**

- Icon is `span.apui-icon` around the registry's `svg` (D-017) or the author's own `<svg>`. `variant` is `plain` or `tile`; a tile is the root with `.apui-icon-tile`. Sizes are `sm` 14, `md` 16, `lg` 20 and `xl` 24px; tiles are 32, 40, 48 and 56px. `color` sets a plain icon's text tone or a tile's soft fill; the tile gets the high-contrast soft edge (D-035).
- `label` makes the icon `role="img"` with `aria-label`; without it the icon is `aria-hidden`. Livewire's 2.x `label` was visible text beside the icon; it's now the accessible name.
- Directional icons are a list in the registry (`DIRECTIONAL_ICONS` in `behavior`, `IconRegistry::DIRECTIONAL` in Livewire): `arrow-left`, `arrow-right`, `chevron-left` and `chevron-right`. Apps extend it with `registerDirectionalIcons` or `IconRegistry::registerDirectional`, every component's `data-mirror` follows it, and `mirror` overrides it per icon.

**Why.** One list decides mirroring for every component in every stack, so a chevron can't flip in one stack and not another.

**Addendum (review).** A caller's `aria-label` or `aria-labelledby` names an Icon as `label` does (`role="img"`, not hidden); `label` wins. Livewire passes `classes.svg` to blade-icons fallbacks too.

## D-052: Swap is a token-driven primitive in every stack

**Decision.** Swap has no design spec and ships in all three stacks as a minimal primitive, as D-032 did for Grid and Stack. `label.apui-swap` wraps a native checkbox (`control`) over `on` and `off` parts, and CSS swaps them on `:checked`, so `wire:model` needs no script. Checked state follows D-018 (`wire:model`, `v-model:checked`, `checked` with `onCheckedChange`). `label` is the required accessible name; `onIcon` (default `sun`), `offIcon` (`moon`), `transition` (`fade` · `rotate` · `none`, none under reduced motion), `size` (`sm` · `md` · `lg`, the control heights) and `disabled` complete it. Livewire's `true`/`false` slots and `true-icon`/`false-icon` remain as aliases.

**Why.** Swap was Livewire-only and DaisyUI-based; a native checkbox gives it keyboard and screen-reader support for free.

## D-053: Carousel runs on the D-041 carousel widget

**Decision.**

- Carousel reuses `carouselDefinition` rescoped to `carousel`. Spec parts map to Zag's: track is `itemGroup`, slide `item`, nav `prevTrigger` and `nextTrigger`, dots `indicatorGroup` and `indicator`, plus `autoplayTrigger`; `header` and `title` stay.
- `perView` becomes the machine's `slidesPerPage` plus a 0.15 peek above one, with `slidesPerMove: 1` and 12px spacing. Positions are count − perView + 1, rendered the same by the server and every stack; dots hide with one position.
- With a `title`, the header holds the heading (`headingLevel`, default 3) and the buttons; without one, the buttons overlay the viewport. Slides default to a Card built from `image`, `alt`, `title`, `description` and `href`; a scoped `slide` slot (Livewire `@scope('slide', $slide)`, Vue `#slide`, React `renderSlide`) replaces it.
- `interval` defaults to 5000ms and Carousel wraps only with `loop`. Autoplay starts paused under reduced motion; the shared adapters do this, so ImageSlider does too.
- `carouselMachine` seeds Zag's pre-measure snap points with `carouselPageCount`, so server-rendered dots and the next button agree with the mounted carousel.

**Why.** D-041 built the widget for exactly this reuse, and one machine keeps the slider and the carousel's keyboard and announcements identical.

**Addendum (review).** The autoplay button is the root's first child, first in the Tab order, and sits over the viewport through its grid row. A caller's `aria-label` is kept. When every slide has a distinct `id`, it keys the slides in every stack, else their index. Livewire's root `wire:key` carries the slide count and a hash of the options, so a morph that changes them remounts the carousel.

## D-054: Theme choice lives in `behavior` and applies before first paint

**Decision.**

- `behavior/src/theme.ts` owns the choice: `light` · `dark` · `high-contrast` · `system` (default). A choice sets `data-theme` on `<html>`, persists under localStorage `apui-theme` (guarded), and is broadcast to other toggles and tabs. `system` follows `prefers-color-scheme` live; it doesn't map `prefers-contrast`.
- The blocking head snippet is `themeScript()`, shipped byte for byte as Livewire's `@apuiThemeScript` (with the Vite CSP nonce) and React and Vue `<ThemeScript>`. Toggles apply a theme on a pick and, for `system`, on an OS change. On mount they leave it to the head script, except a Livewire toggle bound with `wire:model` (the server's value, such as a profile setting), which applies and stores that value once when it differs from the stored choice. A plain `value` never changes the page, so docs pages can show toggles with fixed values; a React or Vue parent that controls the value calls `applyTheme` itself.
- ThemeToggle variants: `segmented` (default) is `.apui-theme-toggle.apui-tabs` with a `role="radiogroup"`; `menu` composes DropdownMenu with radio items, "Match system" last; `icon` switches light and dark (high contrast goes to dark). Segmented and menu offer all four choices; `choices` narrows them.
- The 2.x `mary-theme` storage keys, the `<html>` class, the `theme-changed` events and the `mary-toggle-theme` window event are removed; the change event is `value-change`. React's `modes` becomes `choices`.
- Where an inline script can't run, as with React's client-rendered `<ThemeScript>`, the stack applies the stored choice once on mount, and only while `<html>` has no `data-theme`, so it never overrides the head script; SPAs that want no flash inline `themeScript()` in `index.html`. A Livewire toggle bound with `wire:model` also applies a value the server sets later. Under a 2.x `ThemeProvider` (React) or `provideTheme` (Vue) the toggle still drives the provider; high contrast reaches it as `light`.

**Why.** A theme applied after paint flashes. One script and one storage key keep every stack, tab and toggle in agreement.

**Addendum (review).**
- *Controlled toggles.* A toggle whose value its parent owns (React `value`, Vue `modelValue`, Livewire `wire:model`) only reports a pick. It applies, stores and passes a choice to a 2.x provider when the bound value changes to it after mount, so a parent that rejects a pick leaves the page alone. This replaces "a React or Vue parent that controls the value calls `applyTheme` itself". The value a toggle mounts with is still never applied in React or Vue, and neither is a plain Livewire `value`; `wire:model` keeps its apply-once-on-mount-when-different.
- *Default handoff.* The head snippet records the choice behind `data-theme` as `data-theme-choice` on `<html>`, and `applyTheme` keeps it current. An uncontrolled toggle with nothing stored (and no 2.x provider) starts on that recorded choice, else its own default, which it applies only while `<html>` has no `data-theme`.
- *Other tabs.* Only toggles that read storage (uncontrolled and persisting) follow a choice another tab stores, and the page follows through them. Controlled, bound and `persist: false` toggles ignore storage events.

## D-055: ThemePreview is a Blade card picker

**Decision.** ThemePreview stays Livewire-only (D-003) but is now a Blade component, `<x-artisanpack-theme-preview>`: `.apui-theme-card` native radios (with `wire:model` on each input, so it needs no Alpine) whose miniatures carry `data-theme` and `data-preset` and render with the real tokens; a System card shows light and dark halves. It takes `options` (`{value, label, theme?, preset?}`) and `value`. The 2.x `<livewire:theme-preview>` theme builder and its `/artisanpack/theme-preview` route are removed. This replaces D-003's description of ThemePreview as a theming dev tool. Where a theme builder lives in 3.x (artisanpackui.dev, the docs site's builder in #30, or the package) is open in ArtisanPack-UI/livewire-ui-components#142.

**Why.** The spec defines ThemePreview as selectable cards. Miniatures drawn from tokens stay correct after a rebrand, where screenshots would go stale.

## D-056: Upgrade rules are generated, and every stack applies the same ones

**Decision.**

- `@artisanpack-ui/codemods` (`packages/codemods`) holds the migration tooling: the upgrade rules, the React and Vue codemods (`npx @artisanpack-ui/codemods react|vue`) and the generator for the upgrade guides in `docs/upgrade/`.
- **The rules are a diff, not a hand-written list.** "Before" is the Phase 0 catalogue of each stack's 2.x API (`contributing/inventory/data/api-<stack>.json`), "after" is the manifest. `component-map.json` and `api-aliases.json` pair the names; `rules/curated.json` adds what names can't say (a value to write, an attribute to add, a note). The build rejects a rule whose target prop or value the manifest doesn't have, and turns a 2.x member with no rule and no place in the manifest into a `manual` rule.
- **One rule set, three appliers.** `generated/upgrade-rules.json` covers all stacks. The Livewire half ships as `generated/upgrade-rules.php`, which Livewire UI Components copies with its asset build; `php artisan artisanpack:upgrade-ui` lives there (#67) and applies the rules with a PHP twin of `planAttribute()`. The guides' tables are generated from the same file.
- **Automatic only when the tool can decide.** Rule kinds are `rename`, `value`, `split`, `invert`, `part-class`, `remove`, `manual`, and for Blade `wrap` (tooltip attributes become a wrapping Tooltip, D-029) and `content` (`label` becomes the default slot). A removed flag is deleted; a removed attribute that carried a value is left and reported. Button `variant` is a `split`: a literal color moves to `color`, a literal variant stays, anything dynamic is reported. Renamed events are rewritten and marked for review, because their payloads changed.
- **Raw DaisyUI classes are reported, never rewritten**, with file, line and column, from the Phase 0 scanner's lists. `bg-primary` and the other semantic utilities aren't reported: the Tailwind preset keeps them (D-011).
- **Tags the rules don't name are left alone**, so `<x-artisanpack-ec-*>` and other package-owned tags are safe. React and Vue only touch what a file imports from the package; Vue's `--global` opts unimported tags in.
- **The codemods edit by offset** (TypeScript's parser and `@vue/compiler-sfc`, written through `magic-string`), not by reprinting an AST, so formatting and comments survive. They are jscodeshift-style in use, without the jscodeshift dependency, which can't parse Vue templates.
- Vue binds the manifest's `value` as `modelValue`, so a Vue rule that targets `value` writes `modelValue`.
- Child components the manifests don't describe (`menu-item`, `tab`, `step`, `timeline-item`) keep their names; their rules aren't checked against the parent's manifest. Livewire UI Components checks every Livewire rule against its registered tags and constructor arguments instead.

**Why.** The Phase 0 scan found about 530 usages a codemod can rewrite and 4,000 class and theme references it can't. Generating the rules from the manifest keeps the tools, the guides and the components in agreement, and the manifest check stops a rule from writing an API that doesn't exist. Reporting what can't be decided is safer than a rewrite that looks right and isn't.
