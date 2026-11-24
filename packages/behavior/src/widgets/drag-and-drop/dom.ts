/**
 * Drag-and-drop DOM helpers: finding contexts and items, context options,
 * flow direction, ARIA decoration and announcements (D-057).
 *
 * A context is a list items are dragged within and between; an item is one
 * draggable entry. Both are found by attribute, so they survive Livewire
 * morphs and framework re-renders: `[data-drag-context]` and
 * `[data-drag-item]`, plus the Alpine adapter's `x-drag-context` and
 * `x-drag-item`. Options and ids an adapter registers are kept in weak maps
 * keyed by element, never on the element itself.
 */
import { dragSettings, formatDragMessage, type DragMessages } from './config';

/** Matches drag contexts. */
export const CONTEXT_SELECTOR = '[x-drag-context], [data-drag-context]';
/** Matches drag items. */
export const ITEM_SELECTOR = '[x-drag-item], [data-drag-item]';
/** The id prefix of the hidden instructions items point `aria-describedby` at. */
export const INSTRUCTIONS_PREFIX = 'ldd-instructions';

/** The id of a context or an item, as the author gave it. */
export type DragId = string | number;

/** What `accepts` is asked about. */
export interface DragAcceptDetail {
  moveId: string;
  itemId: DragId | null;
  group: string | null;
  fromContext: DragId | null;
  fromIndex: number;
  toContext: DragId | null;
  /** The dragged item (not enumerable). */
  readonly itemElement?: HTMLElement;
  /** The context it came from (not enumerable). */
  readonly fromElement?: HTMLElement;
  /** The context asked about (not enumerable). */
  readonly toElement?: HTMLElement;
}

/** Options for a drag context. */
export interface DragContextOptions {
  /** The context's id in events. @defaultValue `data-drag-context-id`, else the element id */
  id?: DragId | null;
  /** Contexts sharing a group trade items; without one, items only reorder. */
  group?: string | null;
  /** The context's name in announcements and its `aria-label`. */
  label?: string | null;
  /** Refuses drops while true. Its own items can still be dragged out (a full column). */
  disabled?: boolean;
  /** Return false to refuse an item. A throw refuses it too. */
  accepts?: ((detail: DragAcceptDetail) => boolean) | null;
  /** Announcement templates for this context. */
  messages?: Partial<DragMessages>;
  /** The list's axis. @defaultValue measured: a flex row is horizontal */
  orientation?: 'vertical' | 'horizontal';
  /**
   * The framework owns the DOM: the engine never moves items, reports the
   * move in `drag:drop`/`drag:end`/`drag:revert` and leaves the re-render to
   * the framework. React and Vue set it; Alpine and Livewire don't.
   * @defaultValue false
   */
  controlled?: boolean;
}

/** A context's options with every default resolved. */
export interface ResolvedDragContextOptions {
  id: DragId | null;
  group: string | null;
  label: string | null;
  disabled: boolean;
  accepts: ((detail: DragAcceptDetail) => boolean) | null;
  messages: Partial<DragMessages>;
  orientation: 'vertical' | 'horizontal';
  controlled: boolean;
}

type OptionsSource = DragContextOptions | (() => DragContextOptions);

const contextSources = new WeakMap<Element, OptionsSource>();
const itemIds = new WeakMap<Element, DragId | null>();
const registeredContexts = new Set<HTMLElement>();
const instructionIds = new Map<string, string>();
let liveRegion: HTMLElement | null = null;
let lastAnnouncement = '';

/** Keeps a context's options (or a getter, read on every use). */
export function setContextSource(context: Element, source: OptionsSource | null): void {
  if (source) contextSources.set(context, source);
  else contextSources.delete(context);
}

/** Keeps an item's id. */
export function setItemId(item: Element, id: DragId | null | undefined): void {
  if (id === undefined) itemIds.delete(item);
  else itemIds.set(item, id);
}

