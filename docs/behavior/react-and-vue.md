---
title: React and Vue
menu_order: 2
---

# React and Vue

The hooks (React) and composables (Vue) run the same widget definitions as the Alpine plugin, through Zag's own framework adapters. Each returns Zag's API: state such as `open` and `value`, actions, and a `get<Part>Props()` function per part to spread (React) or `v-bind` (Vue) onto the element.

```bash
npm install @artisanpack-ui/behavior @zag-js/react   # or @zag-js/vue
```

`@artisanpack-ui/react` and `@artisanpack-ui/vue` already depend on these.

## React

```tsx
import { useDialog } from '@artisanpack-ui/behavior/react';
import { useState } from 'react';

function EditProfile() {
  const [open, setOpen] = useState(false);
  const dialog = useDialog({ open, onOpenChange: ({ open }) => setOpen(open) });

  return (
    <>
      <button {...dialog.getTriggerProps()}>Edit profile</button>
      <div {...dialog.getBackdropProps()} />
      <div {...dialog.getPositionerProps()}>
        <div {...dialog.getContentProps()}>
          <h2 {...dialog.getTitleProps()}>Edit profile</h2>
          <button {...dialog.getCloseTriggerProps()}>Cancel</button>
        </div>
      </div>
    </>
  );
}
```

## Vue

Composables take their options as an object, a ref or a getter, so they can follow props, and return a computed API:

```vue
<script setup lang="ts">
import { useDialog } from '@artisanpack-ui/behavior/vue';

const open = defineModel<boolean>('open', { default: false });
const dialog = useDialog(() => ({
  open: open.value,
  onOpenChange: (details) => (open.value = details.open),
}));
</script>

<template>
  <button v-bind="dialog.getTriggerProps()">Edit profile</button>
  <div v-bind="dialog.getBackdropProps()" />
  <div v-bind="dialog.getPositionerProps()">
    <div v-bind="dialog.getContentProps()">
      <h2 v-bind="dialog.getTitleProps()">Edit profile</h2>
      <button v-bind="dialog.getCloseTriggerProps()">Cancel</button>
    </div>
  </div>
</template>
```

## Controlled and uncontrolled

| | Controlled | Uncontrolled | Reports changes |
|---|---|---|---|
| Dialog | `open` | `defaultOpen` | `onOpenChange({ open })` |
| Combobox value | `value` | `defaultValue` | `onValueChange({ value })` |
| Combobox listbox | `open` | `defaultOpen` | `onOpenChange({ open })` |
| Combobox text | `inputValue` | `defaultInputValue` | `onInputValueChange({ inputValue, reason })` |
| DropdownMenu | `open` | `defaultOpen` | `onOpenChange({ open })`, `onSelect({ value })` |
| Tabs | `value` | `defaultValue` | `onValueChange({ value })` |

- **Controlled** state follows the prop. The widget reports a change through the callback and waits for the prop to change, so a parent that ignores it keeps the widget where it is.
- Callbacks report changes the widget makes, not changes to the prop.
- A combobox value is a string (or `null`), or an array with `multiple`.

## Comboboxes

Render `combobox.items`, not the items you passed in: they're filtered by label as the user types, ignoring case and accents. With `remote: true` they aren't filtered. Send the search to your server from `onInputValueChange` when `reason` is `input-change`, and pass the results back as `items`.

## IDs and direction

- IDs default to the framework's `useId()`. Pass `id` for the widget, or `ids` (`{ trigger: 'edit-trigger', … }`) to name parts yourself.
- The direction starts from `<html dir>`. After mounting, each widget measures the direction its parts sit in, so a `<div dir="rtl">` around a widget mirrors its parts, arrow keys and placement. An explicit `dir` option always wins.
