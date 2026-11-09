# Direction exploration

> **Note:** this record predates the `apui` alignment. Token and class names below are the original working names (for example `edge-subtle` is now `--apui-border-muted`, `.ap-btn` is now `.apui-button`). The brand book and `tokens.json` hold the current names.

The Step 1 record: what the reference board says, the three directions considered, and why **Strata + edges** was chosen as the default with Ledger and Harbor as presets. Kept for context; the brand book and `tokens.json` are the source of truth.

## 1. What the references are saying

Fourteen of the fifteen boards were readable. The ClyHealth healthcare board (AVIF) didn't come through, so it isn't counted here.

### P1. Elevation is a change in tone, not a shadow
In Socials, Weathry, G.Take, AdminDash and the music board, panels aren't white boxes on grey. Each layer is the same hue family one lightness step up from the one below. There are almost no visible drop shadows. Depth comes from **value**, which is why these screens feel calm even when they're dense. This works in dark mode, where shadows disappear anyway.

### P2. The interface sits in a place
Socials floats over a real room, Horizon over an office, G.Take over a night sky, Glazzed over a blurred color field. The ground under the app is part of the design, and translucency is applied to **the shell** (nav rail, toolbar, the outer frame), not to every card. The content itself stays nearly opaque and readable. That's the principled version of "glass": one layer that shows the context, and solid layers for the work.

