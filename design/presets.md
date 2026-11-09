# Presets

A preset is **a set of token values and nothing else**. Every ArtisanPack UI component reads the same token names, so switching presets changes the personality of the whole library without touching a component, a template or a class. Strata is the default. Ledger and Harbor ship as alternates and double as the proof that the system doesn't box developers in.

Apply a preset with an attribute on any element (`<html data-preset="ledger">`, or a single region). Both presets are defined at the end of `design/css/components.css`. A preset can also be a starting point: copy it and change what you like.

The tables list **only the values that differ from Strata**. Anything not listed stays as in `tokens.json`.

## Strata (default)

Depth through tone, plus a hairline edge on every surface. Round controls, rectangular containers, medium rhythm. Geist. Steel blue primary, grays tinted toward it. All values in `tokens.json`.

## Ledger

Structure through lines. Pure grays, near-square corners, a tight rhythm and an editorial label voice. For dense admin, reporting and long forms.

| Token | Strata | Ledger |
|---|---|---|
| `--apui-font-family-sans` | Geist | "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif |
| `--apui-font-family-mono` | Geist Mono | "IBM Plex Mono", ui-monospace, monospace |
| `gray-*` ramp | tinted, chroma 0.006 to 0.010 at hue 250 | chroma 0: `--apui-gray-25` #fcfcfc, `--apui-gray-75` #f3f3f3, `--apui-gray-100` #ededed, `--apui-gray-150` #e4e4e4, `--apui-gray-500` #808080, `--apui-gray-600` #666666, `--apui-gray-700` #505050, `--apui-gray-900` #262626, `--apui-gray-925` #1d1d1d, `--apui-gray-950` #141414, `--apui-gray-975` #0d0d0d |
| `--apui-color-primary` (light / dark) | `--apui-steel-600` / `--apui-steel-400` | #366bd3 / #72a3fe |
| `--apui-color-primary-hover` | `--apui-steel-700` / `--apui-steel-300` | #1f53b8 / #a0c1fe |
| `--apui-color-primary-soft` / `--apui-color-primary-soft-foreground` (light) | `--apui-steel-100` / `--apui-steel-700` | #dfeafe / #1f53b8 |
| `--apui-color-primary-text` (light / dark) | `--apui-steel-700` / `--apui-steel-400` | #1f53b8 / #72a3fe |
| `--apui-focus-ring-color` (light / dark) | `--apui-steel-600` / `--apui-steel-300` | #366bd3 / #a0c1fe |
| `--apui-border-muted` (light) | `--apui-gray-150` | `--apui-gray-200` (lines carry the structure, so they show a little more) |
| `--apui-radius-xs` · `sm` · `md` · `lg` · `xl` | 4 · 6 · 10 · 14 · 16px | 2 · 3 · 4 · 6 · 8px |
| `--apui-button-radius` · `--apui-tabs-radius` · `--apui-badge-radius` | 9999px | 4px · 0 (underline tabs) · 2px |
| `--apui-input-radius` · `--apui-card-radius` · `--apui-table-radius` · `--apui-alert-radius` | 10 · 14 · 14 · 14px | 4 · 6 · 6 · 6px |
| `--apui-dialog-radius` · `--apui-menu-radius` · `--apui-toast-radius` · `--apui-menu-item-radius` | 16 · 16 · 16 · 10px | 8 · 8 · 8 · 2px |
| `--apui-control-height-xs` … `xl` | 24 · 28 · 36 · 44 · 52px | 22 · 26 · 32 · 38 · 44px (xs and sm extend their hit area to `--apui-target-size-min`) |
| `--apui-panel-padding` (compact / default / comfortable) | 16 / 20 / 24px | 12 / 16 / 20px |
| `--apui-row-height` (compact / default / comfortable) | 32 / 40 / 48px | 28 / 36 / 44px |
| `--apui-panel-gap` (default) | 12px | 16px, or 0 with shared 1px edges in dense layouts |
| `stat-*` weight | 500 | 400 (light numerals, as in the Glazzed reference) |
| Table headers and section labels | `label-sm` | `eyebrow` (11px, 500, uppercase, +0.06em) |

