# Design spec

The Phase 1 output (#10): the visual direction and a design spec for every component. This is the **visual target** for Phases 2 to 5. It is not shipped code.

**Direction:** Strata + edges ([D-005](../docs/decisions.md#d-005-visual-direction-strata--edges)). Depth comes from tone steps plus a hairline edge on every surface. Controls are round, containers rectangular. Ledger and Harbor ship as alternate presets built from token values only.

## What's here

| Path | What it is |
|---|---|
| [brief.md](brief.md) | The Claude Design brief and the answers that shaped it (#11) |
| [direction.md](direction.md) | Reference principles, the three directions considered, and why Strata + edges won (#13). Written before the `apui` rename, so it uses the old names |
| [brand-book.md](brand-book.md) | The system's rules: principles, tokens, color roles, type, spacing, density, radius, elevation, focus, glass, RTL, icons, components |
| [presets.md](presets.md) | Ledger and Harbor as token diffs against Strata |
| `tokens/tokens.json` | Every token value, in the design tool's list format (not DTCG). Light, dark and high-contrast |
| `tokens/tokens.css` | The same tokens compiled to `--apui-*` custom properties. Generated; used by the previews |
| `css/components.css` | Reference CSS for all components, following #21 |
| `types/components.d.ts` | Props for every component, as documentation |
| `components/<Name>/` | Per component: `README.md` (anatomy, props, accessibility, do and don't) and `preview.html` (variants, sizes, states, surfaces) |
| `foundations/` | Foundations sheet, presets comparison, cover |
| `examples/` | Dashboard, long form, dense table (two densities), auth, two-brand re-theme, RTL. These are the four reference screens from #12 plus the customizability and RTL tests from #13 |
| `screens/` | PNG renders of every preview in light, dark and high-contrast, for review and issue comments |
| [issue-map.json](issue-map.json) | Which issue each component's spec belongs to |

## Viewing a preview

Open any `preview.html` in a browser. Add `?theme=dark` or `?theme=high-contrast` to switch theme. Fonts load from Google Fonts.

## How to use this spec

- **Tokens:** #20 turned `tokens/tokens.json` into DTCG JSON in `packages/tokens/tokens/` ([schema](../docs/tokens/README.md)). That JSON is now the source of truth, and design changes are proposed as diffs against it. Keep the token names; they follow the token audit.
- **CSS:** `css/components.css` shows the intended selectors, data attributes, parts and token use. Rebuild it properly in `@artisanpack-ui/css`, one file per component, with component-tier tokens in place of the private `--apui-_x` variables.
- **Components:** each component's `README.md` and `preview.html` are its "Claude Design spec" step. Design sign-off means the built component matches its preview in every variant, size, state and theme.
- **Preview-only:** `.is-hover`, `.is-focus`, `.is-active` and `.is-selected` force states in the previews. Don't ship them. The placeholder photos are drawn SVG landscapes.

## Known limits

- Previews are static HTML and CSS. Behavior (keyboard, focus management, positioning) is specified in each README and comes from `@artisanpack-ui/behavior`.
- RichTextEditor, CodeEditor, ColorPicker, Signature and Calendar are styled shells. Their engines are separate decisions (D-003 covers RichTextEditor).
- Contrast was checked by script for every text, edge and focus pair against every surface, in all three themes. Glass contrast was checked against black, white, red and blue backdrops at the 80% opacity floor.
