---
title: Helpers
menu_order: 4
---

# Helpers

Some components don't need a state machine, so the engine ships plain helpers that every stack calls the same way. You can use them in your own code too.

## Theme

Exported from `@artisanpack-ui/behavior`:

| Helper | Does |
|---|---|
| `applyTheme(choice)` | Sets `data-theme` on `<html>`, stores the choice and tells every ThemeToggle on the page |
| `resolveTheme(choice)` | The theme a choice shows: itself, or `light` or `dark` for `system` |
| `systemTheme()` | The operating system's theme |
| `watchTheme(callback)` | Calls back when the choice changes, in this tab or another, or when the OS scheme changes |
| `themeScript(options)` | The blocking `<head>` script that applies the stored theme before first paint |

Choices are `light`, `dark`, `high-contrast` and `system`, stored in `localStorage` under `apui-theme`. See [Themes](Theming-Themes).

## Icons

Exported from `@artisanpack-ui/behavior/icons`:

| Helper | Does |
|---|---|
| `resolveIcon(name)` | An icon's SVG body from the registry |
| `iconSvg(name)` | The full `<svg>` for a name |
| `registerIcons(icons)` | Adds or replaces icons. Only plain SVG shapes are accepted |
| `registerDirectionalIcons(names)` | Marks icons that should mirror in right-to-left |

See [Icons](Foundations-Icons).

## Content and data

These power the editors and data-display components. They're shared so that all three stacks render pixel for pixel the same; Livewire runs PHP ports of the same formulas on the server.

| Area | Used by |
|---|---|
| Rich text, code editing, signature drawing | RichTextEditor, CodeEditor, Signature |
| Sparkline geometry and text alternatives | Sparkline |
| Text diffs (line, side-by-side and word level) | Diff |
| Chart geometry, ticks and the shared tooltip | Chart |
| Calendar month, week, day and agenda models | Calendar |
| Markdown rendering, with safe links and images | Markdown |
| Code lines and highlights, keyboard symbols, clipboard | Code, Kbd, Clipboard |

The Markdown renderer escapes raw HTML by default and only allows safe link and image URLs, so it's safe for untrusted input.
