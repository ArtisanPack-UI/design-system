---
'@artisanpack-ui/behavior': minor
---

Add the behavior engine (#32 to #35, D-015): Zag state machines with a framework-agnostic adapter interface (`createWidget`, `WidgetDefinition`), Dialog and Combobox definitions, Floating UI positioning with logical start/end placements, and `keepClientState` for server morphs. Add the Alpine adapter (`@artisanpack-ui/behavior/alpine`): `apuiDialog`, `apuiCombobox` and `x-apui:<part>` directives, with `open` and `value` bindable through `$wire.entangle()`, local and remote filtering, and a classic-script build (`alpine.global.js`) that registers on `alpine:init`. Tested on Livewire 3 and 4.
