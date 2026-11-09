# Design tokens

The tokens' source of truth is W3C DTCG JSON in [`packages/tokens/tokens/`](../../packages/tokens/tokens) (#18, [D-008](../decisions.md#d-008-token-source-format-and-build)). One build turns it into CSS custom properties, a typed TypeScript map and a PHP array (#19). The values come from the Phase 1 spec in [`design/tokens/tokens.json`](../../design/tokens/tokens.json) (#20). From now on, design changes arrive as diffs against the DTCG JSON, not against the spec file.

## Layout

```text
packages/tokens/
├── tokens/                     # DTCG source, edited by hand
│   ├── primitive/*.json        # Raw scales: color ramps, space, radius, font weights, durations, easings
│   ├── semantic/*.json         # Roles that hold one value: radius roles, sizes, type styles, motion, z-index
│   ├── component/<name>.json   # One file per component
│   └── modes/
│       ├── theme/{light,dark,high-contrast}.json
│       └── density/{compact,default,comfortable}.json
├── generated/                  # Build output, committed
│   ├── tokens.css              # @artisanpack-ui/tokens/css
│   └── tokens.php              # @artisanpack-ui/tokens/php
├── src/generated/tokens.ts     # Build output, committed; compiled into the package entry
└── scripts/build-tokens.mjs    # The build
```

- The directory decides the tier. Nothing else may sit in `tokens/`, and only `.json` files go in a tier directory.
- Files group related tokens (`primitive/color.json`, `component/button.json`). Splitting or merging files never changes a token's name.
- Every file is plain DTCG: a tree of groups and tokens.

## Tiers

| Tier | Holds | May reference |
|---|---|---|
| **primitive** | Raw values: `gray.0` … `gray.1000`, `steel.*`, `space.4`, `radius.lg`, `duration.150` | Nothing. Primitives are always literal |
| **semantic** | Roles: `color.primary`, `surface.raised`, `text.muted`, `radius.control`, `panel.padding`, `type.body-md.font-size` | Primitives and other semantic tokens |
| **component** | Per-component values: `button.radius`, `card.padding`, `table.row-height` | Any tier |

Mode files (`modes/<axis>/<mode>.json`) hold semantic tokens whose value changes with the mode.

Component CSS reads semantic and component tokens, never primitives. Themes and presets reassign semantic and component tokens only.

## Names

