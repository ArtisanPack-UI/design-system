---
'@artisanpack-ui/css': minor
'@artisanpack-ui/manifest': minor
'@artisanpack-ui/behavior': minor
'@artisanpack-ui/testing': minor
---

Add the first five pilot components (#44 to #48). `@artisanpack-ui/css` ships Button, Input, Select, Checkbox and Card in `apui.components`, with the form-field anatomy they share in `field.css` (D-018). `@artisanpack-ui/manifest` adds the Input, Select, Checkbox and Card manifests and docs examples, moves Button to `draft`, adds Button's `type` prop, and spells Checkbox's `checked-change` as `wire:model`, `onCheckedChange` and `update:checked`. `@artisanpack-ui/behavior` adds the icon registry (`@artisanpack-ui/behavior/icons`, D-017) with a default Lucide set, also exported as `icons.json`. `@artisanpack-ui/testing` renders every non-default `surface` in the fixtures, forces pseudo-states on a field's native control instead of its wrapper root, and counts a native control that receives `$attributes` as `wire:model` binding in the Blade parity checks.
