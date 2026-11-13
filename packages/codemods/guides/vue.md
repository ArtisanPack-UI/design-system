# Upgrading @artisanpack-ui/vue 1.x to 2.0

`@artisanpack-ui/vue` 2.0 is rebuilt on the ArtisanPack UI design system. The components keep their purpose, and three things change underneath them:

- **DaisyUI is gone.** Components are styled by `@artisanpack-ui/css`: plain CSS in cascade layers, driven by design tokens. Tailwind is optional.
- **One API across Livewire, React and Vue.** Some components, props and events were renamed to match. Most 1.x exports still work in 2.0, marked `@deprecated`, so an app keeps building while you migrate, but they go in the next major.
- **Theming is tokens.** `@artisanpack-ui/tokens` 2.0 replaces the DaisyUI color maps with presets built on the tokens.

The codemod does the mechanical part. This guide covers it and what is left for you.

{{include:_support}}

## 1. Update the packages

Commit your work first, then:

```bash
npm install @artisanpack-ui/vue@^2 @artisanpack-ui/css
npm uninstall daisyui
```

## 2. Run the codemod

Preview the changes:

```bash
npx @artisanpack-ui/codemods vue src --dry-run
```

The dry run prints a diff of every file it would change and writes nothing. Run it without `--dry-run` to apply them:

```bash
npx @artisanpack-ui/codemods vue src
```

| Option | What it does |
|---|---|
| paths | Files or directories to migrate. Default: `src` |
| `--dry-run` | Show the changes as a diff without writing |
| `--no-classes` | Leave raw DaisyUI classes out of the report |
| `--global` | Also migrate tags of components registered globally, which no file imports |
| `--json` | Print the report as JSON |

It reads `.vue`, `.ts`, `.js`, `.tsx` and `.jsx` files and skips `node_modules`, build output and dot-directories. It edits in place and keeps your formatting and comments; run your formatter afterwards if a rewritten line runs long.

**What it rewrites.** In `<script>`, imports from `@artisanpack-ui/vue` and every reference to a renamed component, including a `components` option. In `<template>`, tags in PascalCase or kebab-case, props (bound or not, in the case you wrote them), events, `v-model` arguments and slots. Flags that became values (`vertical` to `orientation="vertical"`), values that changed with the name (`position="left"` to `placement="start"`) and per-part class props (merged into `classes`) are rewritten too. Only tags a file imports from the package are touched, unless you pass `--global`.

**What it reports and leaves alone.** Each line of the report has the file, line and column:

| Label | Meaning |
|---|---|
| `manual` | A prop, event or component with no automatic replacement. The message says what to do |
| `review` | A change that was made and deserves a look: a renamed event whose payload changed, or a dynamic value the codemod couldn't read |
| `removed` | A prop that was deleted because 2.0 has no equivalent |
| `class` | A raw DaisyUI class, theme variable or DaisyUI configuration. See step 3 |

It can't see through `v-bind="props"` or a dynamic value (`:vertical="isTall"`); both are reported. Templates in other languages, such as Pug, are not rewritten. The codemod is safe to run again after you fix things by hand.

## 3. Remove DaisyUI and adopt the new CSS

Load the CSS once. Without Tailwind, import it in your app's entry:

```ts
import '@artisanpack-ui/css';
```

With Tailwind v4, import it from your Tailwind entry stylesheet instead. Declare the layer order first, so Preflight never restyles a component and a utility on a component still wins. The last import is optional: it adds utilities generated from the tokens (`bg-surface-page`, `text-muted`, `rounded-control`).

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind';
```

Then delete `@plugin "daisyui";` and any `@plugin "daisyui/theme"` block from your CSS.

To bring your own styles, import `@artisanpack-ui/css/headless` instead: the same markup, ARIA and behavior with no component CSS.

{{include:_classes}}

## 4. Migrate your theme

`@artisanpack-ui/tokens` 1.x shipped DaisyUI color maps, `cn()`, `resolveColor()`, glass helpers and a Tailwind plugin. 2.0 replaces all of them with the design tokens as `--apui-*` custom properties, which `@artisanpack-ui/css` already includes. Remove the 1.x Tailwind plugin from your config and any imports of those helpers.

A brand is a **preset**. Generate one from your colors:

```bash
npx apui-generate-preset --name acme --primary "#7c3aed" > acme.css
```

The generator refuses a preset that fails WCAG 2.2 AA contrast in any theme. Import the file after `@artisanpack-ui/css` and switch it on with `<html data-preset="acme">`.

The theme lives in `data-theme` on `<html>`. ThemeToggle sets and stores it and reports a change as `update:modelValue`. Render `ThemeScript` in the document head to apply the stored theme before first paint.

{{include:_tokens}}

## 5. Renamed and consolidated components

{{generated:components}}

## 6. Changes by component

Every 1.x prop, slot and event that changed. "Automatic" says whether the codemod makes the change for you.

{{generated:members}}

## 7. After the codemod

- Work through the `manual` lines of the report, then the `class` lines.
- **Events.** Value and open changes are `update:modelValue` and `update:open`, so `v-model` and `v-model:open` cover them. The codemod renames handlers and marks each for review, because the payload is now the value and not a DOM event.
- **Toasts.** `ToastProvider` no longer wraps the app. Render one `Toaster` and create toasts with `toast.create()`.
- **Left and right.** Placement and side props take `start` and `end`, so layouts mirror in right-to-left languages.
- Run the type checker: every prop the codemod left behind is a type error that points at the line.
- Look at each page in light, dark and high-contrast themes.
