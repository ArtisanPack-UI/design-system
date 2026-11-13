---
title: Typography
menu_order: 3
---

# Typography

The type scale steps by 1.2 from a 14px base. Every style is a group of tokens (size, line height, weight, letter spacing and family) under `--apui-type-<style>-*`.

## Fonts

| Token | Default | Use |
|---|---|---|
| `--apui-font-family-sans` | Geist | Interface text |
| `--apui-font-family-mono` | Geist Mono | IDs, SKUs, code |
| `--apui-font-family-display` | Geist | Display styles; presets can give it its own face |

Geist and Geist Mono are free (SIL Open Font License). **The design system's CSS doesn't load font files**, so load them yourself, from Google Fonts or self-hosted. Without them, text falls back to your platform's system font, which works but looks different. The presets bring their own faces, which you load the same way: Ledger uses IBM Plex Sans and IBM Plex Mono, and Harbor uses Bricolage Grotesque for display styles.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400..600&family=Geist+Mono:wght@400..600&display=swap" rel="stylesheet">
```

To use your own fonts, set the family tokens in your CSS or in a [brand preset](Theming-Brand-Presets) (`--font-sans`, `--font-mono` and `--font-display` options). For Arabic and Hebrew, add a script font to `--apui-font-family-sans`.

| Token | Value |
|---|---|
| `--apui-font-family-sans` | `Geist, ui-sans-serif, system-ui, sans-serif` |
| `--apui-font-family-mono` | `"Geist Mono", ui-monospace, SFMono-Regular, monospace` |
| `--apui-font-family-display` | `Geist, ui-sans-serif, system-ui, sans-serif` |

## The scale

| Style | Size | Line height | Weight | Letter spacing | Family |
|---|---|---|---|---|---|
| `display-xl` | 41px | 46px | 600 | -0.02em | Geist |
| `display-lg` | 34px | 40px | 600 | -0.02em | Geist |
| `heading-xl` | 28px | 34px | 600 | -0.015em | Geist |
| `heading-lg` | 23px | 30px | 600 | -0.01em | Geist |
| `heading-md` | 19px | 26px | 600 | 0 | Geist |
| `heading-sm` | 16px | 24px | 600 | 0 | Geist |
| `body-lg` | 16px | 24px | 400 | 0 | Geist |
| `body-md` | 14px | 20px | 400 | 0 | Geist |
| `body-sm` | 13px | 18px | 400 | 0 | Geist |
| `caption` | 12px | 16px | 400 | 0 | Geist |
| `label-md` | 14px | 20px | 500 | 0 | Geist |
| `label-sm` | 13px | 18px | 500 | 0 | Geist |
| `label-xs` | 12px | 16px | 500 | 0 | Geist |
| `eyebrow` | 11px | 16px | 500 | 0.06em | Geist |
| `stat-lg` | 34px | 40px | 500 | -0.02em | Geist |
| `stat-md` | 28px | 34px | 500 | -0.02em | Geist |
| `stat-sm` | 19px | 26px | 500 | -0.01em | Geist |
| `num-md` | 14px | 20px | 400 | 0 | Geist |
| `code-md` | 13px | 20px | 400 | 0 | Geist Mono |
| `code-sm` | 12px | 16px | 400 | 0 | Geist Mono |

| Group | Styles | Use |
|---|---|---|
| Display | `display-xl`, `display-lg` | Marketing and hero headings |
| Heading | `heading-xl` to `heading-sm` | Page and section headings |
| Body | `body-lg`, `body-md` (default), `body-sm`, `caption` | Running text |
| Label | `label-md`, `label-sm`, `label-xs`, `eyebrow` | Form labels, table headers, small caps eyebrows |
| Numeric | `stat-lg`, `stat-md`, `stat-sm`, `num-md` | Statistics and table figures, always with tabular figures |
| Code | `code-md`, `code-sm` | Inline and block code |

## Using a style

```css
.section-title {
  font-family: var(--apui-type-heading-md-font-family);
  font-size: var(--apui-type-heading-md-font-size);
  line-height: var(--apui-type-heading-md-line-height);
  font-weight: var(--apui-type-heading-md-font-weight);
  letter-spacing: var(--apui-type-heading-md-letter-spacing);
}
```

The [Heading](components/heading) and [Text](components/text) components apply the styles for you, and the [Tailwind utilities](Styling-Tailwind-Utilities) include `text-heading-md`, `text-body-sm` and the rest.

## Rules

- Sentence case everywhere, except the `eyebrow` style.
- Hierarchy comes from size and contrast, not weight: nothing goes heavier than 600. Statistics are large at weight 500, with small muted labels.
- Numbers in tables align to the inline end and use tabular figures.
- Prose and help text stop at `--apui-measure` (68 characters).
