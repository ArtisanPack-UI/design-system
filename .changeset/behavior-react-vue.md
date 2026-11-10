---
'@artisanpack-ui/behavior': minor
---

Add the React and Vue adapters (#36): `useDialog` and `useCombobox` from `@artisanpack-ui/behavior/react` (hooks) and `@artisanpack-ui/behavior/vue` (composables). They run the same Dialog and Combobox definitions through Zag's framework adapters, so parts, ARIA, `data-scope` and `data-part` match the Alpine adapter, which a parity test checks. State is controlled (`open`, `value` with `onOpenChange`, `onValueChange`) or uncontrolled (`defaultOpen`, `defaultValue`). `@zag-js/react`, `@zag-js/vue`, `react` and `vue` are optional peer dependencies.
