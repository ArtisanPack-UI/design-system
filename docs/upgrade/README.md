# Upgrade guides

How to move an app to the majors built on the design system. One guide per stack:

| Guide | From | To | Tool |
|---|---|---|---|
| [Livewire](livewire.md) | Livewire UI Components 2.x | 3.0 | `php artisan artisanpack:upgrade-ui` |
| [React](react.md) | `@artisanpack-ui/react` 1.x | 2.0 | `npx @artisanpack-ui/codemods react` |
| [Vue](vue.md) | `@artisanpack-ui/vue` 1.x | 2.0 | `npx @artisanpack-ui/codemods vue` |

Each guide covers running the tool, removing DaisyUI and adopting the new CSS (with or without Tailwind), migrating a theme to a token-based preset, the renamed and consolidated components, every prop that changed, and how long the old major is supported.

These files are generated, so they can't drift from what the tools do. The prose is in [`packages/codemods/guides/`](../../packages/codemods/guides); the component and prop tables come from the upgrade rules. To change a guide, edit its template or the rules and run:

```sh
npm run guides --workspace @artisanpack-ui/codemods
```

The docs site publishes them in its Migration section (#84). How the rules are built, and how to change one, is in the [codemods README](../../packages/codemods/README.md).
