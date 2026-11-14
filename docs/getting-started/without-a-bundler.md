---
title: Without a Bundler
menu_order: 4
---

# Without a Bundler

Livewire and Blade apps don't need a build step. Livewire UI Components ships the design system's CSS and JavaScript prebuilt, and three Blade directives load them.

## Publish the assets

```bash
php artisan vendor:publish --tag=artisanpack-design-system-assets
```

This copies the compiled stylesheets and the behavior engine's script to `public/`. Publish again with `--force` after every package update, so the files match the package version.

## Load them in your layout

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    @apuiThemeScript
    @artisanpackStyles
</head>
<body>
    {{ $slot }}

    @artisanpackScripts
    @livewireScripts
</body>
</html>
```

| Directive | Prints | Where |
|---|---|---|
| `@apuiThemeScript` | The blocking theme script that applies the stored theme before the first paint | First in `<head>` |
| `@artisanpackStyles` | The full stylesheet: tokens, presets, components and utilities | `<head>` |
| `@artisanpackStyles('headless')` | The [headless](Theming-Headless) stylesheet, without the component styles | `<head>`, instead of the above |
| `@artisanpackScripts` | The behavior engine as one classic script that registers itself with Alpine | Before `@livewireScripts` |

The order of the scripts matters: the engine registers on Alpine's `alpine:init` event, so it has to load before Livewire starts Alpine.

## What the script contains

The prebuilt script is the behavior engine's Alpine plugin in a single file (`alpine.global.js`). It also exposes `window.ApuiBehavior`. For example, `ApuiBehavior.toast({ title: 'Saved', color: 'success' })` shows a toast from plain JavaScript, in the page's [Toast](components/toast) toaster. From a Livewire component, `$this->dispatch('toast', title: 'Saved')` does the same.

## React and Vue

React and Vue apps need a bundler: the components are ES modules. There's no official CDN build at 1.0.
