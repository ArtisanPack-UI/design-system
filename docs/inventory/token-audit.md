# Token and theming audit

Issue #6. Inventory of existing token and theming code, for absorption into the DTCG tokens. The row-level mapping is in [`data/token-map.json`](data/token-map.json); this report covers the totals and the findings.

Sources audited at `livewire-ui-components` 84e8172, `react` 5b764e8, and `liquid-glass` 09dbb4f. All three working trees were clean.

## Summary

- **The primitive scales are not forked.** Livewire and `@artisanpack-ui/tokens` share 168 token names, and 165 have identical values. Type, space, radius, shadow, and duration can be lifted as they are, with the prefix change.
- **Semantic colour is where the real conflicts are.** Foreground defaults disagree across stacks, and Livewire alone holds four disagreeing definitions of the semantic colours.
- **No component reads the token files.** Blade views and component classes contain no `var()` reference to any `design-tokens.css`, `glass-tokens.css`, or `--hc-*` token. Drops are cheap inside the package. Tailwind utilities can read a few of them indirectly, but only if an app publishes the file.
- **High-contrast theming is hollow.** `--hc-*` is a parallel namespace that no component reads. Its only readers are helper rules the class generates itself: the opt-in focus ring, the skip link, and `.text-larger`. It is still the best source for the semantic structure: it alone has muted text, surfaces, hover/active, disabled, focus ring, and target size.
- **Nothing is in DTCG format today.** Every value exists as hand-kept copies: CSS, PHP arrays, and TypeScript.

## How to read the numbers

- **Token:** one distinct name in one source file. Light, dark, and preset values of the same name count once. A TS export with its own identifier, such as `shadowsDark.sm`, counts separately.
- **Class:** a utility class defined in a token stylesheet, such as `.glass-tint-blue-500`. Classes are counted apart from tokens, but they appear in `tokens[]`.
- **keep:** only the `--ap-` prefix is added.
- **rename:** any other name change. Where the meaning changes too, the row's `reason` says so.
- **drop:** `target` is `null`, and the concept goes or is replaced by something else.

**Values are provisional.** Phase 1 has not happened, so every keep and rename decides structure and name only. No value in this audit is a recommendation.

The totals come from a script, and it fails unless the `count` fields sum to the extracted total. The map has 297 rows covering 1,552 entries. Families use a `*` pattern with `count`, and rows with up to 40 entries also list `members`.

## Totals

| Tier | Keep | Rename | Drop | Total |
|---|---:|---:|---:|---:|
| Primitive | 268 | 384 | 21 | 673 |
| Semantic | 28 | 239 | 132 | 399 |
| Component | 0 | 61 | 92 | 153 |
| **Tokens, all occurrences** | **296** | **684** | **245** | **1,225** |
| Utility classes | 0 | 5 | 322 | 327 |
| **Entries in the map** | **296** | **689** | **567** | **1,552** |

Most of those are copies of the same token, so the deduplicated figures are the real migration size:

| Tier | Keep | Rename | Drop | Total |
|---|---:|---:|---:|---:|
| Primitive | 67 | 279 | 21 | 367 |
| Semantic | 11 | 130 | 47 | 188 |
| Component | 0 | 32 | 63 | 95 |
| **Distinct existing tokens** | **78** | **441** | **131** | **650** |

Those 650 tokens land on **502 distinct `--ap-*` targets**: 346 primitive, 122 semantic, and 34 component. Of the primitives, 242 are the colour ramp.

## Per-source summary

Paths are relative to the packages directory. `lw/` is `livewire-ui-components/` and `rx/` is `react/packages/tokens/src/`. "Raw" is the number of CSS declarations before deduplication.

