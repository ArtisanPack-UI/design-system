### Replace raw DaisyUI classes

Markup that used DaisyUI classes directly (`btn`, `card`, `badge`, `bg-base-200`) has no styles once DaisyUI is gone. The upgrade tool lists every one with its file and line and **never rewrites them**, because the right replacement depends on the element. For each:

| You have | Use instead |
|---|---|
| A component class: `btn`, `badge`, `card`, `alert`, `tab`, `modal`, `tooltip`, … | The component. `<a class="btn btn-primary">` is a Button with `href`. Where you need the bare markup, the `apui-` class and data attributes: `class="apui-button" data-color="primary"` |
| A size or color modifier: `btn-sm`, `badge-success`, `alert-warning` | The component's `size` and `color` props (`data-size`, `data-color` on bare markup) |
| `input`, `select`, `textarea`, `checkbox`, `toggle`, `label` on native controls | The form components, which draw the label, hint and error too |
| `bg-base-100` | `bg-surface-default` with the Tailwind preset, or `background: var(--apui-surface-default)` |
| `bg-base-200` | `bg-surface-sunken` · `var(--apui-surface-sunken)` |
| `bg-base-300`, `border-base-300` | `border-default` · `var(--apui-border-default)`; as a background, `bg-surface-sunken` |
| `text-base-content` | `text-default` · `var(--apui-text-default)` |
| `text-base-content/70`, `/60`, `/50` | `text-muted` · `var(--apui-text-muted)`. `text-subtle` for the faintest text. Opacity on text is gone: the tokens are checked for contrast, an opacity isn't |
| `text-primary-content`, `text-error-content`, … | The color's own foreground: `text-primary-foreground`, `text-error-foreground` · `var(--apui-color-primary-foreground)`, `var(--apui-color-error-foreground)` |
| `bg-primary`, `text-error`, `border-success` | Unchanged with the Tailwind preset. Without Tailwind, the color's own token: `var(--apui-color-primary)`, `var(--apui-color-error)`, `var(--apui-color-success)` |
| `rounded-box`, `rounded-btn` | `rounded-surface`, `rounded-control` · `var(--apui-radius-surface)`, `var(--apui-radius-control)` |

The tool marks names such as `input`, `table`, `link` and `label` as "may be": they are DaisyUI classes and also common class names of your own. Check each.

Left and right are logical now. Use `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*` and `end-*` next to components so layouts mirror in right-to-left languages.
