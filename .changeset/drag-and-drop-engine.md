---
'@artisanpack-ui/behavior': minor
---

Add the drag-and-drop engine (D-057), ported from `@artisanpack-ui/livewire-drag-and-drop` 2.1 so Livewire, React and Vue can drag, reorder and announce moves the same way. Livewire Drag and Drop switches onto it in a later release (livewire-drag-and-drop#23).

- `registerDragContext`, `registerDragItem`, `configureDragAndDrop`, `revertDragItem`, `revertDragMove` and `applyDragMove`, with the same `drag:*` events and `data-drag-*` attributes as Livewire Drag and Drop 2.1.
- A controlled mode for frameworks that own their DOM: the engine reports moves (`toContext`, `toIndex`, `fromOrderedIds`, `toOrderedIds`) instead of moving nodes, draws the drop indicator as an overlay, and refocuses the item after a keyboard drop.
- React: `useDragContext`, `useDragItem` and `useDragItems`. Vue: `v-drag-context`, `v-drag-item` and `useDragContext`.
- RTL: arrow keys follow what's on screen, horizontal drops land where the indicator shows, and the indicator sits on the inline-start edge with the primary color token.
