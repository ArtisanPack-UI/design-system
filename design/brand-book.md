# ArtisanPack UI

Considered by default, yours by design.

ArtisanPack UI is the shared design system behind the ArtisanPack UI component packages for **Laravel Livewire, React and Vue**. This system defines what a developer gets before changing anything, plus the token structure that makes changing it easy. It is not a brand for one product. The default should look finished and have a point of view, then step aside when a developer brings their own brand.

**Status:** foundations and all 77 components are designed in Strata + edges, in light, dark and high-contrast, with six example screens (admin dashboard, long form, dense data table in two densities, auth and marketing, a two-brand re-theme, and right-to-left). Names follow the repo's conventions (D-002, #21): the `apui` namespace, `data-scope` / `data-part` parts and `@layer apui.*`. How we got here is in the [direction record](direction.md), which predates the rename and uses the old names.

## Principles

1. **Personality from structure, not color.** Type, spacing, proportion, radius and elevation carry the look, because they survive a rebrand. The default primary is a quiet steel blue, and grays are tinted toward it, so swapping `primary` makes the whole library feel native to the new brand.
2. **Depth through tone, edges for certainty.** Each surface is one tone step from the surface beneath it, and every container carries a hairline (`--apui-border-muted`). A component never knows what it's placed on, and the edge means it always reads. Shadows appear only on things that float.
3. **Round controls, rectangular containers.** Buttons, badges, segmented tabs, toggles and pagination are pills (`--apui-radius-full`). Text entry is gently rounded (`--apui-radius-md`). Containers are `--apui-radius-lg`, overlays `--apui-radius-xl`. Inner radius is outer radius minus padding.
4. **Neutral chrome; color for meaning.** Navigation, panels and labels stay neutral. Color goes to status and category (the `soft` variant) and to one primary action per view.
5. **One loud thing per view.** Emphasis comes by exception: one highlighted row, bar or stat, using the `--apui-color-accent-*` roles. Don't add variants to make something stand out.
6. **Size and contrast make hierarchy, not weight.** Stats are large at weight 500, labels small and `--apui-text-muted`. Nothing goes heavier than 600.
7. **Flexible by construction.** Every visual decision is a token. Only accessibility guardrails and component anatomy are fixed.

## Token architecture

Three tiers. Themes and presets only reassign the semantic and component tiers. No component reads a primitive directly.

| Tier | Examples | Who changes it |
|---|---|---|
| **Primitive** | `--apui-gray-0` … `--apui-gray-1000`, `--apui-steel-50` … `--apui-steel-950`, `slate-*`, `marigold-*`, `green-*`, `orange-*`, `red-*`, `cyan-*`, `--apui-space-1`, `--apui-radius-lg` | Brand work: regenerate a ramp |
| **Semantic** | `--apui-surface-default`, `--apui-text-muted`, `--apui-border-default`, `--apui-focus-ring-color`, `--apui-color-primary`, `--apui-color-error-soft-foreground`, `--apui-panel-padding`, `--apui-row-height` | Themes (light, dark, high-contrast), presets, density |
| **Component** | `--apui-button-radius`, `--apui-input-radius`, `--apui-card-padding`, `--apui-menu-radius`, `--apui-table-head-weight`, `--apui-shell-gutter` | Per-component tweaks |

Tokens ship as CSS custom properties, all prefixed `--apui-` (D-002), so nothing depends on Tailwind and nothing collides with `visual-editor`'s `--ap-*`. A Tailwind preset that maps utilities to these properties is optional (#24).

`tokens.json` in this system is the **visual spec**. The source of truth in code is W3C DTCG JSON in the `design-system` repo, built from these values in #18 and #20. After that lands, changes are proposed as diffs against the DTCG JSON.

**Axes that combine freely:**
- Theme: `data-theme="light | dark | high-contrast"`
- Density: `data-density="compact | default | comfortable"`
- Preset: `data-preset="strata | ledger | harbor"`

Any of the three can be set on `<html>` or on a single region.

## Color

**Surfaces**, from lowest to highest:

| Token | Use |
|---|---|
| `--apui-surface-sunken` | Wells: input fills on canvas, table headers, code, toggle tracks |
| `--apui-surface-page` | Page |
| `--apui-surface-default` | Cards, panels, tables, form sections |
| `--apui-surface-raised` | A container inside a container, a selected segment |
| `--apui-surface-overlay` | Dialog, DropdownMenu, Toast, popovers, always with `--apui-elevation-overlay` |
| `--apui-surface-glass` | Opt-in glass for Card, Dialog, DropdownMenu, Toast, Navbar and Alert (see Glass) |
| `--apui-surface-inverse` | Tooltip, inverse Toast |

