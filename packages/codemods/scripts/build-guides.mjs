#!/usr/bin/env node
/**
 * Builds the upgrade guides in docs/upgrade/ (#70): one per stack, for the
 * docs site's Migration section.
 *
 * The prose is in guides/<stack>.md, with shared sections in guides/_*.md.
 * The tables of renamed components and changed members are generated from
 * the upgrade rules, so the guides can't drift from what the tools do.
 *
 *   node scripts/build-guides.mjs           Write the guides.
 *   node scripts/build-guides.mjs --check   Fail if a guide is stale.
 */
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(packageRoot, '..', '..');

export const STACKS = ['livewire', 'react', 'vue'];
export const OUTPUT_DIR = 'docs/upgrade';

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
// Decision and issue numbers mean nothing outside this repo.
const cell = (text) =>
  String(text)
    .replace(/\s*\((?:#\d+, )?D-\d+\)/g, '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
const list = (values) => values.map((value) => `\`${value}\``).join(', ');

/** A component's name as its stack writes it. */
const tag = (stack, name) => (stack === 'livewire' ? `<x-artisanpack-${name}>` : `<${name}>`);

/** A member's name as its stack writes it. */
function memberName(stack, group, name) {
  if (group === 'slots') return stack === 'livewire' ? `<x-slot:${kebab(name)}>` : `#${name}`;
  if (group === 'events') return stack === 'vue' ? `@${name}` : name;
  return stack === 'react' ? name : kebab(name);
}

const prop = (stack, name) => (stack === 'react' ? name : kebab(name));

/** A bound attribute as each stack writes it: `:debounce="250"` or `debounce={250}`. */
const bound = (stack, name, value) =>
  stack === 'react' ? `${name}={${value}}` : `:${prop(stack, name)}="${value}"`;

/** What a rule does, in a sentence, and whether the tool does it. */
export function describe(stack, group, rule) {
  const note = rule.note ? ` ${rule.note}` : '';
  const target = (name) =>
    group === 'slots' || group === 'events' ? memberName(stack, group, name) : prop(stack, name);
  switch (rule.kind) {
    case 'rename': {
      const values = rule.values
        ? ` Values: ${Object.entries(rule.values)
            .map(([from, to]) => `\`${from}\` is now \`${to}\``)
            .join(', ')}.`
        : '';
      return [
        `Now \`${target(rule.to)}\`.${values}${rule.review || rule.values ? note : ''}`,
        rule.review ? 'Yes, to review' : 'Yes',
      ];
    }
    case 'value':
      return [`Now \`${prop(stack, rule.to)}="${rule.value}"\`.`, 'Yes'];
    case 'split': {
      const cases = rule.cases
        .map((item) => `\`${prop(stack, item.to)}\` for ${list(item.values)}`)
        .join('; ');
      const keep = rule.keep?.length ? ` Unchanged for ${list(rule.keep)}.` : '';
      return [`Depends on the value: ${cases}.${keep}`, 'For literal values'];
    }
    case 'invert':
      return [
        `Now \`${prop(stack, rule.to)}\`, with the opposite meaning: the flag becomes \`${prop(stack, rule.to)}\` set to false.`,
        'Yes',
      ];
    case 'part-class':
      return [`Now the \`${rule.part}\` key of \`classes\`.`, 'Yes'];
    case 'duration':
      return [
        `Now integer milliseconds: \`${bound(stack, rule.to, '250')}\` for \`250ms\`, \`${bound(stack, rule.to, '1000')}\` for \`1s\`.`,
        'For literal values',
      ];
    case 'keep':
      return [`Unchanged.${note}`, 'Yes'];
    case 'wrap': {
      const set = Object.entries(rule.set ?? {})
        .map(([name, value]) => ` with \`${prop(stack, name)}="${value}"\``)
        .join('');
      return [
        `Now \`${prop(stack, rule.to ?? 'content')}\` on a \`${tag(stack, rule.tag)}\` wrapped around the element${set}.`,
        'Yes',
      ];
    }
    case 'content':
      return ['Now the default slot.', 'On self-closing tags'];
    case 'remove':
      return [
        `Removed.${note.replace(/^ Gone: (\w)/, (_, first) => ` ${first.toUpperCase()}`)}`,
        'Yes',
      ];
    default:
      return [rule.note ?? 'Changed.', 'By hand'];
  }
}

