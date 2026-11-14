---
'@artisanpack-ui/css': minor
'@artisanpack-ui/manifest': minor
'@artisanpack-ui/behavior': minor
'@artisanpack-ui/testing': minor
---

Add the Form and Navigation waves, the Combobox family, DatePicker and Spotlight (#53 to #57, D-020 to D-028).

- `@artisanpack-ui/manifest` adds 26 manifests with docs examples: Textarea, Password, Pin, Range, Toggle, Fieldset, Form, ValidationSummary, RadioGroup, CheckboxGroup, Rating, ColorPicker, File, Signature, RichTextEditor, CodeEditor, Combobox, DatePicker, Breadcrumbs, Link, Pagination, Steps, Tabs, Menu, Navbar and Spotlight. Select's `options` takes `{ label, options }` groups (D-025).
- `@artisanpack-ui/css` ships each of them in `apui.components`. Combobox and DatePicker reuse the shared field anatomy in `field.css`.
- `@artisanpack-ui/behavior` adds the Tabs, DatePicker (with a `time` mode) and ColorPicker widgets on Zag (`@zag-js/tabs`, `@zag-js/date-picker`, `@zag-js/color-picker`), Spotlight on the dialog and combobox machines, and the `form` helpers for Signature, RichTextEditor and CodeEditor. Each has an Alpine component (`apuiTabs`, `apuiDatePicker`, `apuiColorPicker`, `apuiSpotlight`, `apuiSignature`, `apuiRichTextEditor`, `apuiCodeEditor`) and React and Vue hooks where there's a machine. The combobox widget gains chips, create, `max`, loading, debounced remote search, match marks, hidden inputs for `name` and translatable labels; its `control` and `input` parts render as `box` and `control` through the new `repart()`. More Lucide icons for the new components.
- `@artisanpack-ui/testing`: the Vue host passes a fixture's `value` as `modelValue` when the component declares it; the manifest a11y check reads Chromium's `image` role as `img`; `ManifestParity` knows the new widgets' events (`apuiCombobox`, `apuiSpotlight`, `apuiDatePicker`, `apuiColorPicker`); and the PHP twins test reads the example list instead of the pilot names.