**Text:**
- `--apui-text-default` (12:1 or better).
- `--apui-text-muted` for hints, captions and placeholders (4.5:1 or better on every surface, including sunken).
- `--apui-text-subtle`, for non-text icons only (3:1).
- `--apui-text-disabled`.
- `--apui-text-inverse`.
- `--apui-text-muted-glass`.

**Edges:**
- `--apui-border-muted`: the container hairline. Set it to `#00000000` for pure tonal layering.
- `--apui-border-default`: control outlines, 3:1 or better per WCAG 1.4.11.
- `--apui-border-strong`: hover and selected.
- `--apui-surface-glass-border`.

**Color roles.** All eight colors (primary, secondary, accent, neutral, success, warning, error, info) have the same seven roles, so a variant is always a fixed recipe:

| Variant | Fill | Text | Border |
|---|---|---|---|
| solid | `--apui-color-{c}`, hover `--apui-color-{c}-hover` | `--apui-color-{c}-foreground` | none (accent and warning: `--apui-color-{c}-border`) |
| soft | `--apui-color-{c}-soft` | `--apui-color-{c}-soft-foreground` | none (high-contrast: `--apui-color-{c}-border`) |
| outline | transparent, hover `--apui-state-hover` | `--apui-color-{c}-text` | `--apui-color-{c}-border` |
| ghost | transparent, hover `--apui-state-hover` | `--apui-color-{c}-text` | none |
| link | none | `--apui-color-{c}-text`, underlined on hover and focus | none |

Default mapping:
- primary → steel
- secondary → slate
- accent → marigold
- neutral → gray (ink)
- success → green
- warning → orange
- error → red
- info → cyan

Every pair was checked:
- Text roles reach 4.5:1 and edges 3:1 against every surface, in all three themes.
- Light-mode solid accent and warning sit below 3:1 against the canvas, which is why they carry an edge.
- Status is never shown by color alone. Always pair it with a label or an icon.

## Typography

- **Geist** for UI and **Geist Mono** for IDs, SKUs and code. Both are SIL Open Font License, served from Google Fonts or self-hosted.
- Families: `--apui-font-family-sans`, `--apui-font-family-mono`.
- Scale ratio 1.2 from a 14px base.

| Group | Styles |
|---|---|
| Display | `display-xl` 41/46, `display-lg` 34/40, weight 600, −0.02em |
| Heading | `heading-xl` 28/34, `heading-lg` 23/30, `heading-md` 19/26, `heading-sm` 16/24, weight 600 |
| Body | `body-lg` 16/24, `body-md` 14/20 (default), `body-sm` 13/18, `caption` 12/16 |
| Label | `label-md` 14/20, `label-sm` 13/18, `label-xs` 12/16, weight 500. `eyebrow` 11/16 uppercase +0.06em (optional, for dense screens) |
| Numeric | `stat-lg` 34/40, `stat-md` 28/34, `stat-sm` 19/26, weight 500. `num-md` for table figures. Always `tabular-nums` |
| Code | `code-md` 13/20, `code-sm` 12/16 |

Rules:
- Sentence case everywhere except `eyebrow`.
- Numbers in tables align to the inline end.
- Prose and help text stop at `--apui-measure` (68ch).

## Spacing, size and density

- **Spacing:** 4px base, Tailwind-style steps with half steps hyphenated (DTCG forbids `.`), so `--apui-space-4` is 16px: `--apui-space-0-5`, `--apui-space-1`, `--apui-space-1-5`, `--apui-space-2`, `--apui-space-3`, `--apui-space-4`, `--apui-space-5`, `--apui-space-6`, `--apui-space-8`, `--apui-space-10`, `--apui-space-12`, `--apui-space-16`.
- **Control sizes** (independent of density): `--apui-control-height-xs` 24, `--apui-control-height-sm` 28, `--apui-control-height-md` 36, `--apui-control-height-lg` 44, `--apui-control-height-xl` 52. Anything smaller than `--apui-target-size-min` (24px) extends its hit area.
- **Icons:** `--apui-icon-size-sm` 14, `--apui-icon-size-md` 16, `--apui-icon-size-lg` 20.

**Density** is set with `data-density`. `--apui-density` (0.8, 1, 1.2) is the multiplier #22 asks for, and five tokens hold the resolved value per mode:

| Token | compact | default | comfortable |
|---|---|---|---|
| `--apui-panel-padding` | 16 | 20 | 24 |
| `--apui-panel-gap` | 8 | 12 | 16 |
| `--apui-row-height` | 32 | 40 | 48 |
| `--apui-cell-padding-x` | 8 | 12 | 16 |
| `--apui-field-gap` | 12 | 16 | 24 |

To make controls smaller in a dense screen, choose a smaller size. Density never shrinks the controls themselves.

