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

type Listener = EventListener;

/** The last props applied to each node, per machine, for events and removed keys. */
const applied = new WeakMap<Element, Map<string, Attrs>>();

/** Properties that are set on the element rather than as attributes. */
const PROPERTIES = new Set(['value', 'checked', 'selected']);

/** Keys never written: `children` is content, and the author owns `class`. */
const SKIPPED = new Set(['children', 'class', 'className']);

const isEvent = (key: string) => /^on[A-Z]/.test(key) || /^on[a-z]+$/.test(key);
const eventName = (key: string) => key.slice(2).toLowerCase();
const cssName = (key: string) =>
  key.startsWith('--') ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const attributeName = (node: Element, key: string) =>
  node.namespaceURI === 'http://www.w3.org/2000/svg' ? key : key.toLowerCase();

function applyStyle(node: Element, previous: unknown, next: unknown): void {
  const style = (node as HTMLElement).style;
  if (!style) return;
  const before = (previous && typeof previous === 'object' ? previous : {}) as Record<
    string,
    unknown
  >;
  const after = (next && typeof next === 'object' ? next : {}) as Record<string, unknown>;
  for (const key of Object.keys(before)) {
    if (after[key] == null) style.removeProperty(cssName(key));
  }
  for (const [key, value] of Object.entries(after)) {
    if (value == null) {
      style.removeProperty(cssName(key));
      continue;
    }
    const css = cssName(key);
    if (style.getPropertyValue(css) !== String(value)) style.setProperty(css, String(value));
  }
}

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
 * Applies `attrs` to `node` and returns a function that removes the event
 * listeners it added. `owner` scopes the bookkeeping, so two machines can
 * share a node.
 */
export function applyProps(node: Element, attrs: Attrs, owner = 'default'): () => void {
  let byOwner = applied.get(node);
  if (!byOwner) {
    byOwner = new Map();
    applied.set(node, byOwner);
  }
  const previous = byOwner.get(owner) ?? {};

  for (const [key, value] of Object.entries(previous)) {
    if (isEvent(key)) {
      if (attrs[key] !== value) node.removeEventListener(eventName(key), value as Listener);
    } else if (!(key in attrs) && !SKIPPED.has(key)) {
      if (key === 'style') applyStyle(node, value, undefined);
      else applyAttribute(node, key, undefined);
    }
  }

  for (const [key, value] of Object.entries(attrs)) {
    if (SKIPPED.has(key)) continue;
    if (isEvent(key)) {
      if (typeof value === 'function' && previous[key] !== value) {
        node.addEventListener(eventName(key), value as Listener);
      }
      continue;
    }
    if (key === 'style') applyStyle(node, previous.style, value);
    else applyAttribute(node, key, value);
  }

  byOwner.set(owner, attrs);
  return () => removeProps(node, owner);
}

/** Removes the event listeners `applyProps` added for `owner`. Attributes stay. */
export function removeProps(node: Element, owner = 'default'): void {
  const byOwner = applied.get(node);
  const previous = byOwner?.get(owner);
  if (!byOwner || !previous) return;
  for (const [key, value] of Object.entries(previous)) {
    if (isEvent(key) && typeof value === 'function') {
      node.removeEventListener(eventName(key), value as Listener);
    }
  }
  byOwner.delete(owner);
  if (!byOwner.size) applied.delete(node);
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
