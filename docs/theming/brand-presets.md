---
title: Brand Presets
menu_order: 3
---

# Brand Presets

Most rebrands only need a primary color. The preset generator builds a complete preset from it, and checks every contrast pair in every theme before writing anything.

## Generate a preset

With npm:

```bash
npx apui-generate-preset --name acme --primary "#7c3aed" > acme.css
```

In a Laravel app with Livewire UI Components:

```bash
php artisan artisanpack:generate-preset acme --primary="#7c3aed"
```

The Artisan command writes `resources/css/presets/acme.css`.

Import the file after the design system's CSS and switch it on:

```css
@import '@artisanpack-ui/css';
@import './presets/acme.css';
```

```html
<html data-preset="acme">
```

## Options

| npm option | Artisan option | Default | Does |
|---|---|---|---|
| `--name` | `name` argument | required (Artisan asks if it's missing) | The `data-preset` value |
| `--primary` | `--primary` | required | Rebuilds the primary ramp around this color |
| `--secondary`, `--accent` | same | unchanged | Rebuild the secondary and accent ramps |
| `--neutral` | `--neutral` | `tinted` | `tinted` re-hues the grays, glass and backdrop toward the primary; `pure` makes them pure gray; `keep` leaves them |
| `--font-sans`, `--font-mono`, `--font-display` | same | unchanged | Comma-separated font families |
| `--format` | `--format` | `css` | `css`, `php` or `json`. npm also offers `dtcg`, a preset directory for design tools, which needs `--out` |
| `--out` | `--output` | stdout / `resources/css/presets/<name>.<format>` | Where to write |
| | `--description` | | A description for the preset |
| | `--force` | | Overwrite an existing file |

```bash
npx apui-generate-preset --name acme --primary "#7c3aed" --accent "#f59e0b" \
  --neutral pure --font-sans "Inter, system-ui, sans-serif"
```

## How it keeps contrast

Each generated ramp step keeps your color's hue and chroma but matches the **luminance** of the default ramp's step. Contrast depends only on luminance, so every pair that passes in the default theme still passes with your colors.

Your exact color lands on the ramp step nearest its luminance when the result still passes; otherwise that step is adjusted too, and the generator tells you which step it used. It then runs every contrast pair in every theme, and writes nothing if any fails.

## Coming from DaisyUI themes

A DaisyUI theme, or a theme file from Livewire UI Components 2.x's `artisanpack:generate-theme`, has nothing to style in the new versions. Generate a preset from the same brand colors instead. The [upgrade guides](Upgrade) map each DaisyUI theme variable to its token.
