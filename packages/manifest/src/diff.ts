/**
 * Compares two versions of a manifest. The changes feed the upgrade guides
 * (#70) and the codemods (#67 to #69).
 */
import { STACKS } from './types';
import type { ComponentManifest } from './types';

export type ChangeKind = 'added' | 'removed' | 'changed';

/** One difference between two manifests. */
export interface ManifestChange {
  kind: ChangeKind;
  /** Dotted path, with named items by name: `props.size.values`, `parts.spinner`. */
  path: string;
  before?: unknown;
  after?: unknown;
  /** Whether code written against `before` can break against `after`. */
  breaking: boolean;
  message: string;
}

type Named = { name: string } & Record<string, unknown>;

const NAMED_LISTS = ['props', 'parts', 'slots', 'events'] as const;
const VALUE_LISTS = ['variants', 'sizes', 'colors', 'tokens'] as const;

const singular: Record<string, string> = {
  props: 'prop',
  parts: 'part',
  slots: 'slot',
  events: 'event',
  variants: 'variant',
  sizes: 'size',
  colors: 'color',
  tokens: 'token',
  values: 'value',
  stacks: 'stack',
};

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const show = (value: unknown) =>
  typeof value === 'string' ? `\`${value}\`` : `\`${JSON.stringify(value)}\``;

/** Fields of a named item whose change can break callers. */
const BREAKING_FIELDS = new Set([
  'type',
  'default',
  'required',
  'stacks',
  'scoped',
  'parameters',
  'payload',
]);

function diffValues(
  path: string,
  label: string,
  before: string[] = [],
  after: string[] = [],
  removalBreaks = true,
): ManifestChange[] {
  const changes: ManifestChange[] = [];
  for (const value of before.filter((v) => !after.includes(v))) {
    changes.push({
      kind: 'removed',
      path,
      before: value,
      breaking: removalBreaks,
      message: `Removed ${label} ${show(value)}.`,
    });
  }
  for (const value of after.filter((v) => !before.includes(v))) {
    changes.push({
      kind: 'added',
      path,
      after: value,
      breaking: false,
      message: `Added ${label} ${show(value)}.`,
    });
  }
  return changes;
}

function diffNamed(key: string, before: Named[] = [], after: Named[] = []): ManifestChange[] {
  const changes: ManifestChange[] = [];
  const kind = singular[key]!;
  const afterByName = new Map(after.map((item) => [item.name, item]));
  const beforeByName = new Map(before.map((item) => [item.name, item]));

  for (const item of before) {
    const next = afterByName.get(item.name);
    const path = `${key}.${item.name}`;
    if (!next) {
      changes.push({
        kind: 'removed',
        path,
        before: item,
        breaking: true,
        message: `Removed ${kind} \`${item.name}\`.`,
      });
      continue;
    }
    if (key === 'props' && !item.deprecated && next.deprecated) {
      changes.push({
        kind: 'changed',
        path: `${path}.deprecated`,
        after: next.deprecated,
        breaking: false,
        message: `Deprecated prop \`${item.name}\`: ${String(next.deprecated)}`,
      });
    }
    if (Array.isArray(item.values) || Array.isArray(next.values)) {
      changes.push(
        ...diffValues(
          `${path}.values`,
          `value of \`${item.name}\`:`,
          item.values as string[] | undefined,
          next.values as string[] | undefined,
        ),
      );
    }
    for (const field of [...new Set([...Object.keys(item), ...Object.keys(next)])]) {
      if (field === 'name' || field === 'values' || field === 'deprecated') continue;
      if (same(item[field], next[field])) continue;
      const breaking = BREAKING_FIELDS.has(field) && !(field === 'required' && !next[field]);
      changes.push({
        kind:
          item[field] === undefined ? 'added' : next[field] === undefined ? 'removed' : 'changed',
        path: `${path}.${field}`,
        before: item[field],
        after: next[field],
        breaking,
        message:
          field === 'description'
            ? `Updated the description of ${kind} \`${item.name}\`.`
            : `Changed ${field} of ${kind} \`${item.name}\` from ${show(item[field])} to ${show(next[field])}.`,
      });
    }
  }
  for (const item of after) {
    if (beforeByName.has(item.name)) continue;
    const breaking = key === 'props' && item.required === true;
    changes.push({
      kind: 'added',
      path: `${key}.${item.name}`,
      after: item,
      breaking,
      message: breaking
        ? `Added required ${kind} \`${item.name}\`.`
        : `Added ${kind} \`${item.name}\`.`,
    });
  }
  return changes;
}

