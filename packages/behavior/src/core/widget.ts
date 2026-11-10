/**
 * The adapter interface (#33). A widget definition pairs a state machine with
 * its `connect()`, the function that turns machine state into props for each
 * part. Every stack drives the same definitions:
 *
 * - Alpine (and plain DOM) use `createWidget`, which runs the machine and keeps
 *   bound DOM nodes in sync with it.
 * - React and Vue (#36) run the same `machine` and `connect` through Zag's own
 *   framework adapters, so markup and ARIA are identical across stacks.
 *
 * Parts carry `data-scope` and `data-part` from the machine, matching the CSS
 * conventions (#21).
 */
import type { Machine, MachineSchema, Service } from '@zag-js/core';
import { mergeProps, normalizeProps, VanillaMachine } from '@zag-js/vanilla';

import { effectStyles } from './morph';
import { applyProps, type Attrs, hasProps, removeProps } from './props';

/** Turns props into DOM attributes, the way each stack expects. */
export type Normalize = typeof normalizeProps;

/** A behavior: a machine plus the function that maps its state to part props. */
export interface WidgetDefinition<Schema extends MachineSchema, Api> {
  /** The `data-scope` the machine writes on every part, e.g. `dialog`. */
  scope: string;
  machine: Machine<Schema>;
  connect: (service: Service<Schema>, normalize: Normalize) => Api;
}

export interface Widget<Props, Api> {
  /** The machine's id, unique per instance. */
  readonly id: string;
  /** The current API: state, actions and a `get*Props()` per part. */
  api(): Api;
  start(): void;
  /** Stops the machine, unbinds every node and runs the machine's cleanups. */
  stop(): void;
  /** Merges new props in, e.g. a controlled `open` or `value`. */
  setProps(props: Partial<Props>): void;
  /** Calls `fn` after every state change. Returns an unsubscribe function. */
  subscribe(fn: (api: Api) => void): () => void;
  /**
   * Keeps `node` in sync with `attrs(api)`: after every state change, and
   * whenever something else rewrites its attributes, such as a server
   * re-render morphing the DOM. A node can carry several parts, of one widget
   * or several (a Tooltip on a Dialog trigger); their props are merged as
   * Zag's `mergeProps` does. Returns an unbind function.
   */
  bind(node: Element, attrs: (api: Api) => Attrs): () => void;
}

// ---------------------------------------------------------------------------
// Bound nodes. Every source bound to a node is merged and applied together,
// with one observer, so two parts on one element can't undo each other's
// writes and re-apply forever.

/** Counts renders across all widgets, to tell machine effects from outside changes. */
let renders = 0;

/** Re-applies allowed per node before the next task, in case something outside fights back. */
const REAPPLY_LIMIT = 25;

interface Source {
  attrs(): Attrs;
}

interface NodeState {
  sources: Set<Source>;
  observer: MutationObserver;
  last: Attrs;
  seen: number;
  reapplies: number;
}

const nodes = new WeakMap<Element, NodeState>();

/** Re-adds effect-owned declarations from `previous` (a style attribute) that the node lost. */
function restoreStyle(node: HTMLElement, previous: string | null): void {
  if (!previous || !node.style) return;
  const probe = document.createElement('div').style;
  probe.cssText = previous;
  for (const property of effectStyles(probe)) {
    if (!node.style.getPropertyValue(property)) {
      node.style.setProperty(
        property,
        probe.getPropertyValue(property),
        probe.getPropertyPriority(property),
      );
    }
  }
}

/** Merges every source bound to the node and applies the result, dropping our own mutation records. */
function applyNode(node: Element): void {
  const state = nodes.get(node);
  if (!state) return;
  state.last = mergeProps(...[...state.sources].map((source) => source.attrs())) as Attrs;
  applyProps(node, state.last);
  state.observer.takeRecords();
}

/** Starts observing a node's attributes, re-applying what a morph or other outside change undoes. */
function watch(node: Element): NodeState {
  const observer = new MutationObserver((records) => {
    const current = nodes.get(node);
    if (!current) return;
    // Our own writes are taken off the queue in applyNode(), so anything left
    // came from a machine's effects or from outside.
    if (current.seen !== renders) {
      // A machine re-rendered since: these are its effects (a layer's
      // pointer-events on open, their removal on close). Accept them.
      current.seen = renders;
    } else {
      // Nothing changed state, so something outside rewrote the node: a
      // morph. Put back inline styles the machine's effects had set.
      const before = records.find((record) => record.attributeName === 'style');
      if (before) restoreStyle(node as HTMLElement, before.oldValue);
    }
    if (hasProps(node, current.last)) {
      observer.takeRecords();
      return;
    }
    if (current.reapplies++ === 0) setTimeout(() => (current.reapplies = 0));
    if (current.reapplies > REAPPLY_LIMIT) {
      console.warn(
        '[apui] Something keeps rewriting the attributes a behavior part owns; stopped re-applying them until the next task.',
        node,
      );
      return;
    }
    applyNode(node);
  });
  const state: NodeState = { sources: new Set(), observer, last: {}, seen: renders, reapplies: 0 };
  nodes.set(node, state);
  observer.observe(node, { attributes: true, attributeOldValue: true });
  return state;
}

/** Adds a source to a node, watching it on first use. Returns a function that removes the source. */
function bindNode(node: Element, source: Source): () => void {
  const state = nodes.get(node) ?? watch(node);
  state.sources.add(source);
  applyNode(node);
  return () => {
    state.sources.delete(source);
    if (state.sources.size) {
      applyNode(node);
      return;
    }
    state.observer.disconnect();
    removeProps(node);
    nodes.delete(node);
  };
}

// ---------------------------------------------------------------------------

/**
 * Creates a widget. `props` are the machine's props and must include a unique
 * `id`.
 */
export function createWidget<Schema extends MachineSchema, Api>(
  definition: WidgetDefinition<Schema, Api>,
  props: Partial<Schema['props']> & { id: string },
): Widget<Schema['props'], Api> {
  const machine = new VanillaMachine(definition.machine, props);
  /** Nodes this widget has a source on, with the function that removes it. */
  const bound = new Map<Source, { node: Element; unbind: () => void }>();
  const listeners = new Set<(api: Api) => void>();
  let current: Api | undefined;
  let running = false;

  const connect = () => definition.connect(machine.service, normalizeProps);
  const render = () => {
    renders++;
    current = connect();
    for (const node of new Set([...bound.values()].map((entry) => entry.node))) applyNode(node);
    for (const listener of listeners) listener(current);
  };

  let unsubscribe: (() => void) | undefined;

  return {
    id: props.id,
    api: () => (current ??= connect()),
    start() {
      if (running) return;
      running = true;
      unsubscribe = machine.subscribe(render);
      machine.start();
      render();
    },
    stop() {
      if (!running) return;
      running = false;
      for (const { unbind } of [...bound.values()]) unbind();
      unsubscribe?.();
      listeners.clear();
      machine.stop();
    },
    setProps(next) {
      machine.updateProps(next);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    bind(node, attrs) {
      const source: Source = { attrs: () => attrs(current ?? connect()) };
      const release = bindNode(node, source);
      const unbind = () => {
        if (!bound.delete(source)) return;
        release();
      };
      bound.set(source, { node, unbind });
      return unbind;
    },
  };
}