/** The context an item belongs to: the nearest one above it, never itself. */
export function ownerContext(item: Element | null | undefined): HTMLElement | null {
  const parent = item ? item.parentElement : null;
  return parent ? (parent.closest(CONTEXT_SELECTOR) as HTMLElement | null) : null;
}

/** A context's own items in document order, without those of nested contexts. */
export function getItems(context: Element): HTMLElement[] {
  return Array.from(context.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (item) => ownerContext(item) === context,
  );
}

/** Where items go in a context without any: `[data-drag-items]`, else the items' parent, else the context. */
export function itemsParent(context: Element): Element {
  const marked = Array.from(context.querySelectorAll('[data-drag-items]')).find(
    (el) =>
      el.parentElement &&
      el.parentElement.closest(CONTEXT_SELECTOR) === context &&
      !el.matches(CONTEXT_SELECTOR),
  );
  if (marked) return marked;
  const items = getItems(context);
  return items.length ? (items[0]!.parentNode as Element) : context;
}

/** Inserts `node` so it ends up at `index` among the context's items, not counting `node` or `exclude`. */
export function insertAtIndex(
  context: Element,
  node: Node,
  index: number,
  exclude: readonly Element[] = [],
): void {
  const items = getItems(context).filter((item) => item !== node && !exclude.includes(item));
  if (index < items.length) {
    const reference = items[Math.max(0, index)]!;
    reference.parentNode!.insertBefore(node, reference);
  } else if (items.length) {
    const last = items[items.length - 1]!;
    last.parentNode!.insertBefore(node, last.nextSibling);
  } else {
    itemsParent(context).appendChild(node);
  }
}

/** An item's id: the registered one, else `data-drag-id`. */
export function itemId(item: Element | null | undefined): DragId | null {
  if (!item) return null;
  if (itemIds.has(item)) return itemIds.get(item) ?? null;
  return (item as HTMLElement).dataset?.dragId ?? null;
}

/** The ids of a context's items, in order. */
export function orderedIds(context: Element): (DragId | null)[] {
  return getItems(context).map(itemId);
}

function parseMessages(value: string | null): Partial<DragMessages> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? (parsed as Partial<DragMessages>) : {};
  } catch (error) {
    console.warn('[drag-and-drop] Ignoring invalid data-drag-messages JSON.', error);
    return {};
  }
}

const computed = (el: Element): CSSStyleDeclaration | null =>
  typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
    ? window.getComputedStyle(el)
    : null;

function detectOrientation(context: Element): 'vertical' | 'horizontal' {
  const style = computed(itemsParent(context));
  if (!style) return 'vertical';
  const isFlex = style.display === 'flex' || style.display === 'inline-flex';
  return isFlex && (style.flexDirection || 'row').startsWith('row') ? 'horizontal' : 'vertical';
}

/**
 * A context's options: the registered ones win over `data-drag-*`
 * attributes, which win over the defaults.
 */
export function contextOptions(context: Element): ResolvedDragContextOptions {
  const source = contextSources.get(context);
  let options: DragContextOptions = {};
  if (typeof source === 'function') {
    try {
      const value = source();
      options = value && typeof value === 'object' ? value : {};
    } catch {
      options = {};
    }
  } else if (source) {
    options = source;
  }
  const disabledAttr = context.getAttribute('data-drag-disabled');
  const controlledAttr = context.getAttribute('data-drag-controlled');

  return {
    id: options.id ?? context.getAttribute('data-drag-context-id') ?? (context.id || null),
    group:
      options.group ??
      context.getAttribute('data-drag-group') ??
      context.getAttribute('data-group') ??
      null,
    label:
      options.label ??
      context.getAttribute('data-drag-label') ??
      context.getAttribute('aria-label') ??
      null,
    disabled:
      options.disabled !== undefined
        ? Boolean(options.disabled)
        : disabledAttr !== null && disabledAttr !== 'false',
    accepts: typeof options.accepts === 'function' ? options.accepts : null,
    messages: {
      ...parseMessages(context.getAttribute('data-drag-messages')),
      ...(options.messages ?? {}),
    },
    orientation:
      options.orientation ??
      (context.getAttribute('data-drag-orientation') as 'vertical' | 'horizontal' | null) ??
      detectOrientation(context),
    controlled:
      options.controlled !== undefined
        ? Boolean(options.controlled)
        : controlledAttr !== null && controlledAttr !== 'false',
  };
}

