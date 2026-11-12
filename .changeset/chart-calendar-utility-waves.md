---
'@artisanpack-ui/css': minor
'@artisanpack-ui/manifest': minor
'@artisanpack-ui/behavior': minor
'@artisanpack-ui/testing': minor
---

Add Chart, Calendar and the Utility wave (#63 to #65, D-045 to D-055).

- `@artisanpack-ui/manifest` adds 11 manifests with docs examples: Chart, Calendar, Icon, ThemeToggle, ThemePreview, Markdown, Code, Kbd, Swap, Carousel and Clipboard. ThemePreview is Livewire only (D-003, D-055).
- `@artisanpack-ui/css` ships each of them in `apui.components`, plus the shared `.apui-prose` styles.
- `@artisanpack-ui/behavior` adds the `data` helpers `chartGeometry` and `attachChartTooltip` (Chart draws its own SVG; no chart library, D-045), `calendarModel` and `calendarGridKeydown`, `renderMarkdown` on `marked` (the same HTML as league/commonmark, D-049), and the Code and Kbd helpers; the copy helper (`createClipboard`) with `useClipboard`; the theme helpers (`applyTheme`, `watchTheme`, `themeScript`, D-054); `registerDirectionalIcons` (D-051); and `perView` and reduced-motion autoplay for the carousel widget (D-053). The Alpine plugin registers `apuiChart`, `apuiCalendar`, `apuiClipboard`, `apuiKbd` and `apuiThemeToggle`. Adds the `contrast` Lucide icon.
- `@artisanpack-ui/testing` regenerates fixtures for the new manifests.
- Fixes from review: Chart tooltips are positioned within the chart's `body` part, small values and ticks keep the decimals they need, compact values step up a unit when rounding reaches 1,000 (`999,950` → `1.0M`), and `chartSeries` reads ApexCharts-style points (`{ x, y }`, `[x, y]`) with the new `chartPointLabels`. ArrowUp and ArrowDown stop at the Calendar grid's edge. The carousel's snap points before it measures match `carouselPageCount`. A bound `apuiThemeToggle` applies values set from outside.