**What changes visually:** corners go nearly square, everything tightens by about 10%, the grays lose their blue tint and header rows get the uppercase label voice.

## Harbor

Structure through space. Soft islands on a tinted canvas, low layered shadows in light, expressive display type and an ink primary. For auth, marketing, storefronts and consumer products.

| Token | Strata | Harbor |
|---|---|---|
| `--apui-font-family-sans` | Geist | "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif |
| `--apui-font-family-display` (new family, used by `display-*`, `heading-xl`, `heading-lg` and `stat-*`) | n/a | "Bricolage Grotesque", "Hanken Grotesk", sans-serif |
| `--apui-font-family-mono` | Geist Mono | "JetBrains Mono", ui-monospace, monospace |
| `body-md` | 14 / 20px | 15 / 22px |
| `stat-md` · `stat-lg` | 28 · 34px, 500 | 30 · 38px, 600, −0.03em |
| `--apui-surface-page` (light) | `--apui-gray-75` | #ebf1f7 (canvas tinted at chroma 0.01) |
| `--apui-surface-default` · `--apui-surface-raised` (light) | `--apui-gray-25` · `--apui-gray-0` | `--apui-gray-0` · `--apui-gray-0` (islands are white; shadow separates them) |
| `--apui-border-muted` (light) | `--apui-gray-150` | #00000000 (no hairline: space and shadow do the work). Dark keeps `--apui-gray-850`. |
| `--apui-elevation-raised` (light) | none | 0 1px 2px rgba(16,20,24,.04), 0 2px 8px rgba(16,20,24,.04) |
| `--apui-elevation-overlay` (light) | 0 8px 24px / .16 | 0 12px 32px rgba(16,20,24,.10), 0 2px 6px rgba(16,20,24,.06) |
| `--apui-color-primary` · `--apui-color-primary-hover` · `--apui-color-primary-foreground` | steel | `{--apui-color-neutral}` · `{--apui-color-neutral-hover}` · `{--apui-color-neutral-foreground}` (ink: near black in light, near white in dark) |
| `--apui-color-primary-soft` · `--apui-color-primary-soft-foreground` · `--apui-color-primary-text` · `--apui-color-primary-border` | steel | `{--apui-color-neutral-soft}` · `{--apui-color-neutral-soft-foreground}` · `{--apui-color-neutral-text}` · `{--apui-color-neutral-border}` |
| `--apui-focus-ring-color` (light) | `--apui-steel-600` | `--apui-steel-600` (kept: an ink focus ring would vanish against an ink button) |
| `--apui-radius-md` · `lg` · `xl` | 10 · 14 · 16px | 12 · 20 · 24px |
| `--apui-card-radius` · `--apui-table-radius` · `--apui-alert-radius` | 14px | 20px (never above 20px or one sixth of the card's height) |
| `--apui-dialog-radius` · `--apui-menu-radius` · `--apui-toast-radius` | 16px | 24 · 20 · 20px |
| `--apui-control-height-xs` … `xl` | 24 · 28 · 36 · 44 · 52px | 28 · 32 · 40 · 48 · 56px |
| `--apui-panel-padding` (compact / default / comfortable) | 16 / 20 / 24px | 20 / 24 / 32px |
| `--apui-row-height` (compact / default / comfortable) | 32 / 40 / 48px | 36 / 48 / 56px |
| `--apui-panel-gap` · `--apui-shell-gutter` | 12 · 12px | 16 · 16px |

**What changes visually:** in light mode, cards lose their hairline and float on soft shadows over a tinted canvas. Headings and stats switch to a display face, primary goes to ink, everything gets roomier and corners soften. In dark, Harbor falls back to tone like Strata, because shadows don't read on dark surfaces.

## Rebranding inside any preset

Brand color is one level below presets. These are the tokens a rebrand typically touches:

1. The primary ramp (`steel-*`, or point `primary-*` at a ramp of your own).
2. The gray tint, by regenerating `gray-*` at your primary's hue.
3. Optionally `accent-*` and the font families.

The two-brand re-theme test in Step 2 uses exactly this.