| Source | Tokens | Classes | Keep | Rename | Drop | Raw |
|---|---:|---:|---:|---:|---:|---:|
| `lw/resources/css/design-tokens.css` | 140 | 32 | 67 | 55 | 50 | 308 |
| `lw/resources/css/glass-tokens.css` | 24 | 274 | 0 | 13 | 285 | 491 |
| `lw/resources/css/datepicker-base.css` | 22 | 0 | 0 | 12 | 10 | 22 |
| `lw/resources/css/datepicker-light-mode.css` | 12 | 0 | 0 | 6 | 6 | 44 |
| `lw/resources/css/datepicker-dark-mode.css` | 12 | 0 | 0 | 6 | 6 | 44 |
| `lw/resources/css/datepicker-theme.css` | 15 | 0 | 0 | 4 | 11 | 19 |
| `lw/src/Styling/ColorGenerator.php` | 503 | 0 | 75 | 345 | 83 | n/a |
| `lw/src/Styling/GlassPresets.php` | 23 | 0 | 0 | 13 | 10 | n/a |
| `lw/src/Styling/HighContrastTheme.php` | 57 | 0 | 3 | 43 | 11 | n/a |
| `lw/src/Support/ChartThemes.php` | 36 | 0 | 0 | 23 | 13 | n/a |
| `lw/src/Support/GlassHelper.php` | 1 | 0 | 0 | 1 | 0 | n/a |
| `lw/src/Console/Commands/GenerateThemeCss.php` | 2 | 0 | 0 | 2 | 0 | n/a |
| `lw/src/View/Components/DatePicker.php` | 4 | 0 | 0 | 0 | 4 | n/a |
| `lw/src/View/Components/ThemePreview.php` | 8 | 0 | 0 | 2 | 6 | n/a |
| `rx/css/tokens.css` | 162 | 21 | 75 | 66 | 42 | 210 |
| `rx/colors.ts` | 26 | 0 | 9 | 17 | 0 | n/a |
| `rx/typography.ts` | 41 | 0 | 34 | 7 | 0 | n/a |
| `rx/spacing.ts` | 42 | 0 | 0 | 42 | 0 | n/a |
| `rx/shadows.ts` | 24 | 0 | 8 | 8 | 8 | n/a |
| `rx/borders.ts` | 13 | 0 | 9 | 4 | 0 | n/a |
| `rx/animation.ts` | 25 | 0 | 16 | 2 | 7 | n/a |
| `rx/glass.ts` | 27 | 0 | 0 | 15 | 12 | n/a |
| `liquid-glass/resources/css/liquid-glass.css` | 3 | 0 | 0 | 3 | 0 | 7 |
| `liquid-glass/config/liquid-glass.php` | 3 | 0 | 0 | 0 | 3 | n/a |

Notes on individual sources:

- **`design-tokens.css`** has type, space, radius, shadow, motion, and glass, but no colour. It repeats nearly everything in `@theme`, `:root`, and `[data-theme="dark"]`. Its glass blocks duplicate `glass-tokens.css` exactly.
- **`glass-tokens.css`** is mostly classes. 242 of them are `.glass-tint-{hue}-{stop}`, which are the only place the colour ramp exists in CSS.
- **`ColorGenerator`** is the largest source because it holds the 242-entry palette, the 33 generated `--p/s/a-*` shades, and a copy of every design token.
- **`GenerateThemeCss`** uses no stubs. All CSS is built from PHP strings, in `ColorGenerator` and the command itself.
- **`liquid-glass`** defines three block-level variables and is not a token system.

## Overlap and conflicts

### Same concept, same value

The 165 identical tokens cover font families, sizes, weights, line heights, letter spacing, the spacing scale, radius, the shadow scale, colored and glow shadows, durations, easings, and glass base values. `rx/css/tokens.css` and `design-tokens.css` have the same value for every name they share, in both `:root` and dark.

The names also match, apart from TS keys (`inOut`, `0.5`) that the build must map. This means there is no scale to choose between.

`GlassPresets` arrays and the `glass-tokens.css` preset classes also match on all 23 tokens of all six presets. So do the 242 `.glass-tint-*` classes and `tailwindColorToHex`.

### 1. Foreground colours disagree, and most fail AA

`--color-primary-content` and `--color-accent-content` are `#000000` in React and `#ffffff` in `ColorGenerator`.

| Colour | Value | White | Black | Default foreground |
|---|---|---:|---:|---|
| primary | `#3b82f6` | 3.68 | 5.71 | React black, Livewire white |
| accent | `#f59e0b` | 2.15 | 9.78 | React black, Livewire white |
| secondary | `#64748b` | 4.76 | 4.41 | white |
| neutral | `#737373` | 4.74 | 4.43 | white |
| info | `#0ea5e9` | 2.77 | 7.58 | white |
| success | `#22c55e` | 2.28 | 9.22 | white |
| warning | `#f97316` | 2.80 | 7.49 | white |
| error | `#ef4444` | 3.76 | 5.58 | white |

Bold or large text aside, Livewire defaults fail 4.5:1 on six of eight colours, and React on four. `generateThemeCss` recomputes the foreground for primary, secondary, and accent only. Foundations should treat foreground pairs as a tested contract, not as values to carry over.

### 2. Livewire has four definitions of the semantic colours

