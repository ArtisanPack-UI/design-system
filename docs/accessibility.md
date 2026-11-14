---
title: Accessibility
menu_order: 7
---

# Accessibility

The design system targets **WCAG 2.2 level AA** in all three stacks. Accessibility is part of each component's contract, not an option: the same ARIA, focus handling and keyboard support ship in Blade, React and Vue, and every [component page](Components) lists its keyboard interactions, requirements and the WCAG success criteria it covers.

## What the components do for you

| Area | What you get |
|---|---|
| **Contrast** | Text reaches 4.5:1 and control edges and the focus ring 3:1, against every surface in every theme and built-in preset. The [preset generator](Theming-Brand-Presets) refuses colors that would break this |
| **Focus** | A visible focus ring on `:focus-visible` that's never removed. Overlays move focus in on open, trap it while modal, and return it to the trigger on close |
| **Keyboard** | Everything works without a mouse: arrow keys in menus, tabs, listboxes, sliders and grids, Escape to dismiss, Home and End where they apply. Arrow keys follow the text direction |
| **Names and descriptions** | Form fields link their label with `for`/`id` and their hint and error with `aria-describedby`. Dialogs link their title and description. Invalid fields set `aria-invalid` |
| **Announcements** | The toaster is a labelled, polite live region; error toasts are announced at once. Loading states keep their labels and set `aria-busy` |
| **Target size** | Controls smaller than 24px extend their hit area to 24px (WCAG 2.5.8) |
| **Motion and transparency** | Movement stops under `prefers-reduced-motion`; glass turns opaque under `prefers-reduced-transparency` |
| **High contrast** | A [high-contrast theme](Theming-Themes), plus support for Windows forced-colors mode |
| **Right-to-left** | Layouts, placement and directional icons mirror under `dir="rtl"`. See [Right-to-Left](Styling-Right-To-Left) |

## What you still own

The components can't know everything about your content. These are on you:

- **Name icon-only controls.** An icon-only button needs an accessible name: `aria-label` (or the component's label prop).
- **Never rely on color alone.** Pair status colors with a label or an icon, as the components do.
- **Keep labels visible.** A placeholder never replaces a label.
- **Don't put the only copy of an error in a toast.** Toasts disappear. Show blocking errors in the form (with the field's `error`, a [ValidationSummary](components/validation-summary) or an [Alert](components/alert)) and use toasts for confirmations.
- **Give images alternative text**, and mark decorative ones as decorative.
- **Translate the built-in strings.** The text the components render on their own (close buttons, "No results", screen-reader announcements) comes from props ending in `Label`, such as `closeLabel`, so you can supply your language.
- **Keep contrast when you customize.** Tokens are checked; overrides you write by hand aren't. Don't lower text contrast with opacity.
- **Keep the markup's state in headless mode.** If you replace the visual layer, don't hide or reveal content with CSS alone. See [Headless](Theming-Headless).

## How it's tested

Each component is checked in all three stacks by the design system's quality gates: automated axe checks, keyboard and focus tests in a real browser, an accessibility-tree comparison between the styled and headless builds, and a parity check that each stack renders the same parts and ARIA. Contrast is checked for every token pair in every theme and preset whenever a token changes.

## Reporting a problem

If you find an accessibility issue, please [open an issue](https://github.com/ArtisanPack-UI/design-system/issues) with the component, the stack and the assistive technology you used.
