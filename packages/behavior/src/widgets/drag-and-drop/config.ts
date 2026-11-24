/**
 * Drag-and-drop configuration: announcement templates, key bindings and
 * tuning, shared by every stack (D-057). Ported from
 * `@artisanpack-ui/livewire-drag-and-drop` 2.1, whose defaults it keeps.
 */

/**
 * The announcement templates. Placeholders: `{item}`, `{position}`,
 * `{total}`, `{container}`. `item` and `container` are the fallback labels
 * for an element without a label. Translate them through
 * `configureDragAndDrop({ messages })` or a context's `messages`.
 */
export const DRAG_MESSAGES = {
  item: 'Item',
  container: 'the list',
  instructions:
    'Press Space or Enter to pick up. While holding, use the arrow keys to move, Home or End to jump to the start or end, Space or Enter to drop, and Escape to cancel.',
  grabbed: '{item} grabbed. Position {position} of {total} in {container}.',
  moved: '{item} moved to position {position} of {total} in {container}.',
  movedToContainer: '{item} moved to {container}, position {position} of {total}.',
  dropped: '{item} dropped in {container}, position {position} of {total}.',
  cancelled: 'Move cancelled. {item} returned to {container}, position {position} of {total}.',
  rejected: '{item} cannot be dropped in {container}.',
  reverted: '{item} moved back to {container}, position {position} of {total}.',
  noContainer: 'There is no other container in that direction.',
} as const;

/** The announcement templates' keys. */
export type DragMessageKey = keyof typeof DRAG_MESSAGES;

/** Announcement templates, keyed like {@link DRAG_MESSAGES}. */
export type DragMessages = Record<DragMessageKey, string>;

/**
 * The key bindings (`KeyboardEvent.key` values), as a left-to-right vertical
 * list sees them. A horizontal list swaps the within-list and
 * between-container bindings, and right-to-left swaps the meaning of the
 * left and right arrows (D-057), so the keys follow what's on screen.
 */
export const DRAG_KEYS = {
  grab: [' ', 'Enter'],
  cancel: ['Escape'],
  previous: ['ArrowUp'],
  next: ['ArrowDown'],
  previousContainer: ['ArrowLeft'],
  nextContainer: ['ArrowRight'],
  first: ['Home'],
  last: ['End'],
} as const;

/** A key binding's action. */
export type DragKeyAction = keyof typeof DRAG_KEYS;

/** Options for {@link configureDragAndDrop}. */
export interface DragAndDropConfig {
  /** Announcement templates to override. */
  messages?: Partial<DragMessages>;
  /** Key bindings to override: a key or a list of keys per action. */
  keys?: Partial<Record<DragKeyAction, string | readonly string[]>>;
  /** How far a mouse or pen moves, in px, before a drag starts. @defaultValue 5 */
  dragThreshold?: number;
  /** How long a touch is held, in ms, before a drag starts. @defaultValue 200 */
  touchDelay?: number;
  /** Auto-scroll near a scroll container's edge while dragging. @defaultValue `{ edge: 48, speed: 20 }` */
  autoScroll?: { edge?: number; speed?: number };
}

/** The settings in effect. */
export interface DragAndDropSettings {
  messages: DragMessages;
  keys: Record<DragKeyAction, string[]>;
  dragThreshold: number;
  touchDelay: number;
  autoScroll: { edge: number; speed: number };
}

const cloneKeys = (keys: Record<string, readonly string[]>) =>
  Object.fromEntries(Object.entries(keys).map(([action, list]) => [action, [...list]])) as Record<
    DragKeyAction,
    string[]
  >;

const defaults = (): DragAndDropSettings => ({
  messages: { ...DRAG_MESSAGES },
  keys: cloneKeys(DRAG_KEYS),
  dragThreshold: 5,
  touchDelay: 200,
  autoScroll: { edge: 48, speed: 20 },
});

/** The settings in effect. Change them with {@link configureDragAndDrop}. */
export const dragSettings: DragAndDropSettings = defaults();

/** Merges options into the settings for every drag-and-drop on the page. */
export function configureDragAndDrop(options: DragAndDropConfig = {}): DragAndDropSettings {
  if (options.messages) Object.assign(dragSettings.messages, options.messages);
  if (options.keys) {
    for (const [action, list] of Object.entries(options.keys)) {
      if (list === undefined) continue;
      dragSettings.keys[action as DragKeyAction] =
        typeof list === 'string' ? [list] : [...(list as readonly string[])];
    }
  }
  if (typeof options.dragThreshold === 'number') dragSettings.dragThreshold = options.dragThreshold;
  if (typeof options.touchDelay === 'number') dragSettings.touchDelay = options.touchDelay;
  if (options.autoScroll) Object.assign(dragSettings.autoScroll, options.autoScroll);
  return dragSettings;
}

/** Restores the default settings. */
export function resetDragAndDropConfig(): void {
  Object.assign(dragSettings, defaults());
}

/** Replaces `{placeholder}` tokens; unknown or empty placeholders stay as they are. */
export function formatDragMessage(
  template: string | null | undefined,
  values: Record<string, unknown> = {},
): string {
  return String(template ?? '').replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) &&
    values[key] !== undefined &&
    values[key] !== null
      ? String(values[key])
      : match,
  );
}
