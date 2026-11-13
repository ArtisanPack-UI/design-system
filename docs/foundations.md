---
title: Foundations
menu_order: 3
---

# Foundations

Every visual decision in the design system is a token: a named value such as `--apui-color-primary` or `--apui-radius-surface`. Components read tokens and nothing else, so changing a token changes every component that uses it, in every stack.

## Principles

1. **Personality from structure, not color.** Type, spacing, proportion, radius and elevation carry the look, because they survive a rebrand. The default primary is a quiet steel blue and the grays are tinted toward it, so swapping the primary makes the whole library feel native to a new brand.
2. **Depth through tone, edges for certainty.** Each surface is one tone step from the one beneath it, and every container has a hairline edge, so a component always reads whatever it sits on. Shadows appear only on things that float.
3. **Round controls, rectangular containers.** Buttons, badges, toggles and pagination are pills. Text entry is gently rounded. Containers and overlays use larger, squarer corners.
4. **Neutral chrome; color for meaning.** Navigation, panels and labels stay neutral. Color goes to status, to category, and to one primary action per view.
5. **One loud thing per view.** Emphasis comes by exception, with the accent color, not by adding variants.
6. **Size and contrast make hierarchy, not weight.** Nothing goes heavier than weight 600.
7. **Flexible by construction.** Everything visual is a token. Only the accessibility guardrails and each component's anatomy are fixed.

## In this section

| Page | Covers |
|---|---|
| [Design Tokens](Foundations-Design-Tokens) | How tokens are organized and named, and how to use them in CSS, TypeScript and PHP |
| [Color](Foundations-Color) | Surfaces, text, edges and the eight color roles, in every theme |
| [Typography](Foundations-Typography) | The type scale and font families |
| [Spacing and Density](Foundations-Spacing-And-Density) | The spacing scale, control sizes and the three densities |
| [Shape and Elevation](Foundations-Shape-And-Elevation) | Radius, shadows, layering and the focus ring |
| [Motion](Foundations-Motion) | Durations, easings and reduced motion |
| [Icons](Foundations-Icons) | The icon set, sizes and right-to-left mirroring |

## What stays fixed

You can change any token, but some guarantees hold whatever you change. The [theming tools](Theming) check them for you:

- A visible focus ring on every interactive element.
- Contrast floors: 4.5:1 for text and 3:1 for control edges and the focus ring, in every theme.
- A minimum target size of 24px.
- Each component's parts, ARIA and keyboard behavior.
