#!/usr/bin/env node
/**
 * Builds the upgrade rules: what every 2.x component, prop, slot and event
 * becomes in the next major (#67 to #70).
 *
 * The rules are a diff of two API descriptions. "Before" is the Phase 0
 * catalogue of the 2.x packages (docs/inventory/data/api-<stack>.json).
 * "After" is the component manifest (packages/manifest/components). The
 * curated maps say which old name is which new one (component-map.json,
 * api-aliases.json), and rules/curated.json adds what names alone can't say:
 * a value to write, an attribute to add, a child component's new name.
 * Every target is checked against the manifest, so a rule never writes a
 * prop the next major doesn't have.
 *
 *   node scripts/build-rules.mjs           Write the outputs.
 *   node scripts/build-rules.mjs --check   Fail if the outputs are stale.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { phpValue } from '../../manifest/scripts/build-php.mjs';
import {
  AMBIGUOUS_ROOTS,
  CONFIG_REFERENCE,
  HIGH_CONFIDENCE_ROOTS,
  TAILWIND_LOOKALIKES,
  THEME_BASE_UTILITY,
  THEME_CONTENT_UTILITY,
  THEME_SEMANTIC_UTILITY,
  THEME_VARIABLE,
} from '../../../tools/inventory/lib/daisy.mjs';
import { canonicalEvent, resolveAlias } from '../../../tools/inventory/lib/diff.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(packageRoot, '..', '..');

export const OUTPUT_JSON = 'generated/upgrade-rules.json';
export const OUTPUT_PHP = 'generated/upgrade-rules.php';

export const STACKS = ['livewire', 'react', 'vue'];

/** The version each stack's rules migrate from and to. */
const VERSIONS = {
  livewire: { package: 'artisanpack-ui/livewire-ui-components', from: '2.x', to: '3.0' },
  react: { package: '@artisanpack-ui/react', from: '1.x', to: '2.0' },
  vue: { package: '@artisanpack-ui/vue', from: '1.x', to: '2.0' },
};

/** Attributes every stack passes through to the root element, so the manifest doesn't list them. */
const NATIVE = new Set([
  'accept', 'alt', 'autocomplete', 'autofocus', 'checked', 'class', 'className', 'cols', 'disabled',
  'for', 'form', 'height', 'href', 'id', 'max', 'maxlength', 'maxLength', 'min', 'minlength',
  'minLength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'readOnly', 'rel',
  'required', 'rows', 'src', 'step', 'style', 'tabindex', 'tabIndex', 'target', 'title', 'type',
  'value', 'width', 'key', 'ref', 'children', 'modelValue',
]); // prettier-ignore

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const isBool = (type) => /^\??bool(ean)?$/.test(String(type ?? '').trim());
const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);
const camel = (kebab) => kebab.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** An event's name in a stack, as `eventName()` in @artisanpack-ui/manifest spells it. */
function eventName(name, stack, manifest) {
  const special = {
    'value-change': { react: 'onValueChange', vue: 'update:modelValue', prop: 'value' },
    'open-change': { react: 'onOpenChange', vue: 'update:open', prop: 'open' },
    'checked-change': { react: 'onCheckedChange', vue: 'update:checked', prop: 'checked' },
  }[name];
  if (special && manifest.props.some((prop) => prop.name === special.prop)) return special[stack];
  if (stack !== 'react') return name;
  const pascal = camel(name);
  return `on${pascal.charAt(0).toUpperCase()}${pascal.slice(1)}`;
}

/** The 2.x members of one component, in one shape for every stack. */
function oldMembers(component, stack) {
  if (stack === 'livewire') {
    const props = component.props.map((prop) => ({
      ...prop,
      slot: component.slots.dual.includes(prop.name),
    }));
    const names = new Set(props.map((prop) => prop.name));
    return {
      props,
      slots: [...component.slots.dual, ...component.slots.named.filter((name) => !names.has(name))],
      events: [],
    };
  }
  if (stack === 'react') {
    return {
      // A React slot is a prop that takes a node.
      props: [...component.props, ...component.slots.filter((slot) => slot.name !== 'children')],
      slots: [],
      events: component.events.map((event) => event.name),
    };
  }
  return {
    props: component.props,
    slots: component.slots.named,
    events: component.events.map((event) => event.name),
  };
}

const without = (object, keys) =>
  Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));

