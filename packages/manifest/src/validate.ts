/**
 * Validates manifests: structure through the JSON Schema, then the vocabulary
 * rules the schema can't express (contributing/inventory/vocabulary.md, D-003).
 */
import { Ajv2020 } from 'ajv/dist/2020.js';

import componentSchema from '../schema/component.schema.json';
import { isInteractive, PSEUDO_STATES } from './fixture';
import { STACKS } from './types';
import type { ComponentManifest, ManifestError, ValidationResult } from './types';

/** The eight semantic colors (vocabulary decision 1). */
export const COLORS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
] as const;

/** The shared size scale. */
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/** Standard part names. A component may add parts but must not rename these. */
export const STANDARD_PARTS = [
  'root',
  'label',
  'control',
  'hint',
  'error',
  'icon',
  'iconEnd',
  'prefix',
  'suffix',
  'prepend',
  'append',
  'header',
  'body',
  'footer',
  'title',
  'description',
  'actions',
  'trigger',
  'content',
  'item',
  'indicator',
] as const;

/** Part names that rename a standard part, and the standard name to use instead. */
const RENAMED_PARTS: Record<string, string> = {
  leadingIcon: 'icon',
  startIcon: 'icon',
  iconStart: 'icon',
  iconLeft: 'icon',
  trailingIcon: 'iconEnd',
  endIcon: 'iconEnd',
  iconRight: 'iconEnd',
  input: 'control',
  helper: 'hint',
  helperText: 'hint',
  errorMessage: 'error',
  heading: 'title',
  subtitle: 'description',
  panel: 'content',
  toggle: 'trigger',
  wrapper: 'root',
  container: 'root',
};

/** D-003: components that do not ship in all three stacks. */
export const STACK_EXCEPTIONS: Readonly<Record<string, readonly string[]>> = {
  ImageLibrary: ['livewire'],
  StreamableContent: ['livewire'],
  ThemePreview: ['livewire'],
};

/** D-003: components that ship everywhere with different capabilities. */
export const DIFFERING_COMPONENTS: readonly string[] = ['RichTextEditor'];

/** WCAG 2.2 level A and AA success criteria: the conformance target. */
export const WCAG_22_AA: readonly string[] = [
  '1.1.1',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.2.4',
  '1.2.5',
  '1.3.1',
  '1.3.2',
  '1.3.3',
  '1.3.4',
  '1.3.5',
  '1.4.1',
  '1.4.2',
  '1.4.3',
  '1.4.4',
  '1.4.5',
  '1.4.10',
  '1.4.11',
  '1.4.12',
  '1.4.13',
  '2.1.1',
  '2.1.2',
  '2.1.4',
  '2.2.1',
  '2.2.2',
  '2.3.1',
  '2.4.1',
  '2.4.2',
  '2.4.3',
  '2.4.4',
  '2.4.5',
  '2.4.6',
  '2.4.7',
  '2.4.11',
  '2.5.1',
  '2.5.2',
  '2.5.3',
  '2.5.4',
  '2.5.7',
  '2.5.8',
  '3.1.1',
  '3.1.2',
  '3.2.1',
  '3.2.2',
  '3.2.3',
  '3.2.4',
  '3.2.6',
  '3.3.1',
  '3.3.2',
  '3.3.3',
  '3.3.4',
  '3.3.7',
  '3.3.8',
  '4.1.2',
  '4.1.3',
];

const BOOLEAN_PREFIX = /^(no|with|without|show|has)[A-Z]/;
const PHYSICAL = /^(left|right|top-left|top-right|bottom-left|bottom-right)$/;

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  // The prop schema's if/then requires `values`, which is declared one level up.
  strictRequired: false,
});
/** The JSON Schema for one manifest entry (`@artisanpack-ui/manifest/schema.json`). */
export const schema: Readonly<Record<string, unknown>> = componentSchema;

const validateSchema = ajv.compile(componentSchema);

/** `ButtonGroup` → `button-group`. */
export function kebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function duplicates(names: string[]): string[] {
  return [...new Set(names.filter((name, i) => names.indexOf(name) !== i))];
}

