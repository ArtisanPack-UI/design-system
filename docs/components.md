---
title: Components
menu_order: 6
---

# Components

Every component has the same props, parts, events and keyboard behavior in each stack it ships in. All but three ship in all three stacks; ImageLibrary, StreamableContent and ThemePreview are Livewire-only. Each component's page has a tab per stack (Blade, React and Vue) with live examples, and tables of its props, parts, slots and events.

| Stack | Tag or import |
|---|---|
| Livewire / Blade | `<x-artisanpack-button>` |
| React | `import { Button } from '@artisanpack-ui/react'` |
| Vue | `import { Button } from '@artisanpack-ui/vue'` |

Names follow each stack's conventions: `leadingIcon` in React and Vue is `leading-icon` in Blade, and a value bound with `value` and `onValueChange` in React is `v-model` in Vue and `wire:model` in Livewire. The component pages show the right form under each tab.

## Actions

| Component | Description |
|---|---|
| [Button](components/button) | Triggers an action. |
| [Link](components/link) | Navigates somewhere. |
| [Clipboard](components/clipboard) | Copies a value with clear confirmation: a copy button, an icon button with a confirmation tooltip, or a copy field showing the value beside its button. |
| [Swap](components/swap) | A two-state toggle that swaps its on and off content, such as a sun and a moon: a native checkbox with an accessible name over the content, with an optional fade or rotate. |

## Forms

| Component | Description |
|---|---|
| [Form](components/form) | A native form that lays out its fields with the field gap and ends with an actions row. |
| [Fieldset](components/fieldset) | Groups related fields under a legend (title and description), as a panel, a divided section or plain. |
| [Input](components/input) | Single-line text entry with a visible label, hint and error. |
| [Password](components/password) | Password entry in Input's field anatomy, with a reveal toggle, an optional strength meter and live requirements. |
| [Pin](components/pin) | A row of single-character cells for one-time codes. |
| [Textarea](components/textarea) | Multi-line text entry. |
| [Select](components/select) | Chooses one value from a short list with the native select element. |
| [Combobox](components/combobox) | A text input that filters a listbox: pick one match, or several shown as removable chips, and optionally create a value that isn't listed. |
| [Checkbox](components/checkbox) | Turns one option on or off, or selects items in a list or table. |
| [CheckboxGroup](components/checkbox-group) | A labeled set of related checkboxes in a fieldset, with a shared hint and error, an optional select-all box, columns and a cards layout. |
| [RadioGroup](components/radio-group) | Chooses exactly one option from a small set, with native radios in a fieldset. |
| [Toggle](components/toggle) | A switch for settings that take effect immediately: a native checkbox with role=switch in Checkbox's field anatomy. |
| [Range](components/range) | A slider for one value, or two thumbs for a from–to range. |
| [Rating](components/rating) | Shows or collects a star score. |
| [ColorPicker](components/color-picker) | A color field: a swatch that opens a popover (saturation and brightness area, hue and opacity sliders, format select, eyedropper and preset swatches) and a text value that is always available for typing. |
| [DatePicker](components/date-picker) | A text field with a calendar popover for a single date or a range, and with time it's DateTime: date and time in one field. |
| [File](components/file) | Uploads files by dropping or browsing: a native file input over a drop zone, and a list of the chosen files with their size, progress, errors and a remove button. |
| [Signature](components/signature) | Captures a signature by drawing, typing or uploading. |
| [ValidationSummary](components/validation-summary) | Lists every error in a form after a failed submit, each linked to its field. |

## Editors and content

