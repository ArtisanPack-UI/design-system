---
title: Getting Started with React
menu_order: 2
---

# Getting Started with React

`@artisanpack-ui/react` 2.0 renders the design system's components for React 18 and 19.

## Install

```bash
npm install @artisanpack-ui/react @artisanpack-ui/css
```

The behavior engine (`@artisanpack-ui/behavior`) and its React adapter come as dependencies, so there's nothing else to install.

## Load the CSS

Load the CSS once, in your app's entry:

```ts
// main.tsx
import '@artisanpack-ui/css';
```

With Tailwind v4, import it from your Tailwind entry stylesheet instead, after the layer order line. See [With Tailwind](Getting-Started-Tailwind).

## Apply the theme before the first paint

Render `ThemeScript` in the document `<head>` so a stored dark or high-contrast choice applies before the page paints:

```tsx
import { ThemeScript } from '@artisanpack-ui/react';

<head>
  <ThemeScript />
</head>
```

In a single-page app with a static `index.html`, inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `<head>` instead. See [Themes](Theming-Themes).

## Your first component

```tsx
import { Button, Input } from '@artisanpack-ui/react';

export function SignIn() {
  return (
    <form>
      <Input label="Email" type="email" name="email" />
      <Button type="submit" color="primary">
        Sign in
      </Button>
    </form>
  );
}
```

Components can also be imported from category subpaths (`@artisanpack-ui/react/form`, `/layout`, `/navigation`, `/data`, `/chart`, `/feedback`, `/utility` and `/ai`), each with its own type declarations.

## Controlled and uncontrolled

Form components and overlays work both ways, like native React inputs: pass `value` and `onValueChange` (or `open` and `onOpenChange`) to control them, or `defaultValue` (`defaultOpen`) to let them manage their own state.

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} title="Edit profile">
  …
</Dialog>
```

## Next steps

- [Components](Components): every component with a React tab.
- [Theming](Theming): presets and your own brand.
- [React documentation](https://docs.artisanpackui.dev/documentation/react/home): Inertia, server rendering, the AI components and more.
