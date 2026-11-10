# @artisanpack-ui/behavior

Shared interaction engine for ArtisanPack UI components: [Zag](https://zagjs.com) state machines for the hard widgets, [Floating UI](https://floating-ui.com) for positioning, and an adapter per stack ([D-015](../../docs/decisions.md#d-015-the-behavior-engine-is-zag-with-floating-ui)).

> **Not published yet.** The first release is tracked in #81. Dialog and Combobox are proven (the Phase 3 spike, #32 to #35); the other engine widgets arrive with their components. The React and Vue adapters are #36.

Part of the [ArtisanPack UI Design System](../../README.md).

## What's here

| Export | What it is |
|---|---|
| `@artisanpack-ui/behavior` | The adapter interface (`createWidget`, `WidgetDefinition`), widget definitions (`dialog`, `combobox`), positioning (`position`, `toPlacement`, `zagPositioning`) and morph support (`keepClientState`) |
| `@artisanpack-ui/behavior/alpine` | The Alpine plugin: `apuiDialog`, `apuiCombobox` and the `x-apui:<part>` directive |
| `@artisanpack-ui/behavior/alpine.global.js` | The same plugin as one classic script that registers itself on `alpine:init`, for pages without a bundler ([D-014](../../docs/decisions.md#d-014-without-a-bundler-use-the-prebuilt-composer-asset-no-official-cdn-build-at-10)). About 44 KB gzipped with Dialog and Combobox |

Engine widgets only: Menu and DropdownMenu, Combobox, Select and Choices, Popover, Tooltip, Dialog, Modal and Drawer, Tabs, DatePicker, the Toast stack and Spotlight. Simple components stay native in each stack.

## Alpine and Livewire

```js
import Alpine from 'alpinejs';
import apuiBehavior from '@artisanpack-ui/behavior/alpine';

Alpine.plugin(apuiBehavior);
```

Without a bundler, load `alpine.global.js` before Livewire's script. A component is an `x-data` and its parts are `x-apui:<part>`, named after the machine's parts in kebab-case:

```blade
<div x-data="apuiDialog({ open: $wire.entangle('showDialog').live })">
    <button id="edit-trigger" x-apui:trigger>Edit profile</button>
    <template x-teleport="body">
        <div>
            <div id="edit-backdrop" x-apui:backdrop></div>
            <div id="edit-positioner" x-apui:positioner>
                <div id="edit-content" x-apui:content>
                    <h2 id="edit-title" x-apui:title>Edit profile</h2>
                    <button id="edit-close" x-apui:close-trigger>Cancel</button>
                </div>
            </div>
        </div>
    </template>
</div>
```

```blade
<div x-data="apuiCombobox({ value: $wire.entangle('country').live })">
    <label id="country-label" x-apui:label>Country</label>
    <div id="country-control" x-apui:control>
        <input id="country-input" x-apui:input>
        <button id="country-trigger" x-apui:trigger aria-label="Show countries">▾</button>
    </div>
    <div id="country-positioner" x-apui:positioner>
        <ul id="country-list" x-apui:content>
            @foreach ($countries as $code => $name)
                <li wire:key="country-{{ $code }}" x-apui:item="{ value: @js($code), label: @js($name) }">{{ $name }}</li>
            @endforeach
            <li id="country-empty" x-apui:empty>No countries match.</li>
        </ul>
    </div>
</div>
```

| Option | Dialog | Combobox |
|---|---|---|
| `open` / `value` | Open state | Value: a string, or an array with `multiple` |
| Events | `open-change` | `value-change`, `open-change` |
| Other | `role`, `modal`, `closeOnEscape`, `closeOnInteractOutside`, `preventScroll`, `trapFocus`, `restoreFocus`, `label` | `multiple`, `remote` + `search`, `allowCustom`, `placeholder`, `disabled`, `readOnly`, `name`, `translations`, `positioning` |

`open` and `value` are plain Alpine state, so `$wire.entangle()` binds them to Livewire properties both ways. That's what `wire:model` on the Blade components compiles to. Events report changes the widget makes, like `onOpenChange` in React; setting the bound state doesn't fire them.

Combobox filters its items by label (ignoring case and accents) as you type. With `remote: true` it doesn't: typing updates the entangled `search`, the server renders the matching items, and the combobox picks them up from the morph. `x-apui:empty` shows when no item matches.

### Rules for Livewire

These came out of running the spike on Livewire 3.7 and 4.4 ([D-015](../../docs/decisions.md#d-015-the-behavior-engine-is-zag-with-floating-ui)):

1. **Every part needs a stable, server-rendered `id`.** Livewire keys elements by `wire:key`, then `id`. A part without one gets an id from the machine, the keys stop matching, and the morph replaces the element, leaving the focus trap and listeners on a detached node. The adapter keeps author ids (it passes them to the machine) and warns in the console about parts without one. The Blade components render ids for every part.
2. **Items need `wire:key`**, as any Livewire list does.
3. **Load the adapter before Livewire.** It registers on `alpine:init` and hooks Livewire's morph then.

What the adapter handles for you:

- **Morphing.** The machine owns every attribute it writes on a part. A re-render resets them to the server's HTML, and the widget writes them back before the next paint. State the machine writes outside part props (`aria-hidden` on the page behind a modal, a layer's `pointer-events`) is carried through the morph by `keepClientState`, which the plugin hooks into Livewire's `morph.updating`. For another morph library, call `ApuiBehavior.keepClientState(el, toEl)` (or import it) before each element is patched.
- **`wire:navigate`.** Alpine destroys the old page's components, which stops each machine and runs its cleanups: the focus trap, scroll lock, `aria-hidden` and listeners all go. Zag installs one set of focus-modality listeners per window on first use and keeps them, which is expected.

## Positioning

```js
import { position } from '@artisanpack-ui/behavior';

const stop = position(trigger, panel, { placement: 'end-start', gutter: 8 });
```

Placements are logical ([D-004](../../docs/decisions.md#d-004-rtl-is-a-launch-requirement)): `start` and `end` sides follow the text direction, and `-start`/`-end` alignment mirrors in RTL. `position()` keeps the panel in place as either element moves, resizes or scrolls; call the returned function to stop. Widgets whose machine positions its own content take `zagPositioning()` instead.

## The adapter interface

```ts
interface WidgetDefinition<Schema, Api> {
  scope: string; // data-scope on every part
  machine: Machine<Schema>;
  connect(service, normalize): Api; // state → props per part
}
```

Every stack runs the same definitions, so markup, ARIA, `data-scope` and `data-part` are identical across them. Alpine and plain DOM use `createWidget(definition, props)`, which starts the machine and keeps bound nodes in sync (`widget.bind(node, (api) => api.getContentProps())`). React and Vue (#36) run the same `machine` and `connect` through Zag's framework adapters.

## Tests

`npm test --workspace @artisanpack-ui/behavior` drives the widgets in Chromium with Alpine and its morph plugin (the morph Livewire uses): focus, keyboard, ARIA, bound state, morph survival, remote search, teardown and RTL positioning.
