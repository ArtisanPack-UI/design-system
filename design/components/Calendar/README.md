# Calendar

A month grid of events with view switching.

## Anatomy

Root `.apui-calendar`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, toolbar, title, view tabs, grid, weekday, cell, date, event, more.

## Props

| Prop | Values | Default |
|---|---|---|
| `view` | 'month' \| 'week' \| 'day' \| 'agenda' | month |
| `events` | Array<{start, end?, title, color}> | — |
| `weekStartsOn` | 0–6 | locale |

## Accessibility

- Grid with arrow-key navigation; each event is a link with its full time and title.
- Agenda view is the accessible list alternative.

## Do

- Use soft tints by category and keep the category key visible.

## Don’t

- Don’t rely on event color alone.
