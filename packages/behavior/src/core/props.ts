/**
 * Applies the props a behavior machine computes for a part (attributes, ARIA,
 * data attributes, inline style and event handlers) to a DOM node.
 *
 * Unlike Zag's `spreadProps`, attributes are compared with the DOM, not with
 * the last props written. A server re-render that morphs the node (Livewire,
 * htmx, Turbo) resets its attributes to the server's HTML, and a cache of the
 * last write would then skip the attributes that need writing again.
 */

/** Props as `connect()` returns them through `normalizeProps`. */
export type Attrs = Record<string, unknown>;

/** The props last applied to each node, for removed keys. */
const applied = new WeakMap<Element, Attrs>();

interface Handler {
  current: ((event: Event) => void) | undefined;
  listener: EventListener;
}

/**
 * One listener per node and event, calling the latest handler. `connect()`
 * returns new handler functions on every render; swapping them here avoids
 * removing and adding DOM listeners each time.
 */
const handlers = new WeakMap<Element, Map<string, Handler>>();

/** Properties that are set on the element rather than as attributes. */
const PROPERTIES = new Set(['value', 'checked', 'selected']);

/** Keys never written: `children` is content, and the author owns `class`. */
const SKIPPED = new Set(['children', 'class', 'className']);

/** Whether a prop key is an event handler (`onClick`, `onpointerdown`). */
const isEvent = (key: string) => /^on[A-Z]/.test(key) || /^on[a-z]+$/.test(key);
/** The DOM event name for a handler key: `onPointerDown` → `pointerdown`. */
const eventName = (key: string) => key.slice(2).toLowerCase();
/** A style key as a CSS property: `pointerEvents` → `pointer-events`; custom properties pass through. */
const cssName = (key: string) =>
  key.startsWith('--') ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
/** The attribute name to write: lowercased, except on SVG, where case matters. */
const attributeName = (node: Element, key: string) =>
  node.namespaceURI === 'http://www.w3.org/2000/svg' ? key : key.toLowerCase();

/** Writes style declarations, removing only those the previous props set and these drop. */
function applyStyle(node: Element, previous: unknown, next: unknown): void {
  const style = (node as HTMLElement).style;
  if (!style) return;
  const before = (previous && typeof previous === 'object' ? previous : {}) as Record<
    string,
    unknown
  >;
  const after = (next && typeof next === 'object' ? next : {}) as Record<string, unknown>;
  // Only remove what these props set before. A null value means "not ours",
  // and machine effects write some of the same properties directly (a modal
  // layer's pointer-events), which must survive a re-render.
  for (const [key, value] of Object.entries(before)) {
    if (value != null && after[key] == null) style.removeProperty(cssName(key));
  }
  for (const [key, value] of Object.entries(after)) {
    if (value == null) continue;
    const css = cssName(key);
    if (style.getPropertyValue(css) !== String(value)) style.setProperty(css, String(value));
  }
}

/** Writes one attribute or property, skipping writes that would not change it. */
function applyAttribute(node: Element, key: string, value: unknown): void {
  if (PROPERTIES.has(key)) {
    const element = node as unknown as Record<string, unknown>;
    const next = key === 'value' ? (value ?? '') : Boolean(value);
    // Writing the same value moves the caret in some browsers.
    if (element[key] !== next) element[key] = next;
    return;
  }
  const name = attributeName(node, key);
  if (value == null || (value === false && !name.startsWith('aria-'))) {
    if (node.hasAttribute(name)) node.removeAttribute(name);
    return;
  }
  const text = value === true && !name.startsWith('aria-') ? '' : String(value);
  if (node.getAttribute(name) !== text) node.setAttribute(name, text);
}

/**
 * Applies `attrs` to `node`. Attributes the previous call set and these
 * don't are removed; event handlers are swapped behind one listener per
 * event. Returns a function that removes the listeners.
 */
export function applyProps(node: Element, attrs: Attrs): () => void {
  const previous = applied.get(node) ?? {};

  for (const [key, value] of Object.entries(previous)) {
    if (isEvent(key) || key in attrs || SKIPPED.has(key)) continue;
    if (key === 'style') applyStyle(node, value, undefined);
    else applyAttribute(node, key, undefined);
  }

  let byEvent = handlers.get(node);
  const events = new Set<string>();
  for (const [key, value] of Object.entries(attrs)) {
    if (SKIPPED.has(key)) continue;
    if (isEvent(key)) {
      if (typeof value !== 'function') continue;
      const name = eventName(key);
      events.add(name);
      if (!byEvent) {
        byEvent = new Map();
        handlers.set(node, byEvent);
      }
      let handler = byEvent.get(name);
      if (!handler) {
        const created: Handler = {
          current: undefined,
          listener: (event) => created.current?.(event),
        };
        handler = created;
        byEvent.set(name, handler);
        node.addEventListener(name, handler.listener);
      }
      handler.current = value as (event: Event) => void;
      continue;
    }
    if (key === 'style') applyStyle(node, previous.style, value);
    else applyAttribute(node, key, value);
  }
  for (const [name, handler] of byEvent ?? []) {
    if (events.has(name)) continue;
    node.removeEventListener(name, handler.listener);
    byEvent!.delete(name);
  }

  applied.set(node, attrs);
  return () => removeProps(node);
}

/** Removes the event listeners `applyProps` added. Attributes stay. */
export function removeProps(node: Element): void {
  for (const [name, handler] of handlers.get(node) ?? []) {
    node.removeEventListener(name, handler.listener);
  }
  handlers.delete(node);
  applied.delete(node);
}

/**
 * Whether the node still carries `attrs`, ignoring events. False after a
 * morph has reset attributes the machine set.
 */
export function hasProps(node: Element, attrs: Attrs): boolean {
  for (const [key, value] of Object.entries(attrs)) {
    if (SKIPPED.has(key) || isEvent(key)) continue;
    if (key === 'style') {
      const style = (node as HTMLElement).style;
      for (const [prop, v] of Object.entries((value ?? {}) as Record<string, unknown>)) {
        if (v != null && style.getPropertyValue(cssName(prop)) !== String(v)) return false;
      }
      continue;
    }
    if (PROPERTIES.has(key)) continue;
    const name = attributeName(node, key);
    const expected =
      value == null || (value === false && !name.startsWith('aria-'))
        ? null
        : value === true && !name.startsWith('aria-')
          ? ''
          : String(value);
    if (node.getAttribute(name) !== expected) return false;
  }
  return true;
}
