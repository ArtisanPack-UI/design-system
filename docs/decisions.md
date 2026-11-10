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

