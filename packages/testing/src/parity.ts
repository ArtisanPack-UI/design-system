/**
 * API parity against the manifest (#41). Each stack renders the component
 * with manifest-named props; these checks read the markup:
 *
 * - the root carries the root class and the root part's element;
 * - `variant`, `color`, `size`, `surface` and `orientation` emit their
 *   `data-*` attribute, with the default when unset;
 * - each state prop leaves evidence (`disabled`, `aria-busy`, `data-state`…);
 * - every other prop changes the markup, so none is silently ignored;
 * - with the fixture's `parts` props, every part renders as
 *   `[data-scope][data-part]`, and no part outside the manifest does;
 * - optionally, the props and events the stack declares match the manifest.
 *
 * `php/ManifestParity.php` runs the same checks for Blade with the same
 * messages; the tests hold the two to one list of expectations.
 */
import {
  type ComponentManifest,
  eventName,
  kebab,
  type ManifestProp,
  propsFor,
  type Stack,
} from '@artisanpack-ui/manifest';
import { Window } from 'happy-dom';

/** Enum props that must be emitted as `data-<name>` on the root (CSS conventions). */
export const DATA_ATTRIBUTE_PROPS = ['variant', 'color', 'size', 'surface', 'orientation'];

/** What counts as evidence of a state prop, anywhere in the component. */
export const STATE_EVIDENCE: Readonly<Record<string, readonly string[]>> = {
  disabled: ['disabled', 'data-disabled', 'aria-disabled=true'],
  invalid: ['data-invalid', 'aria-invalid=true'],
  loading: ['aria-busy=true', 'data-loading'],
  readonly: ['readonly', 'data-readonly', 'aria-readonly=true'],
  checked: ['checked', 'data-checked', 'aria-checked=true', 'data-state=checked'],
  indeterminate: ['data-indeterminate', 'aria-checked=mixed', 'data-state=indeterminate'],
  selected: ['data-selected', 'aria-selected=true', 'data-state=selected'],
  open: ['open', 'data-state=open', 'aria-expanded=true'],
};

/** Attributes whose values are generated ids, ignored when comparing markup. */
const ID_ATTRIBUTES = new Set([
  'id',
  'for',
  'aria-controls',
  'aria-labelledby',
  'aria-describedby',
  'aria-owns',
  'aria-activedescendant',
  'aria-errormessage',
  'wire:key',
]);

/** Renders the component with manifest-named props and default slot text. */
export type ParityRender = (
  props: Record<string, unknown>,
  content: string | null,
) => string | Promise<string>;

export interface ParityOptions {
  /** Props whose effect doesn't show in static markup, exempt from the effect check. */
  ignoreEffects?: string[];
  /** The props and events the stack declares, in its own spelling. */
  declared?: { props?: string[]; events?: string[] };
  /** Declared props or events that aren't API (internal plumbing), ignored by the declared check. */
  ignoreDeclared?: string[];
}

let window: Window | undefined;

/** Parses markup into a detached container. */
export function parseFragment(html: string): Element {
  window ??= new Window();
  const container = window.document.createElement('div');
  container.innerHTML = html;
  return container as unknown as Element;
}

/**
 * The markup with sorted attributes and generated ids blanked, for
 * comparisons. `drop` removes an attribute from the root when both its name
 * and value match: a prop a component doesn't handle falls through to the
 * root as an attribute named after it, holding the sample, which isn't an
 * effect. The same attribute on an inner element (an Input's `name`) is.
 */
export function normalizeMarkup(
  html: string,
  drop: { names: string[]; value: string; rootClass: string }[] = [],
): string {
  const container = parseFragment(html);
  const walk = (node: Node): string => {
    if (node.nodeType === 3) return (node.textContent ?? '').replace(/\s+/g, ' ');
    if (node.nodeType !== 1) return '';
    const el = node as Element;
    const attributes = [...el.attributes]
      .filter(
        (attr) =>
          !drop.some(
            (item) =>
              el.classList.contains(item.rootClass) &&
              item.names.includes(attr.name) &&
              item.value === attr.value,
          ),
      )
      .map((attr) => [attr.name, ID_ATTRIBUTES.has(attr.name) ? '#' : attr.value] as const)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([name, value]) => `${name}="${value}"`)
      .join(' ');
    return `<${el.tagName.toLowerCase()}${attributes ? ` ${attributes}` : ''}>${[...el.childNodes].map(walk).join('')}</>`;
  };
  return [...container.childNodes].map(walk).join('').trim();
}