export function contextId(context: Element | null | undefined): DragId | null {
  return context ? contextOptions(context).id : null;
}

/** Whether the context's text runs right to left. */
export function isRtl(context: Element): boolean {
  return computed(itemsParent(context))?.direction === 'rtl';
}

/**
 * Whether a context's items run against its axis's start: right to left in a
 * horizontal list (RTL text, or `row-reverse` in LTR), bottom to top in a
 * vertical one (`column-reverse`).
 */
export function isFlowReversed(context: Element): boolean {
  const parent = itemsParent(context);
  const style = computed(parent);
  if (!style) return false;
  const isFlex = style.display === 'flex' || style.display === 'inline-flex';
  const reversed = isFlex && (style.flexDirection || '').endsWith('-reverse');
  if (contextOptions(context).orientation === 'horizontal') {
    return (style.direction === 'rtl') !== reversed;
  }
  return reversed;
}

/** All connected contexts in a group, in document order. */
export function contextsInGroup(group: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(CONTEXT_SELECTOR)).filter(
    (context) => contextOptions(context).group === group,
  );
}

export function findContextById(id: DragId | null | undefined): HTMLElement | null {
  if (id === null || id === undefined) return null;
  return (
    Array.from(document.querySelectorAll<HTMLElement>(CONTEXT_SELECTOR)).find(
      (context) => String(contextId(context)) === String(id),
    ) ?? null
  );
}

export function findItemById(id: DragId | null | undefined): HTMLElement | null {
  if (id === null || id === undefined) return null;
  return (
    Array.from(document.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).find(
      (item) => String(itemId(item)) === String(id),
    ) ?? null
  );
}

export function messagesFor(context: Element | null | undefined): DragMessages {
  return context
    ? ({ ...dragSettings.messages, ...contextOptions(context).messages } as DragMessages)
    : { ...dragSettings.messages };
}

/** The values announcements describe an item with. */
export interface DragDescription {
  item: string;
  container: string;
  position: number;
  total: number;
}

function itemLabel(item: Element, messages: DragMessages): string {
  return item.getAttribute('data-drag-label') || item.getAttribute('aria-label') || messages.item;
}

/** Describes an item where it sits in the DOM. */
export function describe(item: Element, context: Element | null): DragDescription {
  const messages = messagesFor(context);
  const items = context ? getItems(context) : [];
  return {
    item: itemLabel(item, messages),
    container: (context && contextOptions(context).label) || messages.container,
    position: items.indexOf(item as HTMLElement) + 1,
    total: items.length,
  };
}

/**
 * Describes an item as if it sat at `index` in `context` (controlled mode,
 * where the DOM doesn't move until the framework re-renders).
 */
export function describeAt(item: Element, context: Element, index: number): DragDescription {
  const messages = messagesFor(context);
  const others = getItems(context).filter((other) => other !== item);
  return {
    item: itemLabel(item, messages),
    container: contextOptions(context).label || messages.container,
    position: Math.min(Math.max(index, 0), others.length) + 1,
    total: others.length + 1,
  };
}

const visuallyHidden: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

function getLiveRegion(): HTMLElement {
  if (!liveRegion || !liveRegion.isConnected) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('data-drag-live-region', '');
    liveRegion.className = 'sr-only';
    Object.assign(liveRegion.style, visuallyHidden);
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
}

