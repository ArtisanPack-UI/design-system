---
title: Getting Started with Vue
menu_order: 3
---

# Getting Started with Vue

`@artisanpack-ui/vue` 2.0 renders the design system's components for Vue 3.5 and later.

## Install

```bash
npm install @artisanpack-ui/vue @artisanpack-ui/css
```

The behavior engine (`@artisanpack-ui/behavior`) and its Vue adapter come as dependencies, so there's nothing else to install.

## Load the CSS

Load the CSS once, in your app's entry:

```ts
// main.ts
import '@artisanpack-ui/css';
```

With Tailwind v4, import it from your Tailwind entry stylesheet instead, after the layer order line. See [With Tailwind](Getting-Started-Tailwind).

## Apply the theme before the first paint

Render `ThemeScript` in the document `<head>` (with server rendering) so a stored dark or high-contrast choice applies before the page paints. In a single-page app with a static `index.html`, inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `<head>` instead. With Nuxt, add it as a head script, before any stylesheet: `useHead({ script: [{ innerHTML: themeScript(), tagPriority: 'critical' }] })`. See [Themes](Theming-Themes).

## Your first component

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input } from '@artisanpack-ui/vue';

const email = ref('');
</script>

<template>
  <form>
    <Input v-model="email" label="Email" type="email" name="email" />
    <Button type="submit" color="primary">Sign in</Button>
  </form>
</template>
```

Components can also be imported from category subpaths (`@artisanpack-ui/vue/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables` and `/ai`), each with its own type declarations.

## v-model

Form components support `v-model`, and overlays bind their open state with `v-model:open`:

```vue
<Dialog v-model:open="editing" title="Edit profile">…</Dialog>
```

## Next steps

- [Components](Components): every component with a Vue tab.
- [Theming](Theming): presets and your own brand.
- [Vue documentation](https://docs.artisanpackui.dev/documentation/vue/home): Inertia, server rendering, the composables, the AI components and more.