| Colour | `--color-*` | `getVariantBaseColor` and datepicker `data-color` | `addVariantHoverFocusStates` base |
|---|---|---|---|
| primary | `#3b82f6` | `#3b82f6` | blue-500 |
| secondary | `#64748b` slate | `#6b7280` gray | slate-500 |
| accent | `#f59e0b` amber | `#06b6d4` cyan | amber-500 |
| neutral | `#737373` | `#737373`, no `data-color` rule | gray-500 |
| success | `#22c55e` green | `#10b981` emerald | green-500 |
| warning | `#f97316` orange | `#f59e0b` amber | orange-500 |
| error | `#ef4444` | `#ef4444` | red-500 |
| info | `#0ea5e9` | `#0ea5e9`, no `data-color` rule | sky-500 |

So `color="accent"` is amber on a Button and cyan on a DatePicker. The hover map is hard-coded, so a re-themed primary still hovers to blue-600. `ChartThemes` is a fifth, independent list of hex values.

### 3. The default primary depends on how you got your theme

Token defaults use blue-500. `artisanpack:generate-theme` defaults to `--primary=sky`, which is `#0ea5e9`. Running the command with no options therefore makes primary identical to info.

### 4. Two glass models that do not meet

| | Livewire | React and Vue |
|---|---|---|
| Prop | `glass="frosted\|liquid\|transparent"`, `glassTint`, `glassTintOpacity` | `glass` boolean; `GlassProps` also declares `glassPreset` |
| Class emitted | `.glass-frosted` and siblings, never bare `.glass` | The literal string `glass` |
| Named presets | Six, in `GlassPresets` | None |
| Tint | Semantic, 22 hues × 11 stops, or hex | Seven semantic classes in CSS, not reachable from a component prop |

The same "glass card" is therefore a different recipe in each stack. Related problems:

- **Unused helpers.** `glassStyles` and `glassClassName` have 0 consumers in React and Vue.
- **Name collision.** daisyUI 5 ships its own `.glass` utility, so bare `.glass` in React and Vue has two definitions and the result depends on load order.
- **Dark liquid glow.** `--glass-liquid-border-glow-color` multiplies by 0.7 in generated CSS (`calc(… * 0.7)`) but not in static CSS or React. The result is 0.28 against 0.4.
- **Inline frosted.** `glassStyles({ preset: 'frosted' })` omits the border and shadow that `.glass-frosted` applies.
- **Dead token.** `--glass-liquid-refraction` is declared in every source and read by nothing.
- **Neutral.** No semantic neutral tint exists, though the plan's colour list includes neutral.

### 5. Dark mode has three selectors

Tokens use `[data-theme="dark"]`. The datepicker uses `.dark` plus `prefers-color-scheme`. `HighContrastTheme` uses both `[data-theme="dark"]` and `.dark`. The datepicker also uses `data-theme="artisanpack"` on the calendar element for an unrelated meaning. The theme presets need one selector rule.

### 6. Dark mode reassigns primitives

`--shadow-*` values change in place under `[data-theme="dark"]`. The plan says presets reassign semantic tokens only, so this structure cannot carry over. The map introduces `--ap-elevation-*` as the assigned layer and keeps `--ap-shadow-*` fixed.

`--hc-text-*` and `--hc-line-height-*` have the same problem. The map replaces them with `--ap-font-scale` and `--ap-type-line-height*`.

### 7. Tailwind namespace collisions

Compared with `theme.css` in Tailwind 4.1.11:

- `--radius-sm` is 0.125rem here and 0.25rem in Tailwind. Tailwind's 0.125rem step is `--radius-xs`.
- `--shadow-sm` here equals Tailwind's `--shadow-xs`, and `--shadow-base` here equals Tailwind's `--shadow-sm`.
- So publishing `design-tokens.css` with its `@theme` block shifts `rounded-sm` and `shadow-sm` by one step in that app.
- `--font-size-*`, `--line-height-*`, `--letter-spacing-*`, `--font-family-*`, and `--duration-*` have no counterpart in that file, which uses `--text-*`, `--leading-*`, `--tracking-*`, and `--font-*`. Their `@theme` entries are likely inert as Tailwind configuration, despite the file's comment. I did not test this by compiling.
- `tailwind-plugin.ts` exposes `shadow-color-primary`, while `@theme` would expose `shadow-primary`.

The `--ap-*` prefix removes the collision. The optional Tailwind preset must map tokens explicitly and not assume step names line up.

### 8. Smaller conflicts

