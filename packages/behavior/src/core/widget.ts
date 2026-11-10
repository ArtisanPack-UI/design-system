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
import { normalizeProps, VanillaMachine } from '@zag-js/vanilla';

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
   * re-render morphing the DOM. Returns an unbind function.
   */
  bind(node: Element, attrs: (api: Api) => Attrs): () => void;
}

/** Re-adds declarations from `previous` (a style attribute) that the node lost. */
function restoreStyle(node: HTMLElement, previous: string | null): void {
  if (!previous || !node.style) return;
  const probe = document.createElement('div').style;
  probe.cssText = previous;
  for (let i = 0; i < probe.length; i++) {
    const property = probe.item(i);
    if (!node.style.getPropertyValue(property)) {
      node.style.setProperty(
        property,
        probe.getPropertyValue(property),
        probe.getPropertyPriority(property),
      );
    }
  }
}

interface Binding {
  apply(): void;
  dispose(): void;
}

/**
 * Creates a widget. `props` are the machine's props and must include a unique
 * `id`.
 */
export function createWidget<Schema extends MachineSchema, Api>(
  definition: WidgetDefinition<Schema, Api>,
  props: Partial<Schema['props']> & { id: string },
): Widget<Schema['props'], Api> {
  const machine = new VanillaMachine(definition.machine, props);
  const bindings = new Set<Binding>();
  const listeners = new Set<(api: Api) => void>();
  let current: Api | undefined;
  let running = false;
  /** Counts renders, so bindings can tell machine effects from outside changes. */
  let generation = 0;

  const connect = () => definition.connect(machine.service, normalizeProps);
  const render = () => {
    generation++;
    current = connect();
    for (const binding of bindings) binding.apply();
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
      for (const binding of [...bindings]) binding.dispose();
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
      let last: Attrs = {};
      let seen = generation;
      const observer = new MutationObserver((records) => {
        // Our own writes are taken off the queue in apply(), so anything left
        // came from the machine's effects or from outside.
        if (seen !== generation) {
          // The machine re-rendered since: these are its effects (a layer's
          // pointer-events on open, their removal on close). Accept them.
          seen = generation;
        } else {
          // Nothing changed state, so something outside rewrote the node: a
          // morph. Put back inline styles the machine's effects had set.
          const before = records.find((record) => record.attributeName === 'style');
          if (before) restoreStyle(node as HTMLElement, before.oldValue);
        }
        if (!hasProps(node, last)) binding.apply();
        else observer.takeRecords();
      });
      const binding: Binding = {
        apply() {
          last = attrs(current ?? connect());
          applyProps(node, last, props.id);
          observer.takeRecords();
        },
        dispose() {
          observer.disconnect();
          removeProps(node, props.id);
          bindings.delete(binding);
        },
      };
      bindings.add(binding);
      binding.apply();
      observer.observe(node, { attributes: true, attributeOldValue: true });
      return () => binding.dispose();
    },
  };
}