const clean = (rule) =>
  Object.fromEntries(
    Object.entries(rule).filter(([, value]) => value !== undefined && value !== null),
  );

/**
 * The rule for one 2.x prop, or null when it carries over unchanged.
 *
 * Kinds: `rename` (optionally mapping `values`), `value` (a flag becomes
 * `to="value"`), `split` (the value decides the new name), `invert` (a
 * negative flag becomes `to={false}`), `part-class` (a per-part class prop
 * joins `classes`), `remove` (deleted), `manual` (left alone and reported).
 */
function propRule({ aliases, canonical, stack, manifest, unchecked }, member) {
  const props = new Map(
    manifest.props
      .filter((prop) => !prop.stacks || prop.stacks.includes(stack))
      .map((prop) => [prop.name, prop]),
  );
  const slots = new Set((manifest.slots ?? []).map((slot) => slot.name));
  const known = (name) => props.has(name) || slots.has(name) || NATIVE.has(name);
  const alias = resolveAlias(aliases, canonical, stack, member.name);
  const note = alias?.note;

  if (!alias || alias.idiom || (alias.stackOnly && alias.to === member.name)) {
    if (known(member.name) || alias) return null;
    return {
      kind: 'manual',
      note: `Not in the ${VERSIONS[stack].to} API. Remove it, or check the component's docs for what replaces it.`,
    };
  }

  if (alias.to === null) {
    // A flag carries no information, so it can go. A value might, so a person decides.
    return isBool(member.type)
      ? clean({ kind: 'remove', note })
      : { kind: 'manual', note: note ?? 'Removed, with no replacement.' };
  }

  if (alias.to === member.name) {
    return note ? { kind: 'manual', note } : null;
  }

  const part =
    /^classes\.(\w+)$/.exec(alias.to)?.[1] ??
    (alias.to === 'classes' ? /^(\w+?)Class(?:es|Name)?$/.exec(member.name)?.[1] : undefined);
  if (part) {
    if (unchecked) {
      return {
        kind: 'manual',
        note: "Per-part class props are gone here. Use `class`, or the parent's `classes`.",
      };
    }
    return props.has('classes')
      ? clean({ kind: 'part-class', to: 'classes', part: lowerFirst(part), note })
      : clean({
          kind: 'manual',
          note: note ?? 'Per-part classes are not supported on this component.',
        });
  }

  const target = props.get(alias.to);
  if (!target && unchecked) {
    // A child component's props aren't in the parent's manifest, so the alias is taken as is.
    return clean({
      kind: isBool(member.type) && /^Inverted/.test(note ?? '') ? 'invert' : 'rename',
      to: alias.to,
      note,
    });
  }
  if (!target) {
    if (slots.has(alias.to) || NATIVE.has(alias.to))
      return clean({ kind: 'rename', to: alias.to, note });
    return {
      kind: 'manual',
      note: `Not in the ${VERSIONS[stack].to} API (planned as \`${alias.to}\`). Remove it, or check the component's docs for what replaces it.`,
    };
  }

  // The old name still exists with another meaning, so the value decides (Button `variant`).
  const self = props.get(member.name);
  if (self?.values && target.values) {
    return clean({
      kind: 'split',
      cases: [{ values: target.values, to: alias.to }],
      keep: self.values,
    });
  }

  if (isBool(member.type) && target.type === 'enum') {
    return target.values?.includes(member.name)
      ? clean({ kind: 'value', to: alias.to, value: member.name, note })
      : clean({ kind: 'manual', note: note ?? `Use \`${alias.to}\`.` });
  }

  if (isBool(member.type) && target.type === 'boolean' && /^Inverted/.test(note ?? '')) {
    return clean({ kind: 'invert', to: alias.to, note });
  }

  if (target.type === 'object' && !/array|object|\[\]|Record|\{/.test(String(member.type ?? ''))) {
    return clean({ kind: 'manual', note: note ?? `Now part of the \`${alias.to}\` object.` });
  }

  // The old name is still a prop with other values (Pin `size`): those values stay where they are,
  // so a second run doesn't rename what is already migrated.
  return clean({ kind: 'rename', to: alias.to, keep: self?.values, note });
}

/** The rule for one 2.x slot (Blade `<x-slot:name>`, Vue `#name`), or null. */
function slotRule({ aliases, canonical, stack, manifest }, name) {
  const slots = new Set((manifest.slots ?? []).map((slot) => slot.name));
  const props = new Set(manifest.props.map((prop) => prop.name));
  const alias = resolveAlias(aliases, canonical, stack, name);
  if (!alias || alias.idiom || alias.stackOnly || alias.to === name) {
    return slots.has(name) || props.has(name) || name === 'default'
      ? null
      : { kind: 'manual', note: `The \`${name}\` slot is not in the ${VERSIONS[stack].to} API.` };
  }
  if (alias.to === null) return clean({ kind: 'manual', note: alias.note ?? 'Slot removed.' });
  return slots.has(alias.to) || props.has(alias.to)
    ? clean({ kind: 'rename', to: alias.to, note: alias.note })
    : clean({ kind: 'manual', note: alias.note ?? `Planned as \`${alias.to}\`.` });
}

/** DOM events a component passes through to its root element. */
const DOM_EVENTS = new Set([
  'abort', 'animationend', 'animationiteration', 'animationstart', 'auxclick', 'beforeinput', 'blur',
  'change', 'click', 'compositionend', 'compositionstart', 'compositionupdate', 'contextmenu', 'copy',
  'cut', 'dblclick', 'doubleclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
  'error', 'focus', 'focusin', 'focusout', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'paste',
  'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave', 'pointermove', 'pointerout',
  'pointerover', 'pointerup', 'reset', 'scroll', 'select', 'submit', 'toggle', 'touchcancel',
  'touchend', 'touchmove', 'touchstart', 'transitionend', 'wheel',
]); // prettier-ignore

/** Whether an event name is a DOM event: `onMouseEnter` in React, `mouseenter` in Vue. */
function isNativeEvent(name, stack) {
  const event = stack === 'react' ? name.replace(/^on/, '').replace(/Capture$/, '') : name;
  return DOM_EVENTS.has(event.toLowerCase());
}

/** The rule for one 2.x React or Vue event, or null. */
function eventRule({ aliases, canonical, stack, manifest }, name) {
  const scoped = resolveAlias({ ...aliases, global: [] }, canonical, stack, name);
  const concept = scoped ? scoped.to : canonicalEvent(aliases, stack, name);
  if (concept === null) return clean({ kind: 'manual', note: scoped?.note ?? 'Event removed.' });
  const event = (manifest.events ?? []).find((item) => item.name === concept);
  if (!event) {
    // Native handlers (`onClick`) reach the root element, so they stand.
    if (isNativeEvent(name, stack)) return null;
    return {
      kind: 'manual',
      note:
        scoped?.note ??
        `The \`${name}\` event is not in the ${VERSIONS[stack].to} API. Check the component's docs for what replaces it.`,
    };
  }
  const to = eventName(concept, stack, manifest);
  if (to === name) return null;
  return clean({
    kind: 'rename',
    to,
    review: true,
    note:
      scoped?.note ??
      (event.payload
        ? `Check the handler: the payload is ${event.payload}.`
        : "Check the handler's arguments."),
  });
}

/**
 * Builds the rules for every stack.
 *
 * @param {object} input
 * @param {object} input.map       component-map.json
 * @param {object} input.aliases   api-aliases.json
 * @param {Record<string, object>} input.api        api-<stack>.json by stack
 * @param {object[]} input.manifests                Component manifests
 * @param {object} input.curated   rules/curated.json
 */
export function buildRules({ map, aliases, api, manifests, curated }) {
  const manifestByName = new Map(manifests.map((manifest) => [manifest.name, manifest]));
  const problems = [];
  const stacks = {};

  for (const stack of STACKS) {
    const index = new Map(api[stack].components.map((component) => [component.name, component]));
    const components = {};

    for (const entry of map.components) {
      for (const oldName of entry[stack]) {
        const override = curated.components[stack]?.[oldName] ?? {};
        const canonical = override.canonical ?? entry.canonical;
        const manifest = manifestByName.get(canonical);
        if (!manifest) {
          problems.push(
            `${stack} ${oldName}: no manifest for ${canonical}; add "canonical" to rules/curated.json.`,
          );
          continue;
        }
        if (manifest.stacks[stack] === false) {
          problems.push(`${stack} ${oldName}: ${canonical} does not ship in ${stack}.`);
          continue;
        }

        const to = override.keep ? oldName : (override.to ?? manifest.stacks[stack].name);
        const context = {
          aliases,
          canonical,
          stack,
          manifest,
          unchecked: Boolean(override.children),
        };
        const members = oldMembers(index.get(oldName), stack);
        const scoped = curated.props[canonical] ?? [];
        const extra = [...scoped, ...(curated.props['*'] ?? [])].filter(
          (rule) =>
            (!rule.stack || rule.stack === stack) &&
            (!rule.component || rule.component === oldName),
        );
        const curatedRule = (group, name) => {
          const hit = extra.find((rule) => rule.from === name && (rule.group ?? 'props') === group);
          if (!hit) return undefined;
          const rule = without(hit, ['stack', 'component', 'from', 'group', 'evidence']);
          return rule.kind === 'keep' ? null : rule;
        };
        const collect = (group, names, derive) => {
          const out = {};
          for (const item of names) {
            const name = typeof item === 'string' ? item : item.name;
            const override = curatedRule(group, name);
            const rule = override === undefined ? derive(item) : override;
            if (rule) out[name] = rule;
          }
          // Curated rules may name members the catalogue missed.
          for (const rule of extra.filter(
            (item) => scoped.includes(item) && (item.group ?? 'props') === group,
          )) {
            if (!(rule.from in out) && !names.some((item) => (item.name ?? item) === rule.from)) {
              const value = curatedRule(group, rule.from);
              if (value) out[rule.from] = value;
            }
          }
          return out;
        };

        const component = clean({
          canonical,
          to,
          manual: override.manual,
          add: override.add,
          note: override.note,
          props: collect('props', members.props, (member) => propRule(context, member)),
          slots: collect('slots', members.slots, (name) => slotRule(context, name)),
          events: collect('events', members.events, (name) => eventRule(context, name)),
        });
        // Vue binds the manifest's `value` as `modelValue` (`v-model`).
        if (stack === 'vue') {
          for (const rule of Object.values(component.props)) {
            if (rule.kind === 'rename' && rule.to === 'value') rule.to = 'modelValue';
          }
        }
        // `update:activeTab` follows its prop: when the prop was renamed, so was the event.
        if (stack === 'vue') {
          for (const [name, rule] of Object.entries(component.events)) {
            const prop = component.props[/^update:(\w+)$/.exec(name)?.[1] ?? ''];
            if (rule.kind === 'manual' && prop?.kind === 'rename') {
              component.events[name] = { kind: 'rename', to: `update:${prop.to}` };
            }
          }
        }
        // A Livewire member can be an attribute or a slot (`actions`): one rename covers both.
        if (stack === 'livewire') {
          const slotLike = new Set([
            ...(manifest.slots ?? []).map((slot) => slot.name),
            ...manifest.props.filter((prop) => prop.type === 'node').map((prop) => prop.name),
          ]);
          for (const [name, rule] of Object.entries(component.props)) {
            const own = component.slots[name];
            if (
              rule.kind === 'rename' &&
              slotLike.has(rule.to) &&
              (!own || own.kind === 'manual')
            ) {
              component.slots[name] = clean({ kind: 'rename', to: rule.to, note: rule.note });
            }
          }
        }
        for (const key of ['props', 'slots', 'events']) {
          if (!Object.keys(component[key]).length) delete component[key];
        }
        // A kept component that only needs a note has no member rules worth applying.
        if (override.manual) for (const key of ['props', 'slots', 'events']) delete component[key];
        // A child (`menu-item`, `tab`) has its own props, which the parent's manifest doesn't list.
        if (!override.children) checkTargets(component, { stack, oldName, manifest, problems });
        components[oldName] = component;
      }
    }

    stacks[stack] = { ...VERSIONS[stack], components: sortKeys(components) };
  }

  if (problems.length) {
    throw new Error(`The upgrade rules don't match the manifest:\n- ${problems.join('\n- ')}`);
  }

  return {
    $comment:
      'Generated by packages/codemods/scripts/build-rules.mjs. Do not edit; run `npm run rules`.',
    version: 1,
    snapshot: Object.fromEntries(STACKS.map((stack) => [stack, api[stack].commit])),
    stacks,
    classes: classRules(aliases),
  };
}

/** Every prop a rule writes must exist in the manifest, with every value it writes. */
function checkTargets(component, { stack, oldName, manifest, problems }) {
  const props = new Map(
    manifest.props
      .filter((prop) => !prop.stacks || prop.stacks.includes(stack))
      .map((prop) => [prop.name, prop]),
  );
  const slots = new Set((manifest.slots ?? []).map((slot) => slot.name));
  const where = (name) => `${stack} ${oldName}.${name}`;
  const checkProp = (name, to, values = []) => {
    const target = props.get(to);
    if (!target) {
      if (!slots.has(to) && !NATIVE.has(to))
        problems.push(`${where(name)}: \`${to}\` is not a ${manifest.name} prop.`);
      return;
    }
    for (const value of values) {
      if (target.values && !target.values.includes(value)) {
        problems.push(`${where(name)}: \`${value}\` is not a value of ${manifest.name} \`${to}\`.`);
      }
    }
  };

  for (const [name, rule] of Object.entries(component.props ?? {})) {
    if (rule.kind === 'rename') checkProp(name, rule.to, Object.values(rule.values ?? {}));
    if (rule.kind === 'value') checkProp(name, rule.to, [rule.value]);
    if (rule.kind === 'invert' || rule.kind === 'part-class') checkProp(name, rule.to);
    if (rule.kind === 'split') for (const item of rule.cases) checkProp(name, item.to, item.values);
  }
  for (const item of component.add ?? [])
    checkProp('add', item.name, item.value === undefined ? [] : [item.value]);
  for (const [name, rule] of Object.entries(component.slots ?? {})) {
    if (rule.kind === 'rename' && !slots.has(rule.to) && !props.has(rule.to)) {
      problems.push(`${where(name)}: \`${rule.to}\` is not a ${manifest.name} slot.`);
    }
  }
}

function sortKeys(object) {
  return Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
}

/** The raw DaisyUI classes the upgrade tools report, from the Phase 0 scanner. */
function classRules(aliases) {
  return {
    component: HIGH_CONFIDENCE_ROOTS,
    ambiguous: AMBIGUOUS_ROOTS,
    patterns: {
      lookalike: TAILWIND_LOOKALIKES.source,
      themeBase: THEME_BASE_UTILITY.source,
      themeContent: THEME_CONTENT_UTILITY.source,
      themeSemantic: THEME_SEMANTIC_UTILITY.source,
      themeVariable: THEME_VARIABLE.source,
      config: CONFIG_REFERENCE.source,
    },
    rewrites: aliases.classes.map((rule) => clean({ ...rule })),
  };
}

function load() {
  const data = join(repoRoot, 'docs', 'inventory', 'data');
  const dir = join(repoRoot, 'packages', 'manifest', 'components');
  return {
    map: readJson(join(data, 'component-map.json')),
    aliases: readJson(join(data, 'api-aliases.json')),
    api: Object.fromEntries(
      STACKS.map((stack) => [stack, readJson(join(data, `api-${stack}.json`))]),
    ),
    manifests: readdirSync(dir)
      .filter((name) => name.endsWith('.json'))
      .sort()
      .map((name) => readJson(join(dir, name))),
    curated: readJson(join(packageRoot, 'rules', 'curated.json')),
  };
}

/** The Blade command's copy: the Livewire rules and the class lists, as a PHP array. */
export function phpSource(rules) {
  const { stacks } = rules;
  const rest = without(rules, ['$comment', 'stacks']);
  const data = { ...rest, snapshot: rules.snapshot.livewire, ...stacks.livewire };
  return [
    '<?php',
    '',
    '// Generated by packages/codemods/scripts/build-rules.mjs in the design-system repo.',
    '// Do not edit; run `npm run rules`.',
    '',
    'declare( strict_types=1 );',
    '',
    `return ${phpValue(data)};`,
    '',
  ].join('\n');
}

export function outputs() {
  const rules = buildRules(load());
  return {
    [OUTPUT_JSON]: `${JSON.stringify(rules, null, 2)}\n`,
    [OUTPUT_PHP]: phpSource(rules),
  };
}

function main() {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const [file, source] of Object.entries(outputs())) {
    const path = join(packageRoot, file);
    if (check) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== source) stale.push(file);
      continue;
    }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, source);
    console.log(`Wrote ${file}`);
  }
  if (stale.length) {
    console.error(
      `Stale: ${stale.join(', ')}. Run \`npm run rules --workspace @artisanpack-ui/codemods\` and commit.`,
    );
    process.exit(1);
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
