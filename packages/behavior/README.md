# @artisanpack-ui/behavior

Shared interaction engine for ArtisanPack UI components: [Zag](https://zagjs.com) state machines for the hard widgets, [Floating UI](https://floating-ui.com) for positioning, and an adapter per stack ([D-015](../../contributing/decisions.md#d-015-the-behavior-engine-is-zag-with-floating-ui)).

> **Not published yet.** The first release is tracked in #81. Dialog and Combobox are proven (the Phase 3 spike, #32 to #35); DropdownMenu and the toast stack arrived with their pilots (#50, #51); the other engine widgets arrive with their components. The React and Vue adapters (#36) run the same definitions.

Part of the [ArtisanPack UI Design System](../../README.md).

## What's here

| Export                                      | What it is                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@artisanpack-ui/behavior`                  | The adapter interface (`createWidget`, `WidgetDefinition`), widget definitions (`dialog`, `combobox`, `dropdownMenu`, `toast`, `toastGroup`), the toaster (`createToaster`, `staticToastParts`), positioning (`position`, `toPlacement`, `zagPositioning`) and morph support (`keepClientState`)                                                    |
| `@artisanpack-ui/behavior/alpine`           | The Alpine plugin: `apuiDialog`, `apuiCombobox`, `apuiDropdownMenu`, `apuiTabs`, `apuiAccordion`, `apuiCollapse`, `apuiDrawer`, `apuiPopover`, `apuiTooltip`, `apuiToaster`, `apuiToast` and the `x-apui:<part>` directive                                                                                                                                                                                                                   |
| `@artisanpack-ui/behavior/react`            | React hooks: `useDialog`, `useCombobox`, `useDropdownMenu`, `useTabs`, `useAccordion`, `useCollapse`, `useDrawer`, `usePopover`, `useTooltip`, `useToaster`, `useToast`                                                                                                                                                                                                                                                                |
| `@artisanpack-ui/behavior/vue`              | Vue composables: `useDialog`, `useCombobox`, `useDropdownMenu`, `useTabs`, `useAccordion`, `useCollapse`, `useDrawer`, `usePopover`, `useTooltip`, `useToaster`, `useToast`                                                                                                                                                                                                                                                            |
| `@artisanpack-ui/behavior/icons`            | The icon registry every stack resolves string icon names against: `resolveIcon`, `iconSvg`, `registerIcons` (trusted static SVG shapes only; anything else throws `UnsafeIconError`, see `isSafeIconBody`), with a default Lucide set ([D-017](../../contributing/decisions.md#d-017-icon-names-resolve-against-one-lucide-set-shipped-by-behavior))        |
| `@artisanpack-ui/behavior/icons.json`       | The default set as JSON (`icons/lucide.json`), which Livewire UI Components copies into PHP along with its license notice (`icons/LICENSE-lucide.txt`)                                                                                                                                                                                              |
| `@artisanpack-ui/behavior/alpine.global.js` | The same plugin as one classic script that registers itself on `alpine:init`, for pages without a bundler ([D-014](../../contributing/decisions.md#d-014-without-a-bundler-use-the-prebuilt-composer-asset-no-official-cdn-build-at-10)). About 63 KB gzipped with Dialog, Combobox, DropdownMenu and the toast stack; `ApuiBehavior.toast()` shows a toast |

Engine widgets only: Accordion and Collapse, DropdownMenu (the navigation Menu is links plus a disclosure per sub-menu, so it needs no widget), Combobox and Choices, Popover, Tooltip, Dialog, Modal and Drawer, Tabs, DatePicker, the Toast stack and Spotlight. Simple components stay native in each stack, Select included ([D-018](../../contributing/decisions.md#d-018-form-fields-share-one-anatomy-and-route-attributes-to-the-native-control)).

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

| Option           | Dialog                                                                                                            | Combobox                                                                                                                     | DropdownMenu                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `open` / `value` | Open state                                                                                                        | Value: a string, or an array with `multiple`                                                                                 | Open state                                                        |
| Events           | `open-change`                                                                                                     | `value-change`, `open-change`                                                                                                | `open-change`, `select`, `checked-change`                         |
| Other            | `role`, `modal`, `closeOnEscape`, `closeOnInteractOutside`, `preventScroll`, `trapFocus`, `restoreFocus`, `label` | `multiple`, `max`, `remote` + `search` + `debounce`, `allowCustom`, `allowCreate`, `loading`, `labels`, `invalid`, `required`, `placeholder`, `disabled`, `readOnly`, `name`, `translations`, `positioning` | `align`, `closeOnSelect`, `loopFocus`, `typeahead`, `positioning` |

`open` and `value` are plain Alpine state, so `$wire.entangle()` binds them to Livewire properties both ways. That's what `wire:model` on the Blade components compiles to. Events report changes the widget makes, like `onOpenChange` in React; setting the bound state doesn't fire them.

Combobox filters its items by label (ignoring case and accents) as you type. With `remote: true` it doesn't: typing updates the entangled `search`, the server renders the matching items, and the combobox picks them up from the morph. `x-apui:empty` shows when no item matches. It isn't a live region: the machine announces the result count ("3 results", "No results") itself, from `translations.resultsCount` and `translations.noResults`, which the Blade components pass through `__()`. An item's label defaults to the text of its `x-apui:item-text` part, so an indicator never ends up in it.

The combobox's field parts follow the form anatomy ([D-018](../../contributing/decisions.md#d-018-form-fields-share-one-anatomy-and-route-attributes-to-the-native-control)): Zag's `control` and `input` render as `data-part="box"` and `data-part="control"` (`repart()`), though the directives keep the machine's names (`x-apui:control` on the box, `x-apui:input` on the text input). Typing dispatches `search-change`; with `remote` it also sets `search` after `debounce` ms. With `multiple` the component exposes `chips` and `remove(value)` (Backspace in the empty input removes the last one and sets `status`, for a live region); with `allowCreate`, bind `x-apui:item="createOption"` and `createText` for the create option, which dispatches `create` when chosen. `itemHtml(label, description)` returns the label with the typed text in `<mark data-part="mark">`, escaped, and `emptyText` is the empty or loading text. Labels default to `COMBOBOX_LABELS` and take translations through `labels`. React and Vue get the same from `useCombobox` (`allowCreate`, `onCreate`, `max`, `loading`) plus the `highlight()` and `formatLabel()` helpers.

One element can carry several parts, of one widget or of two (a Tooltip on a DropdownMenu trigger). Their props are merged the way Zag's `mergeProps` does: event handlers all run, and for other attributes the part bound last wins. An element has only one `id`, though, so only one of the parts on a shared element can keep an authored id.

```blade
<div x-data="apuiDropdownMenu({ align: 'start' })">
    <button id="actions-trigger" x-apui:trigger>Options</button>
    <template x-teleport="body">
        <div id="actions-positioner" x-apui:positioner>
            <div id="actions-content" x-apui:content>
                <div id="actions-group" x-apui:item-group="{ id: 'listing' }">
                    <div id="actions-group-label" x-apui:item-group-label="{ htmlFor: 'listing' }">Listing</div>
                    <div wire:key="edit" x-apui:item="{ value: 'edit' }" wire:click="edit">
                        <span x-apui:item-text="{ value: 'edit' }">Edit</span>
                    </div>
                </div>
                <hr id="actions-separator" x-apui:separator>
                <div wire:key="grid" x-apui:option-item="{ type: 'checkbox', value: 'grid', checked: @js($showGrid) }" wire:click="$toggle('showGrid')">
                    <span x-apui:item-indicator="{ type: 'checkbox', value: 'grid', checked: @js($showGrid) }">✓</span>
                    <span x-apui:item-text="{ value: 'grid' }">Show grid</span>
                </div>
            </div>
        </div>
    </template>
</div>
```

A DropdownMenu's parts are scoped `dropdown-menu`, apart from the navigation Menu ([D-019](../../contributing/decisions.md#d-019-overlays-put-the-root-class-on-the-panel-keep-zags-part-names-and-render-in-place-for-the-gates)). Choosing an item clicks it, so `wire:click` runs from the keyboard too, and dispatches `select`. Checkbox and radio items dispatch `checked-change` from the item; their `checked` stays the page's to set. The machine names items `<id>/<value>`, so items are keyed by `wire:key`; groups and their labels keep their ids.

```blade
<div id="account" x-data="apuiTabs({ value: $wire.entangle('section'), activationMode: 'automatic' })" x-apui:root>
    <div id="account-list" x-apui:list>
        <button id="account-trigger-profile" x-apui:trigger="{ value: 'profile' }">Profile</button>
        <button id="account-trigger-billing" x-apui:trigger="{ value: 'billing', disabled: true }">Billing</button>
    </div>
    <div id="account-content-profile" x-apui:content="{ value: 'profile' }">…</div>
    <div id="account-content-billing" x-apui:content="{ value: 'billing' }">…</div>
</div>
```

Tabs (#56) keep Zag's parts and scope (`tabs`); the spec's panel is the `content` part. Triggers and panels are named per value, so their authored ids are kept per value. `value` is plain state, entangled with Livewire, and a selection dispatches `value-change`; with no value, the first enabled tab is selected. The arrow keys follow `orientation` and the direction the root computes to, so ArrowLeft moves to the next tab in RTL. `activationMode: 'manual'` moves focus only, and Enter or Space selects.

```blade
<div id="faq" x-data="apuiAccordion({ value: $wire.entangle('open') })" x-apui:root class="apui-accordion">
    <div id="faq-item-live" x-apui:item="{ value: 'live' }">
        <h3 data-scope="accordion" data-part="title">
            <button id="faq-trigger-live" x-apui:item-trigger="{ value: 'live' }">
                How long does a listing stay live?
                <span x-apui:item-indicator="{ value: 'live' }">…</span>
            </button>
        </h3>
        <div id="faq-content-live" x-apui:item-content="{ value: 'live' }">…</div>
    </div>
</div>

<div id="advanced" x-data="apuiCollapse({ open: $wire.entangle('advanced') })" x-apui:root class="apui-collapse">
    <button id="advanced-trigger" x-apui:trigger>Advanced settings <span x-apui:indicator>…</span></button>
    <div id="advanced-content" x-apui:content>…</div>
</div>
```

Accordion and Collapse (#58) run Zag's accordion and collapsible machines. The directives keep the machines' names, but the parts render the spec's: the accordion's `item-trigger`, `item-indicator` and `item-content` are `trigger`, `chevron` and `content` (`ACCORDION_PARTS`), and the collapsible's parts are scoped `collapse`, its `indicator` rendered as `icon` (`COLLAPSE_PARTS`). The accordion's `value` is the open items; one opens at a time unless `multiple`, and `collapsible: false` keeps the open one open. A single accordion entangled with a string (or null) writes back a string. ArrowDown and ArrowUp move between triggers. A collapse's `open` is plain state; `variant: 'read-more'` passes the machine `collapsedHeight` (`--apui-collapse-clamp-height`, 64px), so the closed region stays rendered, clamped and readable. They dispatch `value-change` and `open-change`; React and Vue use `useAccordion` and `useCollapse`.

```blade
<div x-data="apuiToaster({ label: @js(__('Notifications')) })" wire:ignore>
    <div x-apui:group>
        <template x-for="(entry, index) in toasts" :key="entry.id">
            <div x-data="apuiToast(entry, index)" x-apui:root class="apui-toast">
                <span x-apui:icon x-html="icon"></span>
                <p x-apui:title x-text="entry.title"></p>
                <p x-apui:description x-text="entry.description"></p>
                <button x-apui:close-trigger>×</button>
            </div>
        </template>
    </div>
</div>
```

The toaster renders the page's toasts, newest first. A `toast` browser event adds one, so a Livewire component calls `$this->dispatch('toast', title: __('Saved'), color: 'success')`; `ApuiBehavior.toast({ … })` does the same from JavaScript, and `toasts: [...]` shows ones flashed to the session. The region is client-rendered, so keep it `wire:ignore`, outside the morph. Toast options are the same in every stack: `title`, `description`, `color` (`error` is an alert), `variant`, `surface`, `icon`, `duration` (0 keeps it), `action: { label, onClick }` (keeps it too) and `hideClose`.

```blade
<div x-data="apuiSpotlight({ id: 'palette', shortcut: 'mod+k', url: '/spotlight' })">
    <button id="palette-trigger" x-apui:trigger>Search</button>
    <template x-teleport="body">
        <div>
            <div id="palette-backdrop" x-apui:backdrop></div>
            <div id="palette-positioner" x-apui:positioner>
                <div id="palette-content" x-apui:content class="apui-spotlight">
                    <div id="palette-search" x-apui:search>
                        <input id="palette-query" x-apui:query aria-label="Search">
                        <button id="palette-close" x-apui:close-trigger aria-label="Close">Esc</button>
                    </div>
                    <div id="palette-results" x-apui:results aria-label="Search">
                        <div id="palette-pages" x-apui:item-group="{ id: 'pages' }">
                            <div id="palette-pages-label" x-apui:item-group-label="{ htmlFor: 'pages' }">Pages</div>
                            <a href="/reports" wire:key="reports" x-apui:item="{ value: 'reports', label: 'Reports', keywords: ['analytics'] }">
                                <span x-apui:item-text>Reports</span>
                            </a>
                        </div>
                        <div id="palette-empty" x-apui:empty>No results.</div>
                        <div id="palette-loading" x-apui:loading hidden>Searching…</div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
```

Spotlight (#57) composes two machines instead of adding one: the dialog is the overlay and the combobox is the search, its listbox always open while the dialog is. Both scope their parts `spotlight`; their names collide (each has a `trigger`, `positioner` and `content`), so the dialog keeps Zag's and the combobox's take the spec's: `search` (Zag's control), `query` (input) and `results` (content). Items are filtered by every word of the query against their label, description and keywords; the active result is `aria-activedescendant` and `aria-selected`. The global shortcut (`mod+k`: ⌘K on Apple platforms, Ctrl+K elsewhere) toggles it. Choosing an item dispatches `select` (`{ value, item }`) and closes it, following a link item; typing dispatches `search-change`. With `remote` the server filters; with `url` the component fetches JSON for `?search=…` and renders it through `clientGroups('remote')` in an `x-for`, as it does recent choices (`clientGroups('recent')`, kept in `localStorage`). React and Vue use `useSpotlight({ groups, … })`, which returns the visible `groups` and a `get<Part>Props()` per part.

```blade
<span id="edit-tip" x-data="apuiTooltip({ placement: 'top' })" style="display: contents">
    <button id="edit" x-apui:trigger aria-label="Edit">…</button>
    <div id="edit-tip-positioner" x-apui:positioner>
        <div id="edit-tip-content" x-apui:content class="apui-tooltip">
            <span id="edit-tip-arrow" x-apui:arrow></span>Edit
        </div>
    </div>
</span>
```

Drawer, Popover and Tooltip (#58, #59). `apuiDrawer` is `apuiDialog` with its parts scoped `drawer` (`rescope()`, as DropdownMenu does); the side is the panel's CSS. `apuiPopover` runs Zag's popover machine: a non-modal `role=dialog` that moves focus in, returns it to the trigger and closes on Escape or an outside click. `apuiTooltip` runs Zag's tooltip machine: it shows on hover after `delay` (400ms) and at once on keyboard focus, describes the trigger with `aria-describedby`, stays while the pointer is on it (`interactive`, WCAG 1.4.13) and closes on Escape; one shows at a time. The trigger is the author's own control. Without `open` a tooltip keeps its own state; with it, it shows exactly that (a forced tooltip), and `bound: true` makes an entangled `open` take its changes. Both take a logical `placement` (`start` and `end` follow the text direction) and write it on the panel as `data-placement`; the machine writes the side it settled on as `data-side`. The stylesheet draws the arrow on a box-less `arrow` part, so the machine's inline arrow position never shows, and the gap leaves room for it (`POPOVER_GUTTER`, `TOOLTIP_GUTTER`). React and Vue use `useDrawer`, `usePopover` and `useTooltip`.

### DatePicker

`apuiDatePicker` (`useDatePicker` in React and Vue) is DatePicker and, with `time`, DateTime (#55), on Zag's date-picker machine. `value` is an ISO string (`2026-11-12`, `2026-11-12T11:00` in time mode) or an array of two with `mode: 'range'`, so `$wire.entangle()` binds it like any value; `open` is plain state too. The month (`table`, `table-row`, `table-cell`, `table-cell-trigger`) renders from the component's `weeks` and `weekDays` with `x-for`, so keep the positioner `wire:ignore`: its client-rendered cells keep the machine's ids, and the adapter doesn't ask them for server ids. The field's parts follow the shared anatomy: Zag's `control` and `input` are `x-apui:box` and `x-apui:control` (`DATE_PICKER_PARTS`). The time list (`x-apui:time-list`, `x-apui:time-option="{ value: '11:00' }"`) is a listbox the definition adds on top of the machine. Options: `mode`, `time`, `step`, `locale` (Intl month and weekday names), `timeZone`, `min`, `max`, `disabledDates`, `weekStartsOn`, `format` (`dd.MM.yyyy`; the locale's numeric pattern by default), `disabled`, `readOnly`, `required`, `invalid`, `placeholder`, `labels` (`trigger`, `previous`, `next`, `calendar`) and `timeLabel`. Arrow keys follow the text direction.

### Rules for Livewire

These came out of running the spike on Livewire 3.7 and 4.4 ([D-015](../../contributing/decisions.md#d-015-the-behavior-engine-is-zag-with-floating-ui)):

1. **Every part needs a stable, server-rendered `id`.** Livewire keys elements by `wire:key`, then `id`. A part without one gets an id from the machine, the keys stop matching, and the morph replaces the element, leaving the focus trap and listeners on a detached node. The adapter keeps author ids (it passes them to the machine) and warns in the console about parts without one. The Blade components render ids for every part.
2. **Items need `wire:key`**, as any Livewire list does.
3. **Load the adapter before Livewire.** It registers on `alpine:init` and hooks Livewire's morph then.

What the adapter handles for you:

- **Morphing.** The machine owns every attribute it writes on a part. A re-render resets them to the server's HTML, and the widget writes them back before the next paint. State the machine writes outside part props (`aria-hidden` on the page behind a modal, a layer's `pointer-events`) is carried through the morph by `keepClientState`, which the plugin hooks into Livewire's `morph.updating`. For another morph library, call `ApuiBehavior.keepClientState(el, toEl)` (or import it) before each element is patched.
- **`wire:navigate`.** Alpine destroys the old page's components, which stops each machine and runs its cleanups: the focus trap, scroll lock, `aria-hidden` and listeners all go. Zag installs one set of focus-modality listeners per window on first use and keeps them, which is expected.

## Form editors (not Zag)

Signature, RichTextEditor and CodeEditor (#53) have no machine to coordinate, so they ship as plain helpers from `@artisanpack-ui/behavior` that every stack drives the same way: `SignaturePad` (pointer drawing, undo, clear, typed and uploaded signatures as one PNG data URL), `RichTextSurface` with `resolveToolbar`, `sanitizeRichText`, `htmlToMarkdown` and `markdownToHtml` (the built-in contentEditable engine), `codeEditorKeydown` with `caretPosition`, `gutterLines` and `severityByLine` (Tab indents; Escape, then Tab, leaves), and `rovingKeydown` for their toolbars and tabs (arrows follow the text direction). The Alpine plugin registers `apuiSignature`, `apuiRichTextEditor` (TinyMCE inline under the design-system toolbar when the page loads it, else the built-in engine) and `apuiCodeEditor`; React and Vue components use the helpers directly. The helpers and the Alpine components take the built-in strings as one `translations` object (`definedLabels` drops unset ones); the components expose them as one `*Label` prop per string (D-019).

## Data-display helpers (not Zag)

Sparkline and Diff (#61, D-038) draw from plain functions in `src/data`, so no stack needs a chart or diff library: `sparklineGeometry` (the line, area and bar paths for a series in a box) and `sparklineLabel` (its text alternative), and `diffText`, `splitRows` and `wordDiff` (line hunks with context, side-by-side rows, word-level changes). React and Vue call them while rendering. Livewire renders on the server with PHP ports in livewire-ui-components (`Support\SparklineGeometry`, `Support\DiffBuilder`) that use the same formulas and tie-breaking and are tested against the same expectations, so `wire:poll` redraws them and all three stacks match pixel for pixel.

Chart (#63, D-045, D-046) draws from `chartGeometry` in `src/data/chart.ts`: nice-number ticks, the bar, line and area paths, donut arcs, the legend, the labeled value and the table rows, checked against `test/fixtures/chart-vectors.json`, which Livewire's `Support\ChartGeometry` port reads too. `attachChartTooltip(root)` (`src/data/chart-tooltip.ts`) is the one tooltip controller every stack attaches; it listens on the chart root for hover and focus on the marks, so a Livewire morph doesn't break it. The Alpine plugin registers `apuiChart`.

Calendar (#64, D-047) builds its month, week, day and agenda views with `calendarModel()` in `src/data/calendar.ts` on `@internationalized/date`; `calendarGridKeydown` moves focus through the grid following the text direction. Livewire's `Support\CalendarModel` ports it with the same ICU skeletons. The Alpine plugin registers `apuiCalendar`, which only adds the keyboard.

Code, Clipboard and Kbd (#65, D-050) share `src/data/code.ts` (`codeLines`, `codeHighlights`, `codeLabel`), `src/data/kbd.ts` (`kbdKeys`, the symbol names) and the copy helper in `src/widgets/clipboard.ts` (`createClipboard`, `writeClipboard` with an `execCommand` fallback, idle → copied or failed → idle after `timeout`). The Alpine plugin registers `apuiClipboard` and `apuiKbd`; React and Vue use `useClipboard` and `useApplePlatform`.

Markdown (#65) renders through `renderMarkdown` in `src/data/markdown.ts`: `marked` tokenizes GitHub-flavored Markdown and a serializer writes the HTML league/commonmark writes in Livewire (`Support\Markdown\MarkdownRenderer`: GFM, `html_input` escape, `allow_unsafe_links` off), byte for byte on the shared vectors in `test/fixtures/markdown-vectors.json`, which both test suites read. Raw HTML is escaped, or with `sanitize: false` filtered by `filterMarkdownHtml` to formatting tags with safe attributes (no DOM needed, so it runs on a server); links and images follow the SafeUrl rules (`markdownLinkUrl`, `markdownImageUrl`), and images, raw `<img>` included, take only PNG, GIF, JPEG and WebP `data:` URLs. Like commonmark's `max_nesting_level` and `max_delimiters_per_line`, blocks nest at most `MARKDOWN_MAX_NESTING` (100) deep and an inline container keeps at most `MARKDOWN_MAX_DELIMITERS` (500) emphasis delimiter runs, so untrusted source can't exhaust the stack. The Alpine plugin registers `apuiMarkdown` for Livewire's plain-form editor: it holds the source both Textareas bind to and renders the draft for the Preview and Split panels. Task items are labelled, disabled checkboxes and table alignment is `data-align`. Named character references outside a short list are kept as written rather than decoded: the browser renders them as commonmark's decoded output reads.

## Theme choice (not Zag)

ThemeToggle (#65) runs on plain helpers in `src/theme.ts`, exported from the package root. A choice is `light`, `dark`, `high-contrast` or `system`; `applyTheme(choice)` sets `data-theme` on `<html>` (the attribute the tokens switch on) to the theme it resolves to, stores the choice in localStorage (`apui-theme`; every read and write is guarded, so blocked storage falls back to the default) and tells the other toggles on the page. `watchTheme` hears those, other tabs' stored choices and the OS scheme, so `system` follows `prefers-color-scheme` live. `themeScript()` is the blocking snippet for `<head>` that applies the stored choice before first paint; Livewire UI Components prints the same bytes with `@apuiThemeScript` (`Support\ThemeScript`). `themeToggleKey` maps the segmented radio group's keys, following the text direction. The Alpine plugin registers `apuiThemeToggle`; React and Vue call the helpers directly.

## React and Vue

The hooks and composables run the same widget definitions through Zag's own framework adapters, so they emit the same parts, ARIA, `data-scope` and `data-part` as the Alpine adapter. Install the Zag adapter for your stack next to the package; it and the framework are optional peer dependencies:

```sh
npm install @artisanpack-ui/behavior @zag-js/react   # or @zag-js/vue
```

Each returns Zag's API: state (`open`, `value`, `inputValue`), actions, and a `get<Part>Props()` per part to spread (React) or `v-bind` (Vue) onto its element.

```tsx
import { type ComboboxItem, useCombobox, useDialog } from '@artisanpack-ui/behavior/react';
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

function CountryPicker({ countries }: { countries: ComboboxItem[] }) {
  const combobox = useCombobox({ items: countries, defaultValue: 'fr' });

  return (
    <div>
      <label {...combobox.getLabelProps()}>Country</label>
      <div {...combobox.getControlProps()}>
        <input {...combobox.getInputProps()} />
        <button {...combobox.getTriggerProps()} aria-label="Show countries">
          ▾
        </button>
      </div>
      <div {...combobox.getPositionerProps()}>
        <ul {...combobox.getContentProps()}>
          {combobox.items.map((item) => (
            <li key={item.value} {...combobox.getItemProps({ item })}>
              {item.label}
            </li>
          ))}
          <li {...combobox.getEmptyProps()}>No countries match.</li>
        </ul>
      </div>
    </div>
  );
}
```

Vue composables take the options as an object, a ref or a getter, so they can follow props, and return a computed API:

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

|                  | Controlled   | Uncontrolled        | Reports changes                                 |
| ---------------- | ------------ | ------------------- | ----------------------------------------------- |
| Dialog           | `open`       | `defaultOpen`       | `onOpenChange({ open })`                        |
| Combobox value   | `value`      | `defaultValue`      | `onValueChange({ value })`                      |
| Combobox listbox | `open`       | `defaultOpen`       | `onOpenChange({ open })`                        |
| Combobox text    | `inputValue` | `defaultInputValue` | `onInputValueChange({ inputValue, reason })`    |
| DropdownMenu     | `open`       | `defaultOpen`       | `onOpenChange({ open })`, `onSelect({ value })` |
| Tabs             | `value`      | `defaultValue`      | `onValueChange({ value })`                      |

A toaster's region is `useToaster({ toaster })`, where `toaster = createToaster({ … })`; render each of its `toasts` with `useToast(entry, region.service, index)`, as the Alpine toaster does. Checkbox and radio menu items are `getOptionItemProps({ type, value, checked, onCheckedChange })`.

- **Controlled** state follows the prop: the widget reports a change through the callback and waits for the prop to change, so a parent that ignores it keeps the widget where it is. In Vue that's `v-model:open` and `v-model` (`update:open`, `update:modelValue`) on the components built on these.
- Callbacks report changes the widget makes, not changes to the prop, the same as `open-change` and `value-change` in Alpine.
- A combobox value is a string (or `null`), or an array with `multiple`, as in Alpine.
- Render `combobox.items`, not the items you passed: they're filtered by label as you type (ignoring case and accents). With `remote: true` they aren't; send the search to the server from `onInputValueChange` when `reason` is `input-change`, and pass the results back as `items`. The Alpine adapter hides filtered-out items instead of removing them; the parts and attributes of the items that render are the same.
- `getEmptyProps()` is the `empty` part, as `x-apui:empty` is in Alpine.
- Ids default to React's `useId()` and Vue's `useId()`. Pass `id` for the machine, and `ids` (`{ trigger: 'edit-trigger', … }`) to name parts yourself.
- The direction starts as `<html dir>`, since the hooks compute props before the elements exist; after mount each hook measures the direction the widget's parts sit in and hands it to the machine when it differs, so a `<div dir="rtl">` around a widget mirrors its parts, arrow keys and placements as `<html dir="rtl">` does. An explicit `dir` always wins. The toast region is fixed to the viewport, so it keeps `<html dir>`.

## Positioning

```js
import { position } from '@artisanpack-ui/behavior';

const stop = position(trigger, panel, { placement: 'end-start', gutter: 8 });
```

Placements are logical ([D-004](../../contributing/decisions.md#d-004-rtl-is-a-launch-requirement)): `start` and `end` sides follow the text direction, and `-start`/`-end` alignment mirrors in RTL. `position()` keeps the panel in place as either element moves, resizes or scrolls; call the returned function to stop. Widgets whose machine positions its own content take `zagPositioning()` instead.

## The adapter interface

```ts
interface WidgetDefinition<Schema, Api> {
  scope: string; // data-scope on every part
  machine: Machine<Schema>;
  connect(service, normalize): Api; // state → props per part
}
```

Every stack runs the same definitions, so markup, ARIA, `data-scope` and `data-part` are identical across them. Alpine and plain DOM use `createWidget(definition, props)`, which starts the machine and keeps bound nodes in sync (`widget.bind(node, (api) => api.getContentProps())`). React and Vue run the same `machine` and `connect` through Zag's framework adapters (`useMachine`), and map their options onto machine props in one shared place, so the two can't drift.

## Tests

`npm test --workspace @artisanpack-ui/behavior` drives the widgets in Chromium with Alpine and its morph plugin (the morph Livewire uses): focus, keyboard, ARIA, bound state, morph survival, remote search, teardown and RTL positioning. The React and Vue hooks get the same checks plus their controlled and uncontrolled patterns, from fixtures bundled with esbuild, and a parity test renders Dialog and Combobox in all three stacks and compares every part's attributes, closed and open.