| Component | Description |
|---|---|
| [RichTextEditor](components/rich-text-editor) | Formatted text editing with a toolbar over the shared prose styles. |
| [CodeEditor](components/code-editor) | Editable code in a native textarea, with file tabs, a language select, line numbers, the active line, diagnostics listed in text and a status bar. |
| [Markdown](components/markdown) | Renders GitHub-flavored Markdown (tables, task lists, strikethrough, autolinks) with the shared prose styles, and optionally edits it: write and split modes add Write, Preview and Split tabs over a Textarea. |
| [Code](components/code) | Read-only code: a block with a header (file name, language and a copy button), optional line numbers and highlighted lines, or inline code in running text. |
| [Kbd](components/kbd) | A keyboard key or shortcut, as kbd elements. |
| [Diff](components/diff) | Shows the changes between two versions of a text, unified or side by side, with hunks of context around each change and the changed words marked. |
| [Heading](components/heading) | A title from the type scale. |
| [Text](components/text) | Body text with a size, tone and weight, cut to one line with truncate or to a number of lines with clamp. |
| [Divider](components/divider) | Separates content with a muted rule: horizontal, vertical or with a label in the middle. |
| [Icon](components/icon) | One Lucide icon from the registry at four sizes, or in a soft-colored tile. |

## Data display

| Component | Description |
|---|---|
| [Badge](components/badge) | A small, non-interactive label for a status, category or count. |
| [Avatar](components/avatar) | A person or organization as an image, initials or an icon. |
| [Stat](components/stat) | A single headline number with its label, its change and the context for it. |
| [KpiCard](components/kpi-card) | A headline metric in a Card: a Stat's label, value and change, with a sparkline of its trend beside the value and, when there is one, progress toward a target. |
| [Sparkline](components/sparkline) | A word-sized trend with no axes: a line, an area or bars, drawn as inline SVG. |
| [Table](components/table) | Rows of structured data in real table markup: a toolbar with a title, sortable headers, row selection with a select-all box, expandable rows, loading and empty states, and a footer with Pagination. |
| [Chart](components/chart) | A bar, line, area or donut chart in a Card, drawn as inline SVG from tokens: series colors --apui-chart-1…6 in fixed order, a recessive grid, and a tooltip on hover and keyboard focus of each mark. |
| [Timeline](components/timeline) | Events in order, newest or oldest first, each with an icon or dot marker, a head, a time and optional body text or a card. |
| [ListItem](components/list-item) | A row with leading, title, description and trailing parts. |
| [Calendar](components/calendar) | Events on a month grid, a week, a day or an agenda list, with Today, previous and next, view tabs and an optional New event button. |

## Feedback

| Component | Description |
|---|---|
| [Alert](components/alert) | An inline message about the state of a page or section: what happened and what to do next. |
| [Toast](components/toast) | A brief, non-blocking message about something that just happened. |
| [Loading](components/loading) | Shows that work is in progress: a spinner or three dots, inline with a label or as an overlay over the region that is loading. |
| [Progress](components/progress) | Linear progress: determinate, indeterminate or segmented into steps, with an optional label and value above the track. |
| [ProgressRadial](components/progress-radial) | Circular progress with the value in the center, built from Progress: for a single headline percentage. |
| [Skeleton](components/skeleton) | A placeholder shape that matches the layout while content loads: a block, a line of text or a circle. |
| [StreamableContent](components/streamable-content) | Content that arrives over time, such as a generated summary, with waiting, streaming, done, error and stopped states. (Livewire only) |
| [EmptyState](components/empty-state) | Explains why there's nothing here and what to do next: an icon tile, a title, a description and usually one primary action. |
| [ErrorState](components/error-state) | Explains what failed, what's safe and how to recover, in place of content that couldn't load: an icon tile or a large status number, a title, a description, a reference code people can quote and recovery actions. |

## Overlays

| Component | Description |
|---|---|
| [Dialog](components/dialog) | A modal window for a focused task or a confirmation. |
| [Drawer](components/drawer) | A panel that slides in from an edge for filters, details or secondary tasks. |
| [Popover](components/popover) | An anchored, non-modal panel with interactive content, for a short task tied to one control. |
| [Tooltip](components/tooltip) | A short label shown on hover and keyboard focus. |
| [DropdownMenu](components/dropdown-menu) | A list of actions or options anchored to a trigger button: action, checkbox and radio items, in groups with labels. |
| [Spotlight](components/spotlight) | A command palette: search across pages, records and actions. |