/** The value a check renders a prop with, or undefined to skip it. */
export function sampleValue(prop: ManifestProp, manifest: ComponentManifest): unknown {
  const fromParts = manifest.fixture?.parts?.[prop.name];
  if (fromParts !== undefined) return fromParts;
  switch (prop.type) {
    case 'enum':
      return prop.values?.find((value) => value !== prop.default);
    case 'boolean':
      return !(prop.default ?? false);
    case 'number':
      return typeof prop.default === 'number' ? prop.default + 1 : 1;
    case 'object':
      return prop.name === 'classes'
        ? { root: 'apui-parity-sample' }
        : { sample: 'apui-parity-sample' };
    case 'array':
      return ['apui-parity-sample'];
    default:
      return 'apui-parity-sample';
  }
}

/** How a sample value shows when it falls through as an attribute. */
export function sampleAttribute(sample: unknown): string {
  if (sample === true) return 'true';
  return typeof sample === 'object' ? JSON.stringify(sample) : String(sample);
}

/** A prop's name as the stack declares it: Vue binds `value` as `modelValue`. */
export function stackPropName(name: string, stack: Stack): string {
  return stack === 'vue' && name === 'value' ? 'modelValue' : name;
}

const hasEvidence = (root: Element, evidence: string): boolean => {
  const [name, value] = evidence.split('=') as [string, string | undefined];
  const matches = (el: Element) =>
    el.hasAttribute(name) && (value === undefined || el.getAttribute(name) === value);
  return matches(root) || [...root.querySelectorAll('*')].some(matches);
};

const shownAttribute = (name: string, value: string | null) =>
  value === null ? `no ${name}` : `${name}="${value}"`;

