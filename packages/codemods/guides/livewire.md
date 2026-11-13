# Upgrading Livewire UI Components 2.x to 3.0

Livewire UI Components 3.0 is rebuilt on the ArtisanPack UI design system. The components keep their purpose, and three things change underneath them:

- **DaisyUI is gone.** Components are styled by `@artisanpack-ui/css`: plain CSS in cascade layers, driven by design tokens. Tailwind is optional.
- **One API across Livewire, React and Vue.** Some components and attributes were renamed to match. Most 2.x tags still render in 3.0 as deprecated aliases, so an app keeps working while you migrate, but the aliases go in the next major.
- **Theming is tokens.** The DaisyUI theme generator is replaced by presets built on the tokens.

`php artisan artisanpack:upgrade-ui` does the mechanical part. This guide covers that command and what is left for you.

{{include:_support}}

## 1. Update the package

Commit your work first, then:

```bash
composer require artisanpack-ui/livewire-ui-components:^3.0
```

## 2. Run the upgrade command

Preview the changes:

```bash
php artisan artisanpack:upgrade-ui --dry-run
```

The dry run prints a diff of every file it would change and writes nothing. Run it without `--dry-run` to apply them:

```bash
php artisan artisanpack:upgrade-ui
```

| Option | What it does |
|---|---|
| `paths` | Files or directories to upgrade. Default: `resources/views` |
| `--dry-run` | Show the changes as a diff without writing |
| `--no-classes` | Leave raw DaisyUI classes out of the report |
| `--json` | Print the report as JSON. It writes without asking, so pair it with `--dry-run` to only report |
| `--force` | Write without asking |

Views in a package or a module are not under `resources/views`, so pass them: `php artisan artisanpack:upgrade-ui packages/billing/resources/views`.

**What it rewrites.** Renamed components (`<x-artisanpack-modal>` to `<x-artisanpack-dialog>`), renamed attributes and slots, flags that became values (`right` to `side="end"`), per-part class attributes (merged into `:classes`), `label` on a self-closing button (moved into the slot) and tooltip attributes (the element is wrapped in `<x-artisanpack-tooltip>`). It reads values where the name alone isn't enough: on Button, `variant="primary"` becomes `color="primary"` and `variant="ghost"` stays.

**What it reports and leaves alone.** Each line of the report has the file, line and column:

| Label | Meaning |
|---|---|
| `manual` | An attribute, slot or component with no automatic replacement. The message says what to do |
| `review` | A change that was made and deserves a look |
| `removed` | An attribute that was deleted because 3.0 has no equivalent |
| `class` | A raw DaisyUI class, theme variable or DaisyUI configuration. See step 3 |

**What it never touches.** Tags that other packages register under the same prefix, such as `<x-artisanpack-ec-price>`; Blade comments; `@verbatim` blocks; anything that isn't a Blade component tag. It does not edit PHP, so attributes built in a component class or passed through `$attributes->merge()` are yours to check: the command flags tags that build their attributes with Blade.

The command is safe to run again after you fix things by hand.

## 3. Remove DaisyUI and adopt the new CSS

### Without a bundler

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
    …
    @artisanpackScripts
    @livewireScripts
</body>
```

`@artisanpackScripts` goes before Livewire's script: it registers the behavior engine with Alpine as Alpine starts. `@apuiThemeScript` applies the stored theme before first paint.

### With Vite

```bash
npm install @artisanpack-ui/css @artisanpack-ui/behavior
npm uninstall daisyui
```

Without Tailwind, import the CSS in your entry stylesheet:

```css
@import '@artisanpack-ui/css';
```

With Tailwind v4, declare the layer order first, so Preflight never restyles a component and a utility on a component still wins. The last import is optional: it adds utilities generated from the tokens (`bg-surface-page`, `text-muted`, `rounded-control`).

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind';
```

Then delete `@plugin "daisyui";` and any `@plugin "daisyui/theme"` block from your CSS, and register the behavior engine with Alpine:

```js
import apuiBehavior from '@artisanpack-ui/behavior/alpine';

Alpine.plugin(apuiBehavior);
```

To bring your own styles, import `@artisanpack-ui/css/headless` instead: the same markup, ARIA and behavior with no component CSS.

{{include:_classes}}

## 4. Migrate your theme

`php artisan artisanpack:generate-theme` wrote Tailwind palettes and DaisyUI variables. It still runs in 3.0, deprecated, and its output has nothing to style. Use the preset generator instead:

```bash
php artisan artisanpack:generate-preset acme --primary="#7c3aed"
```

It writes `resources/css/presets/acme.css` and refuses to write a preset that fails WCAG 2.2 AA contrast in any theme. Import the file after `@artisanpack-ui/css` and switch it on with `<html data-preset="acme">`. `--secondary`, `--accent`, `--neutral` and the `--font-*` options set the rest of the brand; `--format=php` or `json` gives the values as data.

The 2.x theme builder page and its route are removed. The `mary-theme` storage keys, the class on `<html>` and the `theme-changed` events are gone too: the theme lives in `data-theme`, and ThemeToggle reports a change as `value-change`.

{{include:_tokens}}

## 5. Renamed and consolidated components

{{generated:components}}

## 6. Changes by component

Every 2.x attribute and slot that changed. "Automatic" says whether `artisanpack:upgrade-ui` makes the change for you. Attributes are written in kebab-case, as in Blade; the camelCase form is handled the same way.

{{generated:members}}

## 7. After the command

- Work through the `manual` lines of the report, then the `class` lines.
- **Icons.** String icon names resolve against the design system's Lucide set first (`leading-icon="plus"`). Heroicons and Font Awesome names (`o-plus`, `fa-user`) still render through blade-icons, so nothing breaks, but new markup should use the registry names.
- **Events.** Components report changes as `value-change` and `open-change`. `wire:model` covers both, so most apps have nothing to do; listeners for 2.x events such as `theme-changed` or `row-selection` need the new names.
- **Defaults that moved.** A Drawer opens from the end side (the command adds `side="start"` where 2.x relied on the old default). Combobox is single-select where Choices was multiple (the command adds `multiple`). A Form draws no separator unless `divided` is set. A Pin is numeric by default: add `type="alphanumeric"` where 2.x accepted any character.
- Run your tests, and look at each page in light, dark and high-contrast themes.