## Navigation

| Component | Description |
|---|---|
| [Navbar](components/navbar) | The top bar: a brand, primary links or a search, and account actions, as a full-width bar or an island. |
| [Menu](components/menu) | A navigation list in a nav landmark: links with icons and badges, section titles, separators and collapsible sub-menus, with the current page marked. |
| [UserMenu](components/user-menu) | The account menu: an avatar button that opens a DropdownMenu with the person's identity, a workspace switcher, a theme control, your items and Log out, which always comes last. |
| [Tabs](components/tabs) | Switches between views of the same content: a tablist of triggers and one panel per tab. |
| [Steps](components/steps) | Shows progress through a sequence: an ordered list of steps, each complete, current, upcoming or in error. |
| [Pagination](components/pagination) | Moves between the pages of a long list: previous and next, the first and last pages, the pages around the current one, and an optional summary. |
| [Breadcrumbs](components/breadcrumbs) | Shows where the current page sits in the hierarchy: a trail of links ending in the current page. |

## Disclosure

| Component | Description |
|---|---|
| [Accordion](components/accordion) | Stacked sections that expand and collapse: each item is a heading holding a button that shows or hides its panel. |
| [Collapse](components/collapse) | A single disclosure: a button that shows and hides one region, such as advanced settings, or a read-more that clamps long text behind a fade. |

## Layout

| Component | Description |
|---|---|
| [AppShell](components/app-shell) | The application frame: a sidebar and a main column (an optional top bar, then the content) as islands separated by a gutter. |
| [PageHeader](components/page-header) | The title block at the top of a page: breadcrumbs, then the title with its description and meta beside the actions, then tabs. |
| [Card](components/card) | The default container: a surface with an edge, plus optional media, header, body and footer parts. |
| [Grid](components/grid) | A layout primitive: its children in equal columns, with the gap from the space scale. |
| [Stack](components/stack) | A layout primitive: its children in a column or a row, with the gap from the space scale, alignment and optional wrapping. |

## Media

| Component | Description |
|---|---|
| [ImageGallery](components/image-gallery) | A grid of images that opens a lightbox: a dark dialog with the image, a counter and caption, previous and next buttons, thumbnails and arrow keys that follow the text direction. |
| [ImageLibrary](components/image-library) | A media manager: search, switch between grid and list, select one or many assets, upload, and inspect an asset in a details panel with editable alt text. (Livewire only) |
| [Carousel](components/carousel) | Scroll-snapped slides with previous and next buttons and position dots, on the carousel machine ImageSlider uses. |
| [ImageSlider](components/image-slider) | One large image per view with a glass caption, a counter, previous and next buttons, dots and optional thumbnails, on the carousel machine. |

## Theme

| Component | Description |
|---|---|
| [ThemeToggle](components/theme-toggle) | Lets people choose light, dark, high contrast or system. |
| [ThemePreview](components/theme-preview) | Selectable cards that show a live miniature of each theme or preset: a radio group whose miniatures are drawn with the real tokens, by setting data-theme and data-preset on each miniature, so they stay accurate after a rebrand. (Livewire only) |

## Shared conventions

- **Colors and variants** are the same everywhere: `color` takes `primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error` or `info`, and `variant` takes the component's variants, such as `solid`, `soft`, `outline`, `ghost` or `link`. See [Color](Foundations-Color).
- **Sizes** run `xs` to `xl` where a component has them. Sizes don't change with [density](Foundations-Spacing-And-Density).
- **Form fields** share one anatomy: a label, the control, a hint and an error, all wired with `aria-describedby`. Attributes such as `name`, `required` and `autocomplete` go to the native control.
- **Icons** are names from the [icon registry](Foundations-Icons), or your own SVG in a slot.
- **Every part** can take extra classes through the `classes` prop. See [Component Markup](Styling-Component-Markup).
- **Strings** the components render on their own (close buttons, "No results", screen-reader announcements) are props ending in `Label` (`closeLabel`, `emptyLabel`), so you can translate them.