/**
 * Lists the differences between two versions of one component's manifest.
 * Removals, renames and changed types or defaults are breaking; additions are
 * not, except a new required prop.
 */
export function diffManifests(
  before: ComponentManifest,
  after: ComponentManifest,
): ManifestChange[] {
  const changes: ManifestChange[] = [];

  for (const field of ['name', 'rootClass'] as const) {
    if (before[field] !== after[field]) {
      changes.push({
        kind: 'changed',
        path: field,
        before: before[field],
        after: after[field],
        breaking: true,
        message: `Renamed ${field === 'name' ? 'the component' : 'the root class'} from ${show(before[field])} to ${show(after[field])}.`,
      });
    }
  }
  if (before.status !== after.status) {
    changes.push({
      kind: 'changed',
      path: 'status',
      before: before.status,
      after: after.status,
      breaking: false,
      message: `Status changed from ${show(before.status)} to ${show(after.status)}.`,
    });
  }

  for (const stack of STACKS) {
    const was = before.stacks[stack];
    const now = after.stacks[stack];
    const path = `stacks.${stack}`;
    if (was && !now) {
      changes.push({
        kind: 'removed',
        path,
        before: was,
        breaking: true,
        message: `No longer ships in ${stack}.`,
      });
    } else if (!was && now) {
      changes.push({
        kind: 'added',
        path,
        after: now,
        breaking: false,
        message: `Now ships in ${stack}.`,
      });
    } else if (was && now) {
      if (was.name !== now.name) {
        changes.push({
          kind: 'changed',
          path: `${path}.name`,
          before: was.name,
          after: now.name,
          breaking: true,
          message: `Renamed in ${stack} from ${show(was.name)} to ${show(now.name)}.`,
        });
      }
      changes.push(
        ...diffValues(
          `${path}.capabilities`,
          `${stack} capability`,
          was.capabilities,
          now.capabilities,
        ),
      );
      if (!same(was.differences, now.differences)) {
        changes.push({
          kind: 'changed',
          path: `${path}.differences`,
          before: was.differences,
          after: now.differences,
          breaking: false,
          message: `Updated the ${stack} differences.`,
        });
      }
    }
  }

  for (const key of NAMED_LISTS) {
    changes.push(
      ...diffNamed(key, before[key] as Named[] | undefined, after[key] as Named[] | undefined),
    );
  }
  for (const key of VALUE_LISTS) {
    // Tokens are not API callers write against, so dropping one is not breaking for them.
    changes.push(...diffValues(key, singular[key]!, before[key], after[key], key !== 'tokens'));
  }

  if (!same(before.a11y, after.a11y)) {
    changes.push({
      kind: 'changed',
      path: 'a11y',
      before: before.a11y,
      after: after.a11y,
      breaking: false,
      message: 'Updated the accessibility requirements.',
    });
  }

  return changes;
}

/** Formats changes as a Markdown section for an upgrade guide. */
export function formatChanges(
  changes: ManifestChange[],
  { component }: { component: string },
): string {
  if (!changes.length) return `## ${component}\n\nNo API changes.\n`;
  const breaking = changes.filter((change) => change.breaking);
  const other = changes.filter((change) => !change.breaking);
  const list = (items: ManifestChange[]) => items.map((change) => `- ${change.message}`).join('\n');
  const sections = [`## ${component}`];
  if (breaking.length) sections.push(`### Breaking changes\n\n${list(breaking)}`);
  if (other.length) sections.push(`### Other changes\n\n${list(other)}`);
  return `${sections.join('\n\n')}\n`;
}
