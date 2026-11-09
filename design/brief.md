# Claude Design brief

Issue #11. The brief used for Phase 1, based on the prompt in #10, with Jacob's answers filled in and the clarifications made during the session.

## The problem

The current library is built on DaisyUI and has four problems: it looks generic, its density and spacing feel off, its theming is shallow, and it is inconsistent across stacks.

## What "default styling" means

This is not a brand for one product. Developers will customize it heavily for their own brands. The design is the look a developer gets before changing anything, plus the structure that makes changing it easy.

- It should look considered and finished out of the box, with a clear point of view, and not like a template.
- Personality comes mainly from type, spacing, proportion, radius and elevation, because those survive a rebrand. No signature color.
- The default color stays neutral enough that swapping the primary makes it feel like the developer's own product.

## Inspiration

Jacob's Pinterest board: dark and light dashboards, translucent panels over photos, tinted stat cards, floating navigation, and a glass UI kit.

**What draws him to them:** the overall look, the layout, and the backgrounds of the elements.

**What he doesn't want from them:** anything that locks the system or developers into one specific look, and any "AI look".

What the board says, in principles (full write-up in [direction.md](direction.md)):

1. Elevation is a change in tone, not a shadow.
2. The interface sits in a place: translucency belongs to the shell, content stays readable.
3. Chrome is neutral; color belongs to data and to one action.
4. One loud thing per view.
5. Round controls, rectangular containers.
6. Big numerals, small labels, light weights.
7. Navigation is detached from content.

The "AI look" was defined as anything simulating a physical material (claymorphism, rim-lit 3D, iridescent edges, glow halos). The rule that keeps the system clear of it: flat fills plus at most one blur.

## How it will be customized

- Tokens have three tiers: primitive, semantic, component. Every visual decision is a token value.
- Themes only reassign semantic tokens, so nothing depends on one hue or a one-off override.
- Every component has named parts that developers can style individually.
- Tailwind is optional, so nothing depends on it.

## Fixed constraints

- Variants: solid, soft, outline, ghost, link
- Colors: primary, secondary, accent, neutral, success, warning, error, info
- Sizes: xs, sm, md, lg, xl
- Surfaces: default, raised, sunken, glass
- Density: compact, default, comfortable
- Themes: light, dark, high-contrast
- WCAG 2.2 AA throughout, with a clearly visible focus treatment
- Layouts mirror for right-to-left languages
- Open-licensed fonts and icons

## Where it's used

Admin dashboards, ecommerce, long forms, content management, and auth or marketing pages. It has to hold up in dense, data-heavy screens.

## Avoid

The DaisyUI look, generic SaaS dashboards, purple gradients, oversized rounded cards with heavy shadows, and glass everywhere.

## Clarifications made during Phase 1

- **Scope:** the deliverable is the component system behind the Livewire, React and Vue packages. Screens are test beds for the components.
- **Themes:** light and dark are equal, first-class themes, with high contrast alongside.
- **Glass:** an opt-in surface for any container component (Card, Dialog, DropdownMenu, Toast, Navbar, Alert), never the default.
- **Flexibility:** a requirement, not a feature. Developers can change as much or as little as they want, in five levels: brand color, shape and density, a whole preset, individual component parts, and an unstyled base. Only accessibility guardrails and component anatomy are fixed.