/**
 * Speaks a message through the shared live region. Repeating the last
 * message toggles a trailing no-break space so screen readers say it again.
 */
export function announce(
  message: string | null | undefined,
  priority: 'polite' | 'assertive' = 'polite',
): void {
  if (!message) return;
  const region = getLiveRegion();
  let text = String(message);
  if (text === lastAnnouncement.replace(/ $/, '')) {
    text = lastAnnouncement.endsWith(' ') ? text : `${text} `;
  }
  region.setAttribute('aria-live', priority);
  region.textContent = text;
  lastAnnouncement = text;
}

/** Announces a template for an item, described by `values`. */
export function announceDescribed(
  key: keyof DragMessages,
  context: Element | null,
  values: DragDescription,
  priority: 'polite' | 'assertive' = 'polite',
): void {
  announce(
    formatDragMessage(messagesFor(context)[key], values as unknown as Record<string, unknown>),
    priority,
  );
}

/** Announces a template for an item where it sits in the DOM. */
export function announceFor(
  key: keyof DragMessages,
  item: Element,
  context: Element | null,
  priority: 'polite' | 'assertive' = 'polite',
): void {
  announceDescribed(key, context, describe(item, context), priority);
}

/** The id of the hidden element holding `text`, created on first use. */
export function instructionsId(text: string): string {
  const known = instructionIds.get(text);
  const id = known ?? `${INSTRUCTIONS_PREFIX}-${instructionIds.size + 1}`;
  let element = known ? document.getElementById(known) : null;
  if (!element) {
    element = document.createElement('div');
    element.id = id;
    element.hidden = true;
    element.setAttribute('data-drag-instructions', '');
    element.textContent = text;
    document.body.appendChild(element);
    instructionIds.set(text, id);
  }
  return id;
}

/** Applies a context's role and name without overriding the author's markup. */
export function decorateContext(context: HTMLElement): void {
  registeredContexts.add(context);
  if (!context.hasAttribute('data-drag-context')) context.setAttribute('data-drag-context', '');
  if (!context.hasAttribute('role')) context.setAttribute('role', 'group');
  const { label } = contextOptions(context);
  if (label && !context.hasAttribute('aria-label') && !context.hasAttribute('aria-labelledby')) {
    context.setAttribute('aria-label', label);
  }
}

export function unregisterContext(context: HTMLElement): void {
  registeredContexts.delete(context);
  context.removeAttribute('data-drag-context');
}

/** Makes an item focusable and points `aria-describedby` at the instructions. */
export function decorateItem(item: HTMLElement): void {
  const context = ownerContext(item);
  if (!context) return;
  if (!item.hasAttribute('tabindex')) item.tabIndex = 0;
  if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
  item.removeAttribute('aria-grabbed');

  const id = instructionsId(messagesFor(context).instructions);
  const tokens = (item.getAttribute('aria-describedby') || '')
    .split(/\s+/)
    .filter((token) => token && !token.startsWith(INSTRUCTIONS_PREFIX));
  tokens.push(id);
  item.setAttribute('aria-describedby', tokens.join(' '));
}

/** Re-applies decoration in a subtree, after a Livewire morph strips attributes. */
export function rehydrate(root: Element | null | undefined): void {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  registeredContexts.forEach((context) => {
    if (context.isConnected && root.contains(context)) decorateContext(context);
  });
  const contexts = Array.from(root.querySelectorAll<HTMLElement>(CONTEXT_SELECTOR));
  if (root.matches(CONTEXT_SELECTOR)) contexts.unshift(root as HTMLElement);
  contexts.forEach(decorateContext);
  const items = Array.from(root.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
  if (root.matches(ITEM_SELECTOR)) items.unshift(root as HTMLElement);
  items.forEach(decorateItem);
}

export function resetDom(): void {
  registeredContexts.clear();
  liveRegion = null;
  lastAnnouncement = '';
  instructionIds.clear();
}
