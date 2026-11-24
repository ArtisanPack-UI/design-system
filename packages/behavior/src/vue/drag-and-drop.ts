/**
 * Drag and drop for the Vue adapter (D-057), on the engine Livewire Drag and
 * Drop runs, so pointer, touch and keyboard moves and their announcements
 * match in every stack. Contexts are controlled: the engine never moves a
 * node, it reports the move and Vue renders it.
 *
 * Two directives work anywhere, `v-for` included; the drag events are plain
 * DOM events on the context:
 *
 *   <ul v-drag-context="{ id: 'todo', group: 'board', label: 'To do' }"
 *       @drag:end="$event.detail.toContext === 'todo' && (lists = applyDragMove(lists, $event.detail))">
 *     <li v-for="task in lists.todo" :key="task.id" v-drag-item="task.id" :data-drag-label="task.title">
 *       {{ task.title }}
 *     </li>
 *   </ul>
 *
 * Apply moves on `drag:end`, which fires (on both lists of a move) only once
 * a drop is committed; `drag:drop` is where a drop can still be refused.
 *
 * Register them with `app.directive('drag-context', vDragContext)` and
 * `app.directive('drag-item', vDragItem)`, or import them into a
 * `<script setup>` as `vDragContext` and `vDragItem`. `useDragContext()` is
 * the composable form for a template ref, with handlers. Both render the
 * same data attributes as the Alpine directives, on the server too.
 */