### P3. Chrome is neutral; color belongs to data and to one action
The navigation, panels and labels are almost colorless in nearly every board. Color shows up in two places only:
- **Categories and status**, as low-chroma tints (onetask's event cards, Coinview's asset cards, the music board's stat tiles, the status pills in the loan table).
- **One action per view**: Socials' blue "New Page", Horizon's orange "Add Property", Apexify's "Share".

So the neutral default you asked for is already what you're drawn to. The trick is a strong `soft` variant, not a strong brand color.

### P4. One loud thing per view
Horizon highlights one bar in the mortgage chart and one in revenue. Apexify fills one stat card. G.Take lights up one task row. Socials puts a single average line through the chart. These screens make **emphasis by exception**: everything is quiet except the thing that matters. That needs an `emphasis` token tier (a highlighted row, a featured stat, a selected series) rather than more variants.

### P5. Controls and containers have different shapes
Buttons, filters, search fields, tabs and nav items are pills or circles (Socials, G.Take, Horizon, the liquid-glass kit). Panels are moderately rounded rectangles. The contrast between the **round control** and the **rectangular container** carries much of the "considered" feeling, and inner radii are always smaller than outer ones. Radius is a relationship, not one number.

### P6. Big numerals, small labels, light weights
Stat values are large and set at regular or medium weight, not bold. Labels are small and muted (Socials' "263,650 / Followers", Glazzed's thin "16k Total balance", Weathry's readings). Hierarchy comes from **size and contrast**, not weight. This needs a typeface with good tabular figures, and it's a big part of why these don't look like DaisyUI, where everything is semibold.

### P7. Navigation is detached from content
Socials' icon rail and URL bar, onetask's separate sidebar, and Horizon's floating top bar all sit apart from the main panel with a visible gap. The AppShell is a set of **islands with gutters**, not a sidebar welded to a header. That's a layout decision expressed as one spacing token, the shell gutter, and it mirrors cleanly in RTL.

### Bonus: what the references hide
- **Almost all of them are dark.** What you like is mostly dark-mode tonal layering. So dark has to be designed as its own theme, not inverted from light, and the light theme needs its own way to make depth (P1) without falling back on heavy shadows.
- **The AI look you want to avoid has a definition:** claymorphism, rim-lit 3D blobs, characters, iridescent glass edges and glow halos (the music board and the liquid-glass kit). All of them simulate a physical material. The rule that keeps us out: **surfaces are flat fills plus at most one blur. No simulated light sources, no inner glows, no gradient strokes.**
- **The dense boards (Glazzed, AdminDash, the loan table) get structure from hairlines,** not padding. Header bars split their actions with vertical rules, and rows split with 1px dividers. That's the pattern that will hold up in data-heavy screens.

---

## 2. Three directions

All three share the fixed constraints: the same variants, colors, sizes, surfaces, densities and themes, WCAG 2.2 AA, logical properties for RTL, and open-licensed fonts and icons. Icons for all three: **Lucide** (ISC), at stroke 1.5 for A and C and 1.75 for B. They differ in **how a surface is separated from the one next to it**: tone, line or space.

| | A · Strata | B · Ledger | C · Harbor |
|---|---|---|---|
| Separates surfaces by | **tone** | **lines** | **space + soft shadow** |
| Default rhythm | medium | tight | airy |
| Corners | mixed (pill controls, 14px panels) | near-square (2–6px) | soft (pill controls, 20px panels) |
| Elevation | lightness steps | none, borders | layered soft shadows (light), tone (dark) |
| Body type | Geist 14 | IBM Plex Sans 14 / 13 | Hanken Grotesk 15 with Bricolage Grotesque display |
| Default primary | steel blue | a conventional working blue | ink (near black/near white) |

---

### A · Strata

**Idea:** depth through tone. Each layer is one measured lightness step from the layer below, with no borders or shadows, and glass is reserved for the floating shell.

**Draws on:** Socials, Weathry, G.Take, AdminDash, Horizon (P1, P2, P5, P7).
**Best for:** admin panels and back offices, CMS, SaaS settings, anything that runs mostly in dark mode. It's the most direct translation of the board.

**Type**
- Geist Sans (OFL) 400 / 500 / 600, Geist Mono for IDs, SKUs and code. `font-variant-numeric: tabular-nums` on every numeric part.
- Scale 1.2 from 14px: 12 / 13 / **14** / 16 / 19 / 23 / 28 / 34 / 41. Line heights 16 / 18 / 20 / 24 / 26 / 30 / 34 / 40 / 46.
- Stat values 28 or 34 at weight 500, tracking −0.02em. Labels 12 / 500, muted, sentence case. Headings go no heavier than 600.

**Spacing**
- 4px base: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Panel padding by density: 16 / **20** / 24. Panel gap 12. Shell gutter (P7) 12.
- Control heights xs–xl: 24 / 28 / **36** / 44 / 52. Table row: 32 / **40** / 48.

**Radius**
- Controls (button, tabs, badge, toggle, filter chip): `full`.
- Inputs, select, textarea, date picker: 10px. Pill text fields break in long forms and multi-line, so text entry stays rectangular.
- Panels 14px, overlays (dialog, menu, toast) 16px, inner chips and thumbs 6px.
- Rule: `inner radius = outer radius − padding`, floored at 4px.

**Elevation**
- Five surface tokens, each one lightness step apart (OKLCH L):

| surface | light | dark |
|---|---|---|
| sunken | 94.5% | 14% |
| canvas | 96.5% | 17% |
| default (panel) | 99% | 21% |
| raised | 100% | 25% |
| overlay | 100% + shadow | 28% + shadow |

- One shadow token, for overlays only: `0 8px 24px oklch(0% 0 0 / .18)` light, `/ .40` dark.
- Panel borders are `transparent` in light and dark, then **1px visible in high-contrast**. That's a theme reassignment, not an override.

**Color**
- Neutrals are tinted toward the primary's hue at chroma 0.006–0.010 through one `neutral-hue` token. Swap the primary and the greys shift with it, which is what makes a rebrand feel native.
- Default primary: steel blue `oklch(55% 0.12 235)`. Accent: amber `oklch(72% 0.13 75)`, used for P4 emphasis (the one highlighted bar or row).
- Soft variant = the color at 14% over the surface in light and 22% in dark, with text at the color's 35% or 85% L step so it reaches 4.5:1.

**Glass:** used on the AppShell's nav rail and top bar only. `surface-default` at 72% alpha, `backdrop-filter: blur(20px) saturate(140%)`, a 1px top edge at 8% white. It falls back to solid `surface-raised` under `prefers-reduced-transparency` or without backdrop-filter support.

**Focus:** a double ring, 2px gap in the current surface color plus 2px `focus` color. It reads on every tonal step. The `focus` token is set per theme to reach 3:1 against all five surfaces.

**Risk:** in light mode, tone steps are subtle. Panels on canvas need careful L values, or the layout reads as one flat sheet on cheap monitors.

---

### B · Ledger

**Idea:** structure through lines. Flat planes divided by hairlines, tight rhythm, near-square corners. It's built to stay legible at 200 rows.

**Draws on:** Glazzed, AdminDash, the loan table, Apexify's transaction history (P3, P6, and the hairline note above).
**Best for:** dense admin, reporting, long forms, healthcare and enterprise, ecommerce order management. It's the strongest direction for the "has to hold up in data-heavy screens" requirement.

**Type**
- IBM Plex Sans (OFL) 400 / 500 / 600, IBM Plex Mono for codes and numbers in tables. Tabular figures on everything numeric.
- Scale 1.143 from 14px: 11 / 12 / 13 / **14** / 16 / 18 / 21 / 24 / 30. Tight line heights 14 / 16 / 18 / 20 / 22 / 24 / 28 / 30 / 36. Compact density drops body to 13.
- Section labels and table headers: 11 or 12, weight 500, uppercase, +0.04em tracking. This is the editorial voice that gives it a point of view. Stat values 24 or 30 at weight 400 (Glazzed's thin numerals).

**Spacing**
- 4px base, same steps as A, smaller defaults.
- Panel padding 12 / **16** / 20. Panels share 1px borders in dense layouts, or sit 16 apart.
- Control heights 22 / 26 / **32** / 38 / 44. Table row 28 / **36** / 44.
- Panel header bar: 40px tall, title at inline-start, actions at inline-end separated by vertical 1px rules (Glazzed).

**Radius:** badge 2, controls 4, panels 6, overlays 8. Only Avatar and Toggle are round.

**Elevation**
- No shadows on in-page surfaces. `border-subtle` is for dividers, at L 92% light / 27% dark. `border-default` is for control outlines, at ≥3:1 against its surface (WCAG 1.4.11). `border-strong` is for the raised surface and the selected row.
- Sunken = one tone step down. Raised = same tone + `border-strong`.
- Overlays: border plus a single shadow `0 4px 12px oklch(0% 0 0 / .12)`.

**Color**
- Pure neutrals (chroma 0). Nothing in the chrome carries a hue, so any brand drops in cleanly.
- Default primary: a working blue `oklch(52% 0.17 260)`, used for actions, links, selection and focus only.
- Status uses a soft badge with a 1px border in the status color plus an icon. It never uses color alone and never a colored left edge.

**Glass:** sticky table header and command palette only. Surface at 85% alpha, `blur(12px)`, hairline bottom border. It's there so scrolling rows stay legible underneath, not for looks.

**Focus:** 2px solid outline with a 1px offset. Table cells and grid items use a −2px inset outline so focus doesn't spill into neighboring cells.

**Risk:** it can feel severe on auth and marketing pages, and closest to "enterprise default" if the type and label voice aren't executed well.

---

### C · Harbor

**Idea:** structure through space. Soft islands on a tinted canvas, separated by generous gutters and low, layered shadows, with expressive display type carrying the personality.

**Draws on:** Coinview, Socials' floating controls, onetask's tinted event cards, the music board's tinted stat tiles without the clay (P3, P5, P7).
**Best for:** auth and marketing pages, ecommerce storefront and account areas, consumer-facing dashboards, small-business products. It's the friendliest of the three, and the one most likely to read as a product rather than a framework.

**Type**
- Display: Bricolage Grotesque (OFL, variable optical size) at 600 for page titles, stat values and hero headings. Body: Hanken Grotesk (OFL) 400 / 500 / 600. Mono: JetBrains Mono (OFL).
- Scale 1.25 from 15px: 12 / 13 / **15** / 17 / 20 / 24 / 30 / 38 / 48 / 60. Line heights 16 / 18 / 22 / 24 / 28 / 30 / 36 / 42 / 52 / 62.
- Stat values 38 / 600, tracking −0.03em. The display face appears only at 20px and up, so dense UI stays in the quiet body face.

**Spacing**
- 4px base, generous defaults.
- Panel padding 20 / **24** / 32. Island gap 16, canvas margin 24, shell gutter 16.
- Control heights 28 / 32 / **40** / 48 / 56. Table row 36 / **48** / 56.

**Radius:** controls `full`, inputs 12, cards 20 (never more), inner 12, overlays 24. Guardrail against "oversized rounded cards": a card radius never exceeds 20px or ⅙ of its height, whichever is smaller.

**Elevation**
- Light theme uses shadows, kept low and layered:
  - e1 `0 1px 2px oklch(0% 0 0 / .04), 0 2px 8px oklch(0% 0 0 / .04)`
  - e2 `0 4px 16px / .06`
  - e3 `0 12px 32px / .10`
- Dark theme drops shadows (they don't read) and switches to tone plus a 1px top highlight at 6% white. The elevation tokens are reassigned per theme, which is exactly what the semantic tier is for.
- Canvas is tinted (`oklch(95.5% 0.01 <neutral-hue>)`), and islands are white.

**Color**
- Default primary is **ink**: near-black in light, near-white in dark. It's the most neutral starting point, and a rebrand is one token.
- Personality comes from the `soft` variant used as **category fills**. Stat tiles, calendar events and asset cards each take a soft semantic color (Coinview, onetask). `accent` is the single highlight.

**Glass:** the floating toolbar or nav pill and the dialog scrim. Surface at 60% alpha with `blur(24px)`. Cards are never glass.

**Focus:** a halo, 2px canvas-colored gap plus 2px `focus` (primary at a contrast-checked step). Because the controls are pills, the ring follows `border-radius: inherit`.

**Risk:** it's the weakest in a 200-row table, where the airy rhythm costs a lot of vertical space even at compact. The display face also has to be easy to swap, because it carries so much of the personality.

---

## 3. Judged as a component library

A component never knows what it will be placed on. That changes how the three directions rank.

- **Tone-only separation (pure Strata) depends on context.** A raised card on a raised background vanishes, and so does a glass card over a flat area. **Fix:** every surface gets an `edge` token, a 1px hairline. It's subtle in light and dark, `transparent` where a developer wants it gone, and solid in high-contrast. Inputs need a 3:1 outline under WCAG 1.4.11 anyway.
- **Shadow-led separation (Harbor) only works in light mode,** so half of the system would run on a different idea. Shadows stay for overlays.
- **Line-led separation (Ledger) is the most reliable,** but on its own it reads as enterprise default, and glass looks out of place on flat hairline planes.

**Proposed base: Strata + edges.** Its pieces:
- Tonal surfaces with a hairline edge on each
- Pill controls, rectangular text fields and 14px containers, with Harbor's inner/outer radius rule
- Ledger's compact density and uppercase label voice for tables and long forms
- Harbor's soft variant as the category and status tint

Glass is then one more surface: tone + alpha + blur + edge. It needs a minimum opacity token that keeps text at 4.5:1 over any backdrop, and it falls back to solid.

Because all three directions use the same token structure, Ledger and Harbor can later ship as **alternate presets** that only reassign token values. That's the strongest proof of customizability the system could offer.

## 4. Proposed Step 2, re-scoped for components

- **Component sheets per direction:** all 24 components with their variants, sizes, states (hover, focus, disabled, invalid, loading) and the four surfaces, in light and dark.
- **One composed example per direction** (table, form, overlay stack) to check that the components hold up together and in density.
- Foundations sheet, the compact vs comfortable density comparison, a two-brand re-theme and RTL, as originally planned.

The ClyHealth board still needs re-attaching as PNG or JPG.
