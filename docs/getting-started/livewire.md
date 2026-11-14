---
title: Getting Started with Livewire
menu_order: 1
---

# Getting Started with Livewire

Livewire UI Components 3.0 renders the design system's components as Blade components (`<x-artisanpack-button>`, `<x-artisanpack-dialog>`, …) that work in plain Blade views and in Livewire 3 and 4 components.

## Requirements

- PHP 8.2 or later
- Laravel 12 or 13
- Livewire 3.6 or later, or Livewire 4

## Install

```bash
composer require artisanpack-ui/livewire-ui-components
php artisan livewire-ui-components:install
```

The installer asks how your app should load the design system's CSS and JavaScript:

| Option | What it sets up | Choose it when |
|---|---|---|
| **bundler** | Installs `@artisanpack-ui/css` and `@artisanpack-ui/behavior` with npm and adds them to `resources/css/app.css` and `resources/js/app.js`. With `--tailwind`, also Tailwind v4 | Your app builds assets with Vite |
| **prebuilt** | Publishes the compiled CSS and JS this package ships to `public/`, and prints the Blade directives that load them | You don't use a build step |

Skip the question with `--assets=bundler` or `--assets=prebuilt`.

The bundler option installs the design system packages from npm. Until those packages are published, the installer uses the prebuilt option, and `--assets=bundler` warns that the packages must come from a linked checkout or a private registry.

If `resources/css/app.css` still loads DaisyUI, the installer says so. Remove the `@plugin "daisyui"` block: 3.0 doesn't use DaisyUI.

## With Vite

The installer writes this for you. To set it up by hand:

```bash
npm install @artisanpack-ui/css @artisanpack-ui/behavior
```

```css
/* resources/css/app.css */
@import '@artisanpack-ui/css';
```

```js
// resources/js/app.js
import apuiBehavior from '@artisanpack-ui/behavior/alpine';

document.addEventListener('alpine:init', () => window.Alpine.plugin(apuiBehavior));
```

Livewire bundles Alpine and starts it for you, so the plugin registers on `alpine:init`, which fires before Alpine initializes the page. If your app imports and starts Alpine itself, call `Alpine.plugin(apuiBehavior)` before `Alpine.start()` instead.

To use Tailwind alongside the components, see [With Tailwind](Getting-Started-Tailwind).

## Without a bundler

Publish the prebuilt assets and load them in your layout:

```bash
php artisan vendor:publish --tag=artisanpack-design-system-assets
```

```blade
<head>
    @apuiThemeScript
    @artisanpackStyles
</head>
<body>
    {{ $slot }}

    @artisanpackScripts
    @livewireScripts
</body>
```

`@artisanpackScripts` must come before Livewire's script, because it registers the behavior engine with Alpine as Alpine starts. Publish again with `--force` after each package update. See [Without a Bundler](Getting-Started-Without-A-Bundler) for details.

## The theme script

Add `@apuiThemeScript` to your layout's `<head>`, before any stylesheet. It applies the visitor's stored theme before the first paint and, until they choose one, follows their system's light or dark setting. See [Themes](Theming-Themes).

## Your first component

```blade
<x-artisanpack-button color="primary" wire:click="save">
    Save changes
</x-artisanpack-button>

<x-artisanpack-input label="Email" type="email" wire:model="email" />
```

Form components work with `wire:model` (and its modifiers) like native inputs. Overlays such as Dialog and Drawer bind their open state the same way: `<x-artisanpack-dialog wire:model="showDialog">`.

## Rules for Livewire

The components handle Livewire's DOM morphing for you. Two rules keep it working in your own markup:

1. **Give list items a `wire:key`**, as any Livewire list needs.
2. **Load the behavior engine before Livewire**, as the snippets above do.

Every part the components render has a stable, server-rendered `id`, so a re-render never replaces an open dialog or a focused field. If you build your own widgets on the engine, see [Alpine and Livewire](Behavior-Alpine-And-Livewire).

## Next steps

- [Components](Components): every component with a Blade tab.
- [Theming](Theming): presets and your own brand, including `php artisan artisanpack:generate-preset`.
- [Livewire UI Components documentation](https://docs.artisanpackui.dev/documentation/livewire-ui-components/home): configuration, the Livewire-only components and the upgrade command.