## Radius

| Token | Value | Used by |
|---|---|---|
| `--apui-radius-xs` | 4px | Checkbox, inner chips, keyboard keys |
| `--apui-radius-sm` | 6px | Thumbnails, inner elements |
| `--apui-radius-md` | 10px | Input, Select, Textarea, DatePicker field, menu items |
| `--apui-radius-lg` | 14px | Card, panel, Table wrapper, Alert |
| `--apui-radius-xl` | 16px | Dialog, DropdownMenu, Toast, popovers |
| `--apui-radius-full` | 9999px | Button, Badge, segmented Tabs, Toggle, Avatar, Pagination, filter chips |

Semantic radii carry the rule, so a preset changes one token per role: `--apui-radius-control` (full), `--apui-radius-field` (md), `--apui-radius-surface` (lg) and `--apui-radius-overlay` (xl).

## Elevation

Strata separates surfaces by **tone plus edge**. Shadows mark only what floats:
- `--apui-elevation-overlay`: Dialog, menus, Toast, popovers. High-contrast has no shadow and relies on edges.
- `--apui-elevation-glass`: glass panes.
- `--apui-elevation-raised`: `none` in Strata. The Harbor preset gives it a soft shadow.

## Focus

- The focus ring is drawn with `box-shadow`, so it follows each control's radius: `0 0 0 var(--apui-focus-ring-offset) var(--apui-focus-ring-offset-color), 0 0 0 calc(var(--apui-focus-ring-offset) + var(--apui-focus-ring-width)) var(--apui-focus-ring-color)`.
- That means a 2px ring outside a 2px gap. The gap keeps the ring visible against solid fills and tints.
- Set `--apui-focus-ring-offset-color` to the surface the control sits on.
- Inside tables and grids, the ring is inset (`-2px`) so it doesn't overlap neighboring cells.
- Shown on `:focus-visible` only. It's never removed or restyled below 3:1.
- In Windows forced-colors mode, a transparent `outline` is added so the ring stays visible.

## Glass

Glass is a **surface option, never the default**. Any container component can take `surface="glass"`: Card, Dialog, DropdownMenu, Toast, Navbar and Alert. Recipe:
- Background: `--apui-surface-glass` (80% opacity)
- `backdrop-filter: blur(var(--apui-surface-glass-blur)) saturate(var(--apui-surface-glass-saturation))`
- Border: `--apui-surface-glass-border`
- Shadow: `--apui-elevation-glass`
- Secondary text: `--apui-text-muted-glass`

The 80% opacity floor was checked against black, white, saturated red and saturated blue backdrops. Body text stays above 9:1 and muted text above 4.5:1.

Under `prefers-reduced-transparency`, or without `backdrop-filter` support, glass becomes `--apui-surface-raised`. It is opaque in high-contrast.

Glass is a surface, not a theme. #23's `glass` theme preset is recorded as a surface option instead: a theme would put glass everywhere, which the brief rules out.

Rules: don't stack glass on glass, keep long tables and forms on opaque surfaces, and glass does nothing over a flat canvas, so pair it with a background worth seeing.

## Right-to-left

All spacing, borders and positioning use logical properties (`padding-inline`, `inset-inline-start`, `border-inline-end`, `text-align: start`), so setting `dir="rtl"` mirrors every layout. For Arabic and Hebrew, add a script font to `--apui-font-family-sans`; the RTL example uses Noto Sans Arabic (OFL). Directional icons (chevrons, arrows, the Pagination next and previous buttons) mirror under `dir="rtl"`. Non-directional icons, numbers, media controls and charts' time axes do not mirror.

## Iconography

- **Lucide** (ISC license) at stroke 1.5. Icons that point a direction carry `data-mirror` and flip under `dir="rtl"`.
- Sizes from `--apui-icon-size-sm`, `--apui-icon-size-md` and `--apui-icon-size-lg`. Color: `currentColor` by default.
- Icons that carry meaning have an accessible label. Decorative icons are `aria-hidden`.
- Any open-licensed set with a 24px grid can be swapped in, since components take icons as slots.

## Components

One framework-agnostic stylesheet, `design/css/components.css`, styles the Livewire, React and Vue packages alike. It follows the conventions in #21:

```html
<button class="apui-button" data-variant="soft" data-color="success" data-size="sm">Approve</button>

<div class="apui-field" data-invalid>
  <label data-scope="field" data-part="label">Postal code</label>
  <div class="apui-input"><input data-scope="input" data-part="control"></div>
  <span data-scope="field" data-part="error">Spanish postal codes have 5 digits.</span>
</div>

<section data-theme="dark" data-density="compact" data-preset="ledger">…</section>
```