- **Segments** are lowercase letters and digits, with single hyphens: `^[a-z0-9]+(-[a-z0-9]+)*$`. DTCG forbids `.` in names, so half steps are hyphenated (`space.0-5`).
- **Path** is the segments joined with `.`: `color.primary-soft-foreground`. Aliases and the TypeScript and PHP maps use the path.
- **Custom property** is `--apui-` plus the segments joined with `-`: `--apui-color-primary-soft-foreground` ([D-002](../decisions.md#d-002-the-css-namespace-is-apui)). Two paths that would produce the same property are rejected.
- Keep the token audit's names ([token-audit.md](../inventory/token-audit.md)), which the spec also uses. `--apui-text-*` is color, so type styles live under `type.*`.

## Tokens and groups

- A **token** is an object with `$value`. It may also have `$type`, `$description`, `$extensions` and `$deprecated`, and nothing else. A token has no children.
- A **group** is any other object. It may have `$type`, `$description` and `$extensions`. A group's `$type` applies to every token inside it that doesn't set its own.
- A token whose type is neither set nor inherited takes the type of the token it aliases. Otherwise it is an error.

## Types and values

Values use the DTCG 2025.10 object forms.

| `$type` | `$value` | CSS |
|---|---|---|
| `color` | `{ "colorSpace": "srgb", "components": [r, g, b], "alpha": 1, "hex": "#rrggbb" }` or `{ "colorSpace": "oklch", "components": [l, c, h], "alpha": 0.8 }` | `#rrggbb`, `rgb(r g b / a)`, `oklch(l% c h / a)` |
| `dimension` | `{ "value": 16, "unit": "px" }` | `16px` (`0` for zero) |
| `duration` | `{ "value": 150, "unit": "ms" }` | `150ms` |
| `cubicBezier` | `[0.4, 0, 0.2, 1]` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `fontFamily` | `"Geist"` or `["Geist Mono", "ui-monospace", "monospace"]` | `"Geist Mono", ui-monospace, monospace` |
| `fontWeight` | An integer from 1 to 1000 | `500` |
| `number` | A number | `1.2` |
| `shadow` | A layer `{ color, offsetX, offsetY, blur, spread, inset? }` or an array of them. `[]` is no shadow | `0 8px 24px 0 rgb(16 20 24 / 0.16), …` or `none` |

Project rules on top of DTCG:

- **Dimension units:** `px` and `rem` as in DTCG, plus `em` (letter spacing) and `ch` (`measure`). Tools that only know the DTCG units will flag those three tokens.
- **Color spaces:** `srgb` and `oklch` only. An `srgb` color needs a lowercase 6-digit `hex`, which must match its components. That keeps the CSS output exact. `oklch` colors carry no hex.
- **Font weights** are numbers, not keywords.
- Type styles are groups of single-value tokens (`type.body-md.font-size`, `.line-height`, `.font-weight`, `.letter-spacing`, `.font-family`) rather than the DTCG `typography` composite, because the spec's line heights are lengths and the composite only allows a multiplier.

## Aliases

- An alias is a whole value of the form `{path}`, such as `"$value": "{gray.900}"`. Inside a shadow, any field can be an alias. Partial interpolation (`"{space.1} 2px"`) is not supported.
- The target must exist, have the expected type, and not be in a later tier (see [Tiers](#tiers)). Cycles are errors.
- In CSS an alias becomes `var(--apui-…)`, so overriding a primitive or semantic token cascades to everything that references it.

## Modes

Two axes, each switched by an attribute on any element:

| Axis | Attribute | Modes | Default |
|---|---|---|---|
| theme | `data-theme` | `light`, `dark`, `high-contrast` | `light` |
| density | `data-density` | `compact`, `default`, `comfortable` | `default` |

- Each mode is one file. Every mode file of an axis defines the same tokens, and a mode token is not defined anywhere else.
- A mode token may only vary by its own axis.
- The CSS output declares mode tokens on `[data-<axis>="<mode>"]`, and the default mode on `:root` too. A custom property that references another is computed where it is declared, so the build also re-declares every token that aliases a mode token in each block of that axis. That is why `--apui-card-padding: var(--apui-panel-padding)` follows `data-density` inside a subtree.
- The default block comes first in each axis, so `<html data-density="compact">` wins over `:root` at equal specificity.

### Density (#22)

Density changes spacing, never control sizes. To make controls smaller in a dense screen, pick a smaller size.

| Token | compact | default | comfortable |
|---|---|---|---|
| `--apui-density` | 0.8 | 1 | 1.2 |
| `--apui-panel-padding` | 16px | 20px | 24px |
| `--apui-panel-gap` | 8px | 12px | 16px |
| `--apui-row-height` | 32px | 40px | 48px |
| `--apui-cell-padding-x` | 8px | 12px | 16px |
| `--apui-field-gap` | 12px | 16px | 24px |

The per-mode values are tokens too (`--apui-panel-padding-compact` and so on), so a preset can change them. Component spacing aliases the semantic density tokens: `card.padding`, `table.row-height`, `table.cell-padding-x` and `menu.item-height`. For spacing of your own, multiply by the density: `calc(var(--apui-space-4) * var(--apui-density))`.

```html
<html data-density="compact">
  …
  <section data-density="comfortable">Roomier inside here.</section>
</html>
```

## Outputs (#19)

| Output | Import | Shape |
|---|---|---|
| CSS | `@artisanpack-ui/tokens/css` | Custom properties inside `@layer apui.tokens`: a `:root` block, then one block per mode |
| TypeScript | `@artisanpack-ui/tokens` | `tokens[path]` = `{ cssVar, type, tier, axis, varies, value, resolved }`, plus `axes`, `prefix`, `layer`, the `TokenPath` type and `cssVar(path)` |
| PHP | `@artisanpack-ui/tokens/php` | `return [ 'prefix', 'layer', 'axes', 'tokens' ]`, with the same per-token fields |
| DTCG source | `@artisanpack-ui/tokens/dtcg/*` | The source files, for design tools |

In the TS and PHP maps, `value` is the CSS with aliases as `var()`, one per mode for mode tokens. `resolved` is the final CSS value, one per mode when the token varies by an axis.

The outputs are committed. `npm run build` checks them first and fails if the source changed without them, so CI catches stale outputs.

## Changing tokens

1. Edit the JSON in `packages/tokens/tokens/`.
2. Run `npm run tokens` (from the root or `packages/tokens`) to validate and regenerate.
3. Run `npm test --workspace @artisanpack-ui/tokens`. Besides the schema and output tests, it checks:
   - **Contrast:** WCAG 2.2 AA for every semantic pair in every theme. Text roles need 4.5:1 on every surface; control edges and focus need 3:1; glass text is checked over black, white, red and blue backdrops.
   - **Spec fidelity:** every token in `design/tokens/tokens.json` exists under its name with the same value. A deliberate change to a spec value also needs the spec updated, or a recorded decision.
   - **Phase 0 map:** every target in the token audit either exists or has a resolution in [`phase-0-map.json`](phase-0-map.json).
4. Commit the source and the regenerated outputs together.

## Motion

The spec defines no motion tokens. The primitives are the 1.x duration scale and the four standard easings, which the Phase 0 audit found identical across stacks. The expressive spring, bounce and elastic curves are dropped. Components use the semantic tokens: `motion.duration-fast` (150ms), `-moderate` (200ms), `-slow` (300ms), `motion.ease-standard`, `-enter` and `-exit`. Reduced motion is handled in each component's CSS, as the spec does.