/** Checks one stack against the manifest. Returns the problems; empty means in parity. */
export async function checkParity(
  manifest: ComponentManifest,
  stack: Stack,
  render: ParityRender,
  options: ParityOptions = {},
): Promise<string[]> {
  if (manifest.stacks[stack] === false) return [];
  const problems: string[] = [];
  const props = propsFor(manifest, stack);
  const content = manifest.fixture?.content ?? null;
  const base: Record<string, unknown> = { ...(manifest.fixture?.props ?? {}) };
  for (const prop of props) {
    if (prop.required && base[prop.name] === undefined)
      base[prop.name] = sampleValue(prop, manifest);
  }

  const renderRoot = async (overrides: Record<string, unknown>) => {
    const html = await render({ ...base, ...overrides }, content);
    const container = parseFragment(html);
    return { html, root: container.querySelector(`.${manifest.rootClass}`) };
  };

  const initial = await renderRoot({});
  if (!initial.root) return [`root: no element with class "${manifest.rootClass}"`];
  const rootElements =
    manifest.parts
      .find((part) => part.name === 'root')
      ?.element?.split('|')
      .map((element) => element.trim()) ?? [];
  const tag = initial.root.tagName.toLowerCase();
  if (rootElements.length && !rootElements.includes(tag)) {
    problems.push(`root: renders <${tag}>, expected ${rootElements.join(' | ')}`);
  }

  const checked = new Set<string>();
  for (const prop of props) {
    if (prop.type !== 'enum' || !DATA_ATTRIBUTE_PROPS.includes(prop.name)) continue;
    checked.add(prop.name);
    const attribute = `data-${kebab(prop.name)}`;
    if (prop.default !== undefined && base[prop.name] === undefined) {
      const value = initial.root.getAttribute(attribute);
      if (value !== prop.default) {
        problems.push(
          `prop ${prop.name}: the default renders ${shownAttribute(attribute, value)}, expected ${attribute}="${String(prop.default)}"`,
        );
      }
    }
    for (const value of prop.values ?? []) {
      const { root } = await renderRoot({ [prop.name]: value });
      const actual = root?.getAttribute(attribute) ?? null;
      if (actual !== value) {
        problems.push(`prop ${prop.name}: "${value}" renders ${shownAttribute(attribute, actual)}`);
      }
    }
  }

  for (const prop of props) {
    const evidence = STATE_EVIDENCE[prop.name];
    if (prop.type !== 'boolean' || !evidence) continue;
    checked.add(prop.name);
    const { root } = await renderRoot({ [prop.name]: true });
    if (!root || !evidence.some((item) => hasEvidence(root, item))) {
      problems.push(`prop ${prop.name}: true renders none of ${evidence.join(', ')}`);
    }
  }

  for (const prop of props) {
    if (checked.has(prop.name) || options.ignoreEffects?.includes(prop.name)) continue;
    if (base[prop.name] !== undefined) continue;
    const sample = sampleValue(prop, manifest);
    if (sample === undefined) continue;
    const { html } = await renderRoot({ [prop.name]: sample });
    const fallthrough = [
      {
        names: [prop.name.toLowerCase(), kebab(prop.name)],
        value: sampleAttribute(sample),
        rootClass: manifest.rootClass,
      },
    ];
    if (normalizeMarkup(html, fallthrough) === normalizeMarkup(initial.html, fallthrough)) {
      problems.push(`prop ${prop.name}: has no effect on the markup`);
    }
  }

  const scope = kebab(manifest.name);
  const full = await renderRoot({ ...(manifest.fixture?.parts ?? {}) });
  if (!full.root) {
    problems.push(
      `root: no element with class "${manifest.rootClass}" with the fixture's parts props`,
    );
  } else {
    const rendered = new Set(
      [full.root, ...full.root.querySelectorAll(`[data-scope="${scope}"][data-part]`)]
        .filter((el) => el.getAttribute('data-scope') === scope && el.hasAttribute('data-part'))
        .map((el) => el.getAttribute('data-part')!),
    );
    for (const part of manifest.parts) {
      if (part.name === 'root' || rendered.has(part.name)) continue;
      problems.push(`part ${part.name}: missing [data-scope="${scope}"][data-part="${part.name}"]`);
    }
    for (const name of [...rendered].sort()) {
      if (name !== 'root' && !manifest.parts.some((part) => part.name === name)) {
        problems.push(`part ${name}: rendered but not in the manifest`);
      }
    }
  }

  problems.push(...declaredProblems(manifest, stack, options.declared, options.ignoreDeclared));
  return problems;
}

/** Compares the props and events a stack declares with the manifest. */
export function declaredProblems(
  manifest: ComponentManifest,
  stack: Stack,
  declared: ParityOptions['declared'],
  ignore: string[] = [],
): string[] {
  const problems: string[] = [];
  const listed = (names: string[]) => names.filter((name) => !ignore.includes(name));
  if (declared?.props) {
    const expected = propsFor(manifest, stack).map((prop) => stackPropName(prop.name, stack));
    for (const name of expected) {
      if (!declared.props.includes(name)) {
        problems.push(`prop ${name}: not declared by the ${stack} component`);
      }
    }
    for (const name of listed(declared.props)) {
      if (!expected.includes(name)) problems.push(`prop ${name}: declared but not in the manifest`);
    }
  }
  if (declared?.events) {
    const expected = (manifest.events ?? []).map((event) => eventName(event, stack));
    for (const name of expected) {
      if (!declared.events.includes(name)) {
        problems.push(`event ${name}: not emitted by the ${stack} component`);
      }
    }
    for (const name of listed(declared.events)) {
      if (!expected.includes(name)) problems.push(`event ${name}: emitted but not in the manifest`);
    }
  }
  return problems;
}

/** Thrown by the `expect…Parity` helpers, listing every problem. */
export class ParityError extends Error {
  override name = 'ParityError';

  constructor(
    readonly component: string,
    readonly target: Stack,
    readonly problems: string[],
  ) {
    super(
      `${component} (${target}) drifts from its manifest:\n${problems.map((p) => `  - ${p}`).join('\n')}`,
    );
  }
}