- **One root class per component** (`.apui-button`, `.apui-card`). Variants and state are data attributes: `data-variant`, `data-color`, `data-size`, `data-surface`, `data-state`, `data-invalid`, `data-disabled`.
- **Parts** carry `data-part`, scoped by `data-scope` so a Card inside a Dialog never picks up the Dialog's `title` rule. This matches Zag's markup, so the behavior engine (#33) can emit the same attributes. Packages also expose parts through `classes` and slots.
- **Layers:** component rules sit in `@layer apui.components`, after `apui.reset` and `apui.tokens`, so app CSS wins without `!important`. Headless mode (#25) is not importing that layer.
- **Colors** flow through one block: `data-color` sets seven private roles (`--apui-tone-solid`, `--apui-tone-soft-foreground` and so on) that every component reads, so a new component gets all eight colors for free. Custom properties named `--apui-_x` are private to a component.
- **States** are native where possible (`:hover`, `:focus-visible`, `:disabled`, `aria-*`). The previews use `.is-hover`, `.is-focus` and `.is-active` to show states statically; those classes are preview-only and don't ship.

| Group | Components |
|---|---|
| Actions | Button, Link, Clipboard |
| Forms | Input, Password, Pin, Select, SelectGroup*, Combobox, Tags*, Textarea, Checkbox, CheckboxGroup, RadioGroup, Toggle, Range, Rating, ColorPicker, DatePicker, DateTime*, File, Signature, Fieldset, ValidationSummary |
| Editors and content | RichTextEditor, CodeEditor, Markdown, Code, Kbd, Diff, Heading, Text, Divider, Icon |
| Data display | Badge, Avatar, Stat, KpiCard*, Sparkline, Table, Chart, Timeline, ListItem, Calendar |
| Feedback | Alert, Toast, Loading, Progress, ProgressRadial*, Skeleton, StreamableContent, EmptyState, ErrorState |
| Overlays | Dialog, Drawer, Popover, Tooltip, DropdownMenu, Spotlight |
| Navigation | Navbar, Menu, UserMenu*, Tabs, Steps, Pagination, Breadcrumbs |
| Disclosure | Accordion, Collapse |
| Layout | Card, AppShell, PageHeader |
| Media | ImageGallery, ImageLibrary, Carousel, ImageSlider* |
| Theme | ThemeToggle, ThemePreview |

\* Composed from other components and documented with what they're built from: Tags from Combobox, SelectGroup from Select, DateTime from DatePicker, ProgressRadial from Progress, KpiCard from Stat, ImageSlider from Carousel, UserMenu from Avatar and DropdownMenu.

Props for each are in `design/types/components.d.ts` and each component's guidelines.

## Charts

`--apui-chart-1` to `--apui-chart-6` are a categorical palette (steel, teal, brick, marigold, plum, green), assigned in that order and never cycled. It passed the dataviz validator for colorblind separation on adjacent pairs: ΔE 28 in light and 12 in dark, with a normal-vision floor of 30 and 16. Light slots 2, 4 and 6 sit under 3:1 against the surface, so every chart ships hover and focus tooltips, direct labels on key points and a table view. Gridlines use `--apui-chart-grid` and axes use `--apui-chart-axis`. A rebrand can point `--apui-chart-1` at its primary.

## Code

Syntax colors are tokens (`--apui-syntax-keyword`, `--apui-syntax-string`, `--apui-syntax-number`, `--apui-syntax-function`, `--apui-syntax-property`, `--apui-syntax-comment`), drawn from the primitive ramps and checked at 4.5:1 or better on `--apui-surface-sunken` in every theme. Code, CodeEditor, Markdown and Diff all use them, and code always stays left-to-right inside RTL pages.

## Customizing, from light to deep

1. **Brand:** point `primary-*` at your ramp, and optionally regenerate `gray-*` at your hue and change the font families.
2. **Shape and feel:** change radius, density, `--apui-border-muted` and the shadow tokens.
3. **Preset:** switch to Ledger or Harbor (see [presets](presets.md)), or copy one as a starting point.
4. **Component:** change a component token (`--apui-button-radius`, `--apui-card-padding`) or style a named part (root, label, control, hint, error, icon, header, body, footer) directly.
5. **Unstyled:** use the components without the visual layer and keep only layout, behavior and accessibility.

**Fixed on purpose:**
- Visible focus
- Contrast floors (4.5:1 text, 3:1 control edges and focus)
- Minimum target size
- Each component's parts and ARIA behavior

## What not to do

- No purple gradients, glows, claymorphism, rim lighting or iridescent edges. Surfaces are flat fills plus at most one blur.
- No colored left-border cards. Status uses a label or icon.
- No card radius above `--apui-radius-lg` in Strata, and no shadows on in-page cards.
- Glass is never used everywhere.
