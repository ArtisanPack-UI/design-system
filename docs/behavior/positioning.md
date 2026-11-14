---
title: Positioning
menu_order: 3
---

# Positioning

Floating content (menus, popovers, tooltips, combobox lists, date pickers) is positioned with Floating UI. Widgets position their own content. For floating content of your own, use `position()`:

```js
import { position } from '@artisanpack-ui/behavior';

const stop = position(trigger, panel, { placement: 'end-start', gutter: 8 });

// later
stop();
```

`position()` keeps the panel attached as either element moves, resizes or scrolls. Call the returned function to stop.

## Logical placements

Placements are logical, so they mirror in right-to-left layouts:

| Placement | In left-to-right | In right-to-left |
|---|---|---|
| `bottom-start` | Below, aligned to the left edge | Below, aligned to the right edge |
| `end` | To the right | To the left |
| `start-end` | To the left, aligned to the bottom | To the right, aligned to the bottom |

`top`, `bottom`, `start` and `end` pick the side; an optional `-start` or `-end` picks the alignment along it.

| Option | Does |
|---|---|
| `placement` | The side and alignment |
| `gutter` | The gap between trigger and panel, in pixels |