- **`--transition-all`** is `all var(--duration-200) var(--ease-in-out)` in CSS and PHP but `all` in TS. The rest of that family are property lists, so the family has mixed types. `rx/css/tokens.css` has no `--transition-*` at all.
- **`--color-*` lives in different places.** It is in `rx/css/tokens.css` but only in generated output on the Livewire side.
- **Typography presets are React-only and off-scale.** `h1` is 2.75rem, between `4xl` and `5xl`. `body` is 1.0625rem where `--font-size-base` is 1rem. 0 consumers.
- **`violet` is half-supported.** `$tailwindColorBases` omits it, so `color="violet-500"` is rejected, but `.glass-tint-violet-500` and the chart palette use it.
- **Size scale.** React `Size` stops at `lg`. Livewire Button accepts `xl` and aliases it to `btn-lg`.
- **Colored and glow shadows** use literal RGB, so they do not follow the theme, and Blade views do not use them.
- **`--liquid-glass-*`.** The "liquid" package uses blur 12px, matching `--glass-blur` and not `--glass-liquid-blur` (24px), and hard-codes the frosted 180% saturation. Its tint is a bare `r, g, b` triple.
- **daisyUI versions.** Seven of the nine utility variables (`--rounded-*`, `--animation-*`, `--btn-focus-scale`, `--border-btn`) appear nowhere in daisyUI 5.0.48. `$daisyUiComponentDefaults` uses the daisyUI 4 channels `--b2`, `--bc`, `--p`, and `--pc`, and it is only ever emitted inside a CSS comment.
- **High-contrast claims.** `enhancedContrastDark` gives error 3.62:1 against its foreground. Three of four presets have disabled pairs below 4.5:1, though disabled text is exempt under WCAG. The AAA presets did clear 7:1 on their foreground pairs.

## Gaps

These are things the plan needs that nothing provides. Names are from the plan where it gives one, and all values remain open.

| Need | What exists today | Foundations work |
|---|---|---|
| `--ap-density` and three modes | Nothing | New. The map routes `spacingAliases` to `--ap-gap-*` as the layer density would scale, name provisional |
| Control size scale, xs to xl | Nothing. `--size` exists only in commented output | New. `--ap-input-height`, `--ap-button-padding-x`, and the like come from specs |
| Colour primitives as tokens | PHP lookup and `.glass-tint-*` classes only | Move into DTCG as `--ap-{hue}-{stop}` |
| Focus ring | `--hc-focus-ring-*` and `--focus-ring-*`, high-contrast scope only | Global `--ap-focus-ring-*`. Datepicker hard-codes 2px |
| `--ap-surface-raised`, `--ap-text-muted`, `--ap-border-muted` | `--hc-*` only | New for the default theme |
| Hover and active colours | `--hc-*` for primary, secondary, accent only. Elsewhere computed in PHP | New for all eight colours |
| Dark primary, secondary, accent | None. Both stacks use the light value | New |
| Dark neutral and base values | Yes, but inherited from daisyUI | Replace in Phase 1 |
| Semantic motion | `.transition-fast/smooth/slow/spring/bounce` classes | Map to DTCG transition composites |
| Border width | `--glass-border-width`, plus daisyUI `--border` used 44 times in Blade | New `--ap-border-width`. Those 44 sites break when daisyUI goes |
| z-index | None. Views use `z-10`, `z-20`, `z-50`, `z-[1]`, `z-[2]`, `z-[999]` | New scale |
| Disabled state | `--hc-disabled-*` only | Globalise |
| Target size | `--hc-min-*` only | Globalise |
| Breakpoints | Datepicker literals at 640 and 1024px | Decide whether these are tokens. DTCG has no breakpoint type |
| Opacity scale | None as a family | Decide |
| Overlay and backdrop colour | None in token sources | New |
| Text on glass | `GlassHelper::getAccessibleTextColor`, tint-based and static | See open questions |

## Theming code

`code[]` has 44 rows: 3 keep, 25 rewrite, 16 drop. Every method in the six PHP classes and every `@artisanpack-ui/tokens` export is covered.

**DaisyUI-coupled, dropped:** `$daisyUi*` arrays, `daisyRadius`, `daisyAnimation`, and the class-returning half of `ColorGenerator`. `resolveComponentColor` and its helpers go, and the 7 calling components (Alert, Avatar, Badge, Button, DatePicker, Profile, Toast) move to data attributes. There is no shim, per the plan's non-goals. The renamed `--rounded-*` entries absorb the concept into new semantic tokens; they do not alias the old variable.

