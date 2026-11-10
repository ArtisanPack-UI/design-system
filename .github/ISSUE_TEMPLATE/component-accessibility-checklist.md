---
name: Component accessibility checklist
about: The manual keyboard and screen-reader pass for one component, in every stack it ships in (#40)
title: 'A11y checklist: <Component>'
labels: accessibility
---

<!--
Generate this checklist filled in from the manifest instead of editing it by hand:

  npx apui-gates checklist <Component>

and paste the output here. The template below is the fallback.

Automated, and not repeated here: axe on every fixture sheet in every stack, and
the manifest's root element and role (`apui-gates check`, D-016).
-->

Component: <!-- e.g. Button --> · Issue: #<!-- n --> · Stacks: <!-- Livewire, React, Vue (D-003) -->

### Keyboard

| Check | Livewire | React | Vue |
|---|---|---|---|
| Every interactive part is reachable with Tab, in a logical order | ☐ | ☐ | ☐ |
| The focus ring is visible on `:focus-visible` in light, dark and high-contrast | ☐ | ☐ | ☐ |
| Each key in the manifest's `a11y.keyboard` does what it says | ☐ | ☐ | ☐ |
| RTL (`dir="rtl"`): ArrowRight moves toward the start and ArrowLeft toward the end, following the text | ☐ | ☐ | ☐ |
| RTL: Home and End go to the visual start and end | ☐ | ☐ | ☐ |
| No keyboard trap, except a modal that returns focus when it closes | ☐ | ☐ | ☐ |

### Screen reader

Test with VoiceOver + Safari, and NVDA + Firefox or Chrome.

| Check | Livewire | React | Vue |
|---|---|---|---|
| Announced with the right role and an accessible name | ☐ | ☐ | ☐ |
| State changes are announced (expanded, selected, checked, busy, invalid, as they apply) | ☐ | ☐ | ☐ |
| Decorative icons are hidden; meaningful ones have a text alternative | ☐ | ☐ | ☐ |
| Every user-facing string is translatable, including the hidden ones | ☐ | ☐ | ☐ |
| Each requirement in the manifest's `a11y.requirements` holds | ☐ | ☐ | ☐ |
