---
title: Alpine and Livewire
menu_order: 1
---

# Alpine and Livewire

The Alpine plugin registers one Alpine component per widget (`apuiDialog`, `apuiCombobox`, `apuiDropdownMenu`, `apuiTabs`, `apuiAccordion`, `apuiCollapse`, `apuiDrawer`, `apuiPopover`, `apuiTooltip`, `apuiToaster`, `apuiToast` and more) and an `x-apui:<part>` directive that binds each part.

## Register the plugin

```js
import apuiBehavior from '@artisanpack-ui/behavior/alpine';

document.addEventListener('alpine:init', () => window.Alpine.plugin(apuiBehavior));
```

Without a bundler, load the prebuilt script (`@artisanpackScripts` in Livewire UI Components) before Livewire's script. See [Without a Bundler](Getting-Started-Without-A-Bundler).

## A widget

A widget is an `x-data`, and each of its parts is an element with `x-apui:<part>`, named after the machine's parts in kebab-case:

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

The engine writes the ARIA attributes, `data-state`, `data-scope` and `data-part` for you, manages focus and handles the keyboard. Bind state with `$wire.entangle()` like any Alpine value.

## Rules for Livewire

These keep a widget working through Livewire's DOM morphing:

1. **Every part needs a stable, server-rendered `id`.** Livewire matches elements by `wire:key`, then `id`. A part without one gets an id from the machine, the morph stops matching it, and replaces the element, leaving the focus trap and listeners on a detached node. The engine warns in the console about parts without an id. The Blade components render ids for every part.
2. **Items need `wire:key`**, as in any Livewire list.
3. **Load the engine before Livewire**, so it's registered when Alpine starts and hooks Livewire's morph.

## What the engine handles

- **Morphing.** The machine owns the attributes it writes on its parts. A re-render resets them to the server's HTML, and the widget writes them back before the next paint. State it writes outside its parts, such as `aria-hidden` on the page behind a modal, is carried through the morph. If you use another morph library, call `keepClientState(el, toEl)` before each element is patched. With a bundler, import it with `import { keepClientState } from '@artisanpack-ui/behavior'`. The prebuilt script exposes it as `ApuiBehavior.keepClientState`.
- **`wire:navigate`.** Leaving a page stops each widget and runs its cleanup: focus traps, scroll locks, `aria-hidden` and listeners all go.

## Events

Widgets report changes as DOM events on the `x-data` element, such as `open-change` and `value-change`:

```blade
<div x-data="apuiDialog()" x-on:open-change="console.log($event.detail.open)">
```