/** The table of components whose name or shape changed. */
export function componentsTable(stack, rules) {
  const rows = Object.entries(rules.components)
    .filter(([name, rule]) => rule.to !== name || rule.manual || rule.add?.length)
    .map(([name, rule]) => {
      const added = (rule.add ?? [])
        .map((item) =>
          item.value === undefined
            ? prop(stack, item.name)
            : `${prop(stack, item.name)}="${item.value}"`,
        )
        .map((text) => `\`${text}\``)
        .join(' and ');
      const notes = [
        rule.note,
        added && rule.to !== name ? `The tool adds ${added}.` : '',
        added && rule.to === name ? `The tool adds ${added} where it is missing.` : '',
      ]
        .filter(Boolean)
        .join(' ');
      const now = rule.manual ? 'By hand' : `\`${tag(stack, rule.to)}\``;
      return `| \`${tag(stack, name)}\` | ${now} | ${cell(notes)} |`;
    });
  return ['| 2.x | Now | Notes |'.replace('2.x', rules.from), '|---|---|---|', ...rows].join('\n');
}

/** One section per component, listing each member that changed. */
export function membersSections(stack, rules) {
  const sections = [];
  for (const [name, rule] of Object.entries(rules.components)) {
    const rows = [];
    for (const group of ['props', 'slots', 'events']) {
      for (const [member, memberRule] of Object.entries(rule[group] ?? {})) {
        const [what, automatic] = describe(stack, group, memberRule);
        rows.push(`| \`${memberName(stack, group, member)}\` | ${cell(what)} | ${automatic} |`);
      }
    }
    if (!rows.length) continue;
    const heading =
      rule.to === name
        ? `\`${tag(stack, name)}\``
        : `\`${tag(stack, name)}\` → \`${tag(stack, rule.to)}\``;
    sections.push(
      [
        `### ${heading}`,
        '',
        `| ${rules.from} | ${rules.to} | Automatic |`,
        '|---|---|---|',
        ...rows,
      ].join('\n'),
    );
  }
  return sections.join('\n\n');
}

/** Builds one stack's guide from its template. */
export function buildGuide(stack, rules, read) {
  const generated = {
    components: () => componentsTable(stack, rules.stacks[stack]),
    members: () => membersSections(stack, rules.stacks[stack]),
  };
  const body = read(`${stack}.md`)
    .replace(/\{\{include:(\w+)\}\}/g, (_, name) => read(`${name}.md`).trim())
    .replace(/\{\{generated:(\w+)\}\}/g, (_, name) => generated[name]());
  const notice = `<!-- Generated by packages/codemods/scripts/build-guides.mjs from packages/codemods/guides/${stack}.md and the upgrade rules. Do not edit; run \`npm run guides --workspace @artisanpack-ui/codemods\`. -->`;
  const [title, ...rest] = body.split('\n');
  // YAML front matter for the docs site, which imports docs/ (#84). Its
  // importer reads the title verbatim, quotes included, so a heading that
  // YAML could only hold as a quoted string is rejected instead.
  const text = title.replace(/^#\s+/, '');
  if (/^[\s@`'"!&*|>%#{[,?:-]|: | #|\s$/.test(text)) {
    throw new Error(
      `guides/${stack}.md: the heading "${text}" can't be a plain YAML title. Reword it without a leading symbol, ": " or " #".`,
    );
  }
  const frontMatter = `---\ntitle: ${text}\nmenu_order: ${STACKS.indexOf(stack) + 1}\n---`;
  return `${frontMatter}\n\n${title}\n\n${notice}\n${rest.join('\n').trimEnd()}\n`;
}

export function outputs() {
  const rules = JSON.parse(
    readFileSync(join(packageRoot, 'generated', 'upgrade-rules.json'), 'utf8'),
  );
  const read = (name) => readFileSync(join(packageRoot, 'guides', name), 'utf8');
  return Object.fromEntries(
    STACKS.map((stack) => [`${OUTPUT_DIR}/${stack}.md`, buildGuide(stack, rules, read)]),
  );
}

function main() {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const [file, source] of Object.entries(outputs())) {
    const path = join(repoRoot, file);
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
      `Stale: ${stale.join(', ')}. Run \`npm run guides --workspace @artisanpack-ui/codemods\` and commit.`,
    );
    process.exit(1);
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