function semanticErrors(manifest: ComponentManifest): ManifestError[] {
  const errors: ManifestError[] = [];
  const add = (path: string, message: string) => errors.push({ path, message });

  if (manifest.rootClass !== `apui-${kebab(manifest.name)}`) {
    add('/rootClass', `must be "apui-${kebab(manifest.name)}" for ${manifest.name} (D-002)`);
  }

  manifest.colors?.forEach((color, i) => {
    if (!(COLORS as readonly string[]).includes(color)) {
      add(`/colors/${i}`, `"${color}" is not a semantic color (${COLORS.join(', ')})`);
    }
  });
  manifest.sizes?.forEach((size, i) => {
    if (!(SIZES as readonly string[]).includes(size)) {
      add(`/sizes/${i}`, `"${size}" is not a size (${SIZES.join(', ')})`);
    }
  });

  const lists = {
    props: manifest.props,
    parts: manifest.parts,
    slots: manifest.slots ?? [],
    events: manifest.events ?? [],
  };
  for (const [key, items] of Object.entries(lists)) {
    for (const name of duplicates(items.map((item) => item.name))) {
      add(`/${key}`, `"${name}" is listed more than once`);
    }
  }

  // The top-level lists restate an enum prop's values; the two copies must agree.
  for (const [list, propName] of [
    ['variants', 'variant'],
    ['sizes', 'size'],
    ['colors', 'color'],
  ] as const) {
    const values = manifest[list];
    const prop = manifest.props.find((p) => p.name === propName && p.type === 'enum');
    if (!values || !prop?.values) continue;
    const sorted = (items: readonly string[]) => [...items].sort().join('|');
    if (sorted(values) !== sorted(prop.values)) {
      add(`/${list}`, `must list the same values as the "${propName}" prop`);
    }
  }

  if (!manifest.parts.some((part) => part.name === 'root')) {
    add('/parts', 'must include the "root" part');
  }
  manifest.parts.forEach((part, i) => {
    const standard = RENAMED_PARTS[part.name];
    if (standard) add(`/parts/${i}/name`, `"${part.name}" renames the standard part "${standard}"`);
  });

  manifest.props.forEach((prop, i) => {
    if (prop.type === 'boolean' && BOOLEAN_PREFIX.test(prop.name)) {
      add(
        `/props/${i}/name`,
        `boolean "${prop.name}" must be a positive adjective or hide* (vocabulary naming rules)`,
      );
    }
    if (prop.type === 'enum' && prop.default !== undefined) {
      if (typeof prop.default !== 'string' || !prop.values?.includes(prop.default)) {
        add(`/props/${i}/default`, `default ${JSON.stringify(prop.default)} is not in values`);
      }
    }
    if (
      prop.type === 'boolean' &&
      prop.default !== undefined &&
      typeof prop.default !== 'boolean'
    ) {
      add(`/props/${i}/default`, 'a boolean prop needs a boolean default');
    }
    prop.values?.forEach((value, j) => {
      if (PHYSICAL.test(value)) {
        add(`/props/${i}/values/${j}`, `"${value}" is physical: use start and end (D-004)`);
      }
    });
    prop.stacks?.forEach((stack, j) => {
      if (manifest.stacks[stack] === false) {
        add(`/props/${i}/stacks/${j}`, `${manifest.name} does not ship in ${stack}`);
      }
    });
  });

  errors.push(...a11yErrors(manifest), ...fixtureErrors(manifest));

  const shipping = STACKS.filter((stack) => manifest.stacks[stack] !== false);
  const exception = STACK_EXCEPTIONS[manifest.name];
  if (exception) {
    if (shipping.join() !== exception.join()) {
      add('/stacks', `${manifest.name} ships in ${exception.join(', ')} only (D-003)`);
    }
  } else if (shipping.length !== STACKS.length) {
    add('/stacks', `must ship in livewire, react and vue (D-003)`);
  }
  if (DIFFERING_COMPONENTS.includes(manifest.name)) {
    for (const stack of STACKS) {
      const entry = manifest.stacks[stack];
      if (entry && !entry.differences?.length) {
        add(`/stacks/${stack}/differences`, `${manifest.name} must record its differences (D-003)`);
      }
    }
  }

  return errors;
}