import {
  computed,
  onBeforeUnmount,
  toValue,
  watch,
  type ComputedRef,
  type Directive,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue';

import {
  registerDragContext,
  registerDragItem,
  rehydrateDragAndDrop,
  type DragCancelDetail,
  type DragContextOptions,
  type DragDropDetail,
  type DragEndDetail,
  type DragEventDetail,
  type DragId,
  type DragOverDetail,
} from '../widgets/drag-and-drop';

/** The attributes a drag context renders. */
export function dragContextAttrs(options: DragContextOptions = {}): Record<string, string> {
  const attrs: Record<string, string> = { role: 'group', 'data-drag-context': '' };
  if (options.controlled ?? true) attrs['data-drag-controlled'] = '';
  if (options.label) attrs['aria-label'] = options.label;
  if (options.id !== undefined && options.id !== null)
    attrs['data-drag-context-id'] = String(options.id);
  if (options.group) attrs['data-drag-group'] = options.group;
  if (options.orientation) attrs['data-drag-orientation'] = options.orientation;
  if (options.disabled) attrs['data-drag-disabled'] = '';
  return attrs;
}

/** The attributes a drag item renders. */
export function dragItemAttrs(id: DragId): Record<string, string | number> {
  return { role: 'button', tabindex: 0, 'data-drag-item': '', 'data-drag-id': String(id) };
}

const controlledByDefault = (
  options: DragContextOptions | null | undefined,
): DragContextOptions => ({
  ...(options ?? {}),
  controlled: options?.controlled ?? true,
});

/** The engine options in `options`, without the handlers; controlled unless told otherwise. */
const engineOptions = (options: DragContextOptions): DragContextOptions => ({
  id: options.id,
  group: options.group,
  label: options.label,
  disabled: options.disabled,
  accepts: options.accepts,
  messages: options.messages,
  orientation: options.orientation,
  controlled: options.controlled ?? true,
});

interface ContextState {
  options: DragContextOptions;
  unregister: () => void;
}

/** Writes the context attributes on the element, removing ones that no longer apply. */
function applyContextAttrs(
  el: HTMLElement,
  next: DragContextOptions,
  previous?: DragContextOptions,
): void {
  const attrs = dragContextAttrs(next);
  if (previous) {
    for (const name of Object.keys(dragContextAttrs(previous))) {
      if (!(name in attrs)) el.removeAttribute(name);
    }
  }
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
}

const contexts = new WeakMap<HTMLElement, ContextState>();

/** `v-drag-context="{ id, group, label, accepts, … }"`: makes the element a controlled drag context. */
export const vDragContext: Directive<HTMLElement, DragContextOptions | null | undefined> = {
  // Children mount before their parent, so the attributes go on first: a
  // `v-drag-item` inside finds its context when it mounts.
  beforeMount(el, binding) {
    applyContextAttrs(el, controlledByDefault(binding.value));
  },
  mounted(el, binding) {
    const state: ContextState = {
      options: controlledByDefault(binding.value),
      unregister: () => {},
    };
    state.unregister = registerDragContext(el, () => state.options);
    contexts.set(el, state);
    rehydrateDragAndDrop(el);
  },
  updated(el, binding) {
    const state = contexts.get(el);
    if (!state) return;
    const next = controlledByDefault(binding.value);
    applyContextAttrs(el, next, state.options);
    state.options = next;
  },
  beforeUnmount(el) {
    contexts.get(el)?.unregister();
    contexts.delete(el);
  },
  getSSRProps(binding) {
    return dragContextAttrs(controlledByDefault(binding.value));
  },
};

interface ItemState {
  id: DragId;
  unregister: ReturnType<typeof registerDragItem>;
}

const items = new WeakMap<HTMLElement, ItemState>();

/** `v-drag-item="task.id"`: makes the element a drag item. */
export const vDragItem: Directive<HTMLElement, DragId> = {
  mounted(el, binding) {
    if (!el.hasAttribute('data-drag-id')) el.setAttribute('data-drag-id', String(binding.value));
    items.set(el, { id: binding.value, unregister: registerDragItem(el, binding.value) });
  },
  updated(el, binding) {
    const state = items.get(el);
    if (!state || String(state.id) === String(binding.value)) return;
    state.unregister();
    el.setAttribute('data-drag-id', String(binding.value));
    items.set(el, { id: binding.value, unregister: registerDragItem(el, binding.value) });
  },
  // Runs while the item is still in the page: a drag of it is cancelled now,
  // not left stuck once Vue removes the node.
  beforeUnmount(el) {
    items.get(el)?.unregister({ removing: true });
    items.delete(el);
  },
  getSSRProps(binding) {
    return dragItemAttrs(binding.value);
  },
};

/** Options for {@link useDragContext}. */
export interface UseDragContextOptions extends DragContextOptions {
  /** `drag:start`; call `event.preventDefault()` to refuse the drag. */
  onDragStart?: (detail: DragEventDetail, event: CustomEvent<DragEventDetail>) => void;
  /** `drag:over`: the item is over this context. */
  onDragOver?: (detail: DragOverDetail, event: CustomEvent<DragOverDetail>) => void;
  /** `drag:drop`: the move is about to happen; refuse it with `detail.reject(message)`. */
  onDrop?: (detail: DragDropDetail, event: CustomEvent<DragDropDetail>) => void;
  /** `drag:end`: the move is committed; render it here (`applyDragMove`). */
  onDragEnd?: (detail: DragEndDetail, event: CustomEvent<DragEndDetail>) => void;
  /** `drag:cancel`. */
  onDragCancel?: (detail: DragCancelDetail, event: CustomEvent<DragCancelDetail>) => void;
  /** `drag:revert`: undo a move (`applyDragMove` works here too). */
  onDragRevert?: (detail: DragEndDetail, event: CustomEvent<DragEndDetail>) => void;
}

const EVENTS = [
  ['drag:start', 'onDragStart'],
  ['drag:over', 'onDragOver'],
  ['drag:drop', 'onDrop'],
  ['drag:end', 'onDragEnd'],
  ['drag:cancel', 'onDragCancel'],
  ['drag:revert', 'onDragRevert'],
] as const;

/**
 * Makes the element in `target` a drag context while it's mounted. Options
 * are an object, a ref or a getter, read on every use. Returns the
 * attributes to bind (`v-bind="attrs"`), which also render on the server.
 */
export function useDragContext(
  target: Ref<HTMLElement | null | undefined>,
  options: MaybeRefOrGetter<UseDragContextOptions> = {},
): { attrs: ComputedRef<Record<string, string>> } {
  const current = () => toValue(options) ?? {};
  let cleanup: (() => void) | null = null;

  const attach = (element: HTMLElement | null | undefined) => {
    cleanup?.();
    cleanup = null;
    if (!element) return;
    const unregister = registerDragContext(element, () => engineOptions(current()));
    const listeners = EVENTS.map(([name, handler]) => {
      const listener = (event: Event) => {
        const callback = current()[handler] as
          ((detail: unknown, event: CustomEvent) => void) | undefined;
        callback?.((event as CustomEvent).detail, event as CustomEvent);
      };
      element.addEventListener(name, listener);
      return () => element.removeEventListener(name, listener);
    });
    cleanup = () => {
      listeners.forEach((off) => off());
      unregister();
    };
  };

  watch(target, attach, { immediate: true, flush: 'post' });
  onBeforeUnmount(() => {
    cleanup?.();
    cleanup = null;
  });

  return { attrs: computed(() => dragContextAttrs(engineOptions(current()))) };
}
