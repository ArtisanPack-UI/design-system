### Repoint theme variables

DaisyUI's custom properties are gone, and nothing aliases them. The tool lists each reference:

| DaisyUI | Token |
|---|---|
| `--color-base-100` | `--apui-surface-default` |
| `--color-base-200` | `--apui-surface-sunken` |
| `--color-base-300` | `--apui-border-default` |
| `--color-base-content` | `--apui-text-default` |
| `--color-primary`, `--color-error`, … | `--apui-color-primary`, `--apui-color-error`, … |
| `--color-primary-content` | `--apui-color-primary-foreground` |
| `--radius-box` | `--apui-radius-surface` |
| `--radius-field` | `--apui-radius-field` |
| `--radius-selector` | `--apui-radius-control` |
| `var(--p)`, `var(--b1)`, `var(--bc)` (DaisyUI 4) | The same tokens as above |

`--color-*` is also a Tailwind theme namespace, so some of these may be yours and not DaisyUI's. The tool can't tell; you can.

### Themes and presets

| Before | Now |
|---|---|
| `data-theme="light"` or a DaisyUI theme name | `data-theme="light"`, `"dark"` or `"high-contrast"`. With no attribute the page follows the system setting |
| A custom DaisyUI theme, or a generated theme file | A **preset**: a named set of token values switched with `data-preset`. `ledger` and `harbor` ship with the CSS |
| Glass props with tints and opacities | `surface="glass"` on the component; the look comes from the glass tokens |
| Per-component color overrides | Tokens. Set `--apui-color-primary` and the rest once, in a preset |

Theme, preset and density (`data-density="compact"`) combine, and any element can set them for its subtree.