**Replaced by the token build:** `generateDesignTokensCss`, `generateGlassTokensCss`, the `get*TokenDefaults` getters, `css/tokens.css`, all hand-written TS token objects, and the per-file command modes.

**Rewritten:**
- `generateThemeCss`, `generateTailwindShades`, and the `artisanpack:generate-theme` command become the token-based generator. `generateTailwindShades` must stop calling `tailwind.simeongriggs.dev`, because on failure it silently writes the base hex to all 11 stops.
- `GlassPresets` and `HighContrastTheme` become semantic-only presets.
- `ChartThemes` reads tokens. ApexCharts needs resolved values, so it cannot use `var()`.
- `GlassHelper` falls away apart from accessible text on glass. It is imported by 17 view components.
- `resolveColor` remains for canvas cases, reading `--ap-color-*`.

**Kept:** contrast utilities (`calculateContrastRatio`, `verifyContrast`) as a token CI gate, the `ChartThemes` theme API, and the `liquid-glass` block API.

**Worth noting for tokens package scope:** `cn` has 113 imports and pulls `tailwind-merge` into a package that should be Tailwind-free, so it should move out. Of everything the package exports, React and Vue import only `cn`, `DaisyColor`, `Size`, `FormFieldProps`, `GlassProps`, `ColorProps`, and `resolveColor`. The package's public surface is far larger than its real use.

## Open questions for Foundations

1. **Surface mapping.** The map sends `base-100` to `--ap-surface-default`, `base-200` to `--ap-surface-sunken`, and `base-300` to `--ap-border-default`. `base-300` has two real roles: 21 border uses and 22 background uses. The `--hc-*` model instead has background, surface, elevated, and sunken, and `--ap-surface-page` is not in the plan's surface list. Do we add it?
2. **Glass count.** The plan has one `surface="glass"`, so the map flattens frosted, liquid, and transparent into one `--ap-surface-glass-*` set using the base recipe. Which recipe is the default, and do the others survive as presets? This depends on Phase 1.
3. **Glass as surface and as preset.** The plan lists glass under both. Does the `glass` preset assign `--ap-surface-glass-*`, or restyle the whole theme?
4. **Glass tint and text.** How does `surface="glass"` combine with `color`? Contrast on a translucent surface can't be proved statically, since it depends on the backdrop.
5. **Arbitrary colours.** The plan's `color` takes eight names, but `color="red-500"` and hex work today in seven components. Dropping them needs a codemod entry or a report line. The downstream count is not in this audit.
6. **Ramp contents.** The map keeps all 22 hues. Five are grays. Phase 1 will probably need far fewer, and the same goes for the top of the spacing scale, which only mirrors Tailwind.
7. **Accessibility presets.** The plan names one high-contrast preset. Today there are four contrast presets, plus reduced-motion and two larger-text sets. Which survive? Reduced motion needs a form without `!important`.
8. **Namespace reservations.** `--ap-text-*` is colour in the plan, so type tokens need another name. The map uses `--ap-type-*` and `--ap-font-scale`. `--ap-gap-*` is also new. Please confirm these.
9. **Elevation levels.** Do `--ap-elevation-*` keep all eight primitive steps, or a smaller named set?
10. **Theme selector.** One attribute, and does `prefers-color-scheme` apply automatically?
11. **Contrast helper home.** Tokens build or `artisanpack-ui/accessibility`?
12. **Datepicker tokens.** `--ap-datepicker-*` names assume the DatePicker keeps today's parts. flatpickr's future depends on Phase 3.
13. **`liquid-glass`.** Should it read `--ap-surface-glass-*`? It has no dependency on the UI packages today.

## Not determined

- **Downstream use.** I checked `livewire-ui-components` only. An app or package could use `.glass-*`, `--hc-*`, `shadow-primary`, or the published files directly. "No consumer" in the map means none in that package's `resources/views` and `src/View`.
- **daisyUI 4 checks** ran against the dev app's installed 5.0.48. React declares `^5.0.43` and Vue `^5.5.19`, and I did not test those.
- **Vue** was checked for imports from `@artisanpack-ui/tokens` only, not for any local token CSS.
- **Chart classification** is a judgement. 36 ApexCharts key paths are counted as tokens, and 21 behaviour flags such as toolbar options are excluded.
- **Referenced-only variables.** `var(--color-*)` fallbacks in the glass CSS are not counted as tokens in those files, because the tokens are defined elsewhere.
- **Contrast ratios** come from a WCAG formula in my audit script, not from the package's own helper.
