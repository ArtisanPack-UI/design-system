---
title: Upgrading
menu_order: 10
---

# Upgrading

Livewire UI Components 3.0 and `@artisanpack-ui/react` and `@artisanpack-ui/vue` 2.0 are the first versions built on the design system. They replace DaisyUI with the design system's own CSS, rename some components to share one vocabulary across the three stacks, and unify props that differed between them.

Each stack has an automated upgrade tool and a step-by-step guide:

| Guide | From | To | Tool |
|---|---|---|---|
| [Livewire](Upgrade-Livewire) | Livewire UI Components 2.x | 3.0 | `php artisan artisanpack:upgrade-ui` |
| [React](Upgrade-React) | `@artisanpack-ui/react` 1.x | 2.0 | `npx @artisanpack-ui/codemods react` |
| [Vue](Upgrade-Vue) | `@artisanpack-ui/vue` 1.x | 2.0 | `npx @artisanpack-ui/codemods vue` |

Each guide covers:

1. Updating the package.
2. Running the upgrade tool, and reading its report.
3. Removing DaisyUI and loading the new CSS, with or without Tailwind.
4. Moving your theme to a token-based [preset](Theming-Presets).
5. The renamed and consolidated components.
6. Every prop, slot and event that changed, component by component.

## Before you start

- **Upgrade a whole app at once, on a branch.** The old and new versions can't be mixed in one app: the new CSS replaces DaisyUI, and the two style the same components differently.
- **Preview first.** Every tool has a dry run that prints the changes as a diff without writing anything.
- **The tools never rewrite raw DaisyUI classes.** They list every one with its file and line, because the right replacement depends on the element. The guides map each class to its component, token or utility.

## Support for the previous versions

The previous majors get **security fixes only for 12 months** after the new ones ship. No features or component fixes are backported.

## How the guides are made

The guides are generated from the same upgrade rules the tools apply, so they can't drift from what the tools do. See [the codemods package](Packages-Codemods).
