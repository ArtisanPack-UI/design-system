# CSS conventions

How component CSS is written in `@artisanpack-ui/css` (#21). Stylelint enforces the rules marked **(lint)**: `npm run lint:css`, which CI runs.

## Cascade layers

```css
@layer apui.reset, apui.tokens, apui.components, apui.utilities;
```

| Layer | Holds |
|---|---|
| `apui.reset` | A small reset, scoped to design-system markup with `:where()` |
| `apui.tokens` | The custom properties from `@artisanpack-ui/tokens` |
| `apui.components` | One stylesheet per component |
| `apui.utilities` | `.apui-sr-only` and `.apui-focus-ring` |

- Later layers win over earlier ones whatever the specificity, so a utility beats a component rule and a component rule beats the reset.
- **App CSS always wins.** Unlayered CSS beats every layer, whatever the specificity or load order, so an app overrides a token, a component rule or a utility with a plain selector and no `!important`. The cascade tests in `packages/css/test/cascade.test.ts` check this in Chromium.
- Every rule sits inside one of the four layers. Only comments, `@import` and the layer order statement may sit outside **(lint)**. Layers are not nested **(lint)**.
- No `!important` **(lint)**.

## Files

```text
packages/css/src/
├── index.css            # Layer order statement and @imports, in order
├── reset.css            # @layer apui.reset
├── components/<name>.css  # @layer apui.components, one file per component
└── utilities.css        # @layer apui.utilities
```

Each file wraps its own rules in its layer. To add a component, create `src/components/<name>.css` and import it in `index.css` between the presets and the utilities. `npm run build` inlines the imports into `dist/index.css`.

## Markup

```html
<button class="apui-button" data-variant="soft" data-color="success" data-size="sm">
  <span data-scope="button" data-part="icon" aria-hidden="true">…</span>
  Approve
</button>
```

- **One root class per component**, `.apui-<component>` in kebab-case **(lint)**. No other classes in component CSS: the spec's `.is-hover`, `.is-focus`, `.is-active` and `.is-selected` are preview-only and fail the lint.
- **Variants are data attributes:** `data-variant`, `data-color`, `data-size`, `data-surface`.
- **State is data attributes or native state:** `data-state="open"`, `data-invalid`, `data-disabled`, `data-orientation`. Prefer native pseudo-classes and ARIA where they exist (`:hover`, `:focus-visible`, `:disabled`, `[aria-expanded="true"]`).
- **Parts** carry `data-scope="<component>" data-part="<part>"`, matching Zag, so the behavior engine can emit the same attributes. Scope part selectors by `data-scope`, so a Card inside a Dialog never picks up the Dialog's `title` rule. Part names come from the [vocabulary](inventory/vocabulary.md).

```css
@layer apui.components {
  .apui-button[data-variant='soft'] { … }
  [data-scope='button'][data-part='icon'] { … }
  .apui-button[data-disabled] { … }
}
```

## Tokens

- Read semantic and component tokens, never primitives: `var(--apui-button-radius)`, `var(--apui-text-muted)`, not `var(--apui-gray-600)`.
- If a component needs a value that should be customizable, add a component token in `packages/tokens/tokens/component/<name>.json` that aliases a semantic token. Don't hard-code it.
- Private custom properties for internal plumbing are named `--apui-_<name>` and are not part of the API.
- Every custom property uses the `--apui-` prefix **(lint)**, and every class the `apui-` prefix **(lint)** ([D-002](decisions.md#d-002-the-css-namespace-is-apui)).

## Right-to-left

Logical properties only ([D-004](decisions.md#d-004-rtl-is-a-launch-requirement)):

| Instead of | Use |
|---|---|
| `margin-left`, `padding-right`, `border-left`, … **(lint)** | `margin-inline-start`, `padding-inline-end`, `border-inline-start`, … |
| `margin-top`, `border-bottom`, … **(lint)** | `margin-block-start`, `border-block-end`, … |
| `left`, `right`, `top`, `bottom` **(lint)** | `inset-inline-start`, `inset-inline-end`, `inset-block-start`, `inset-block-end` |
| `border-top-left-radius`, … **(lint)** | `border-start-start-radius`, … |
| `text-align: left`, `float: right`, `clear: left` **(lint)** | `start`, `end`, `inline-start`, `inline-end` |
| `margin: 0 4px 0 8px`, `inset: 0 auto auto 0`, `border-radius: 4px 0 0 4px` **(lint)** | The inline longhands. Shorthands are fine when left and right match |

- `width`, `height` and their `min-`/`max-` forms are allowed: they do not flip under `dir="rtl"`.
- A physical property that is genuinely needed takes a described exception, and the lint fails without the description:

  ```css
  /* stylelint-disable-next-line property-disallowed-list -- chart plots stay LTR (D-004) */
  left: 0;
  ```

- Directional icons carry `data-mirror` and flip under `[dir='rtl']`.
- Chart plots and the content of Code and Diff stay LTR. Set `direction: ltr` on the content, not on the controls around it.

## Focus

- Show focus on `:focus-visible` only, and never remove it.
- Use the ring from the tokens: a 2px ring outside a 2px gap, drawn with `box-shadow` so it follows the radius, plus a transparent outline for forced-colors mode. `.apui-focus-ring` applies it; a component can repeat the same declarations on its own `:focus-visible` rule.
- Set `--apui-focus-ring-offset-color` to the surface the control sits on when that isn't `--apui-surface-default`.
- Inside tables and grids, inset the ring so it doesn't overlap neighboring cells.

## Entry points

| Import | File | Holds |
|---|---|---|
| `@artisanpack-ui/css` | `dist/index.css` | Every layer: reset, tokens, the Ledger and Harbor presets, components, utilities |
| `@artisanpack-ui/css/headless` | `dist/headless.css` | The same without the `apui.components` layer ([D-012](decisions.md#d-012-headless-means-no-apuicomponents-layer)) |
| `@artisanpack-ui/css/tailwind` | `dist/tailwind.css` | The optional Tailwind v4 preset ([D-011](decisions.md#d-011-the-tailwind-preset-only-adds-and-apui-sits-under-utilities)) |
| `@artisanpack-ui/css/assets.php` | `dist/assets.php` | The entry points and layers as a PHP array, for the Livewire package |

### Headless mode (#25)

Headless drops the visual CSS and nothing else. The markup, ARIA and behavior from the Livewire, React and Vue packages are the same in both modes. So component CSS must never be what hides or reveals content to assistive technology: state lives in markup (`hidden`, `aria-expanded`, `data-state`), and CSS only styles it. Don't use `display: none` for a state and don't put text in `content`. The headless tests compare the DOM and the accessibility tree with and without the components layer.

### With Tailwind (#24)

Tailwind is never required. Apps that keep it put the `apui` layer between Tailwind's `base` and `components`, so Preflight never overrides a component and Tailwind utilities still win:

```css
@layer theme, base, apui, components, utilities;
@import 'tailwindcss';
@import '@artisanpack-ui/css';
@import '@artisanpack-ui/css/tailwind'; /* optional */
```

The preset only adds utilities, all generated from the semantic tokens and all following theme, density and preset at runtime:

| Tokens | Utilities |
|---|---|
| `color.*` | `bg-primary`, `text-primary-text`, `border-primary-border`, `bg-error-soft`, … |
| `surface.*` | `bg-surface-page`, `bg-surface-raised`, … |
| `text.*`, `border.*` | `text-default`, `text-muted`, `border-muted`, `border-default`, … |
| `focus-ring.*`, `state.*`, `selected.*`, `chart.*`, `syntax.*`, `backdrop` | `ring-focus-ring`, `bg-state-hover`, `bg-selected-bg`, `fill-chart-1`, `text-syntax-keyword`, `bg-backdrop` |
| `radius.control` … `overlay` | `rounded-control`, `rounded-field`, `rounded-surface`, `rounded-overlay` |
| `elevation.*` | `shadow-raised`, `shadow-overlay`, `shadow-glass` |
| `font-family.*` | `font-ui`, `font-code`, `font-display` |
| `type.<style>.*` | `text-body-md`, `text-heading-lg`, … (size, line height, weight and letter spacing) |
| `motion.ease-*` | `ease-standard`, `ease-enter`, `ease-exit` |
| `control-height.*`, `icon-size.*` | `h-control-md`, `size-icon-sm`, … |
| `panel.*`, `row.height`, `cell.padding-x`, `field.gap` | `p-panel-padding`, `gap-panel-gap`, `h-row-height`, `px-cell-padding-x`, `gap-field-gap` |
| `content-max-width`, `measure` | `max-w-content`, `max-w-measure` |

The preset never redefines a Tailwind default, so Tailwind's `font-sans` stays as the app set it. To make it Geist, add `--font-sans: var(--apui-font-family-sans);` to your own `@theme`.

## Theme, density, preset and surface

- An element with `data-theme` resets its text color to `--apui-text-default` and sets `color-scheme`, so inherited text follows the theme. It does not paint a background: put a themed region on a surface (a component or `background: var(--apui-surface-page)`).
- Theme, density and preset are attributes on any element: `data-theme="light | dark | high-contrast"`, `data-density="compact | default | comfortable"`, `data-preset="ledger | harbor | <brand>"`. Component CSS never checks them. It reads tokens, which the attributes reassign. See [docs/tokens](tokens/README.md#modes) and [presets](tokens/README.md#presets-23).
- Density changes spacing through `--apui-panel-padding`, `--apui-panel-gap`, `--apui-row-height`, `--apui-cell-padding-x`, `--apui-field-gap` and the component tokens that alias them. It never changes control sizes.
- Glass is a surface: `data-surface="glass"` on a container ([D-006](decisions.md#d-006-glass-is-a-surface-not-a-theme-preset)). It falls back to `--apui-surface-raised` under `prefers-reduced-transparency`, without `backdrop-filter` support, and in high contrast.

## Motion

Use the motion tokens (`--apui-motion-duration-fast`, `--apui-motion-ease-standard`, …). Under `prefers-reduced-motion: reduce`, remove movement or slow spinners down, as the spec does.