/** The accessibility requirements a manifest must state (#40). */
function a11yErrors(manifest: ComponentManifest): ManifestError[] {
  const errors: ManifestError[] = [];
  const { a11y } = manifest;
  a11y.wcag?.forEach((criterion, i) => {
    if (!WCAG_22_AA.includes(criterion)) {
      errors.push({
        path: `/a11y/wcag/${i}`,
        message: `"${criterion}" is not a WCAG 2.2 level A or AA success criterion`,
      });
    }
  });
  if (isInteractive(manifest)) {
    if (!a11y.keyboard?.length) {
      errors.push({
        path: '/a11y/keyboard',
        message: 'an interactive component must list its keyboard interactions',
      });
    }
    for (const criterion of ['2.1.1', '2.4.7']) {
      if (!a11y.wcag?.includes(criterion)) {
        errors.push({
          path: '/a11y/wcag',
          message: `an interactive component must cite ${criterion}`,
        });
      }
    }
  }
  const root = manifest.parts.find((part) => part.name === 'root');
  if (a11y.element && root?.element) {
    const elements = root.element.split('|').map((element) => element.trim());
    if (!elements.includes(a11y.element)) {
      errors.push({
        path: '/a11y/element',
        message: `"${a11y.element}" is not the root part's element (${root.element})`,
      });
    }
  }
  const horizontal = a11y.keyboard?.some((entry) => /Arrow(Left|Right)/.test(entry.keys));
  if (horizontal && !a11y.requirements.some((text) => /\bRTL\b|text direction/i.test(text))) {
    errors.push({
      path: '/a11y/requirements',
      message:
        'ArrowLeft and ArrowRight must follow the text direction: add an RTL requirement (D-004)',
    });
  }
  return errors;
}

/** The fixture block must name real props, values and states (#39). */
function fixtureErrors(manifest: ComponentManifest): ManifestError[] {
  const errors: ManifestError[] = [];
  const { fixture } = manifest;
  if (!fixture) return errors;
  for (const key of ['props', 'parts'] as const) {
    for (const [name, value] of Object.entries(fixture[key] ?? {})) {
      const path = `/fixture/${key}/${name}`;
      const prop = manifest.props.find((p) => p.name === name);
      if (!prop) {
        errors.push({ path, message: `"${name}" is not a prop of ${manifest.name}` });
      } else if (prop.type === 'enum' && !prop.values?.includes(value as string)) {
        errors.push({ path, message: `${JSON.stringify(value)} is not one of the prop's values` });
      } else if (prop.type === 'boolean' && typeof value !== 'boolean') {
        errors.push({ path, message: 'a boolean prop needs a boolean' });
      }
    }
  }
  fixture.states?.forEach((state, i) => {
    const pseudo = (PSEUDO_STATES as readonly string[]).includes(state);
    const prop = manifest.props.some((p) => p.name === state && p.type === 'boolean');
    if (!pseudo && !prop) {
      errors.push({
        path: `/fixture/states/${i}`,
        message: `"${state}" is neither a pseudo-state (${PSEUDO_STATES.join(', ')}) nor a boolean prop`,
      });
    }
  });
  return errors;
}

/** Validates one manifest: the JSON Schema, then the vocabulary rules. */
export function validateManifest(data: unknown): ValidationResult {
  if (!validateSchema(data)) {
    const errors = (validateSchema.errors ?? []).map((error) => ({
      path: error.instancePath,
      message:
        error.keyword === 'additionalProperties'
          ? `unknown property "${(error.params as { additionalProperty: string }).additionalProperty}"`
          : (error.message ?? 'is invalid'),
    }));
    return { valid: false, errors };
  }
  const errors = semanticErrors(data as unknown as ComponentManifest);
  return { valid: errors.length === 0, errors };
}

/** A manifest and, optionally, the file it came from. */
export interface ManifestSource {
  data: unknown;
  file?: string;
}

/** Validates a set of manifests, including the checks across files. Paths are prefixed with the file or name. */
export function validateManifests(sources: ManifestSource[]): ValidationResult {
  const errors: ManifestError[] = [];
  const names = new Map<string, string>();
  sources.forEach(({ data, file }, i) => {
    const label = file ?? (data as { name?: string })?.name ?? `#${i}`;
    for (const error of validateManifest(data).errors) {
      errors.push({ path: `${label}${error.path}`, message: error.message });
    }
    const name = (data as { name?: unknown })?.name;
    if (typeof name !== 'string') return;
    const other = names.get(name);
    if (other !== undefined)
      errors.push({ path: label, message: `${name} is also defined in ${other}` });
    names.set(name, label);
    if (file) {
      const base = file
        .split(/[\\/]/)
        .pop()!
        .replace(/\.json$/, '');
      if (base !== name) errors.push({ path: label, message: `file must be named ${name}.json` });
    }
  });
  return { valid: errors.length === 0, errors };
}
