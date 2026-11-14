import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { buildGuide } from '../scripts/build-guides.mjs';
import { rulesFor } from '../src';
import type { Stack } from '../src';

const root = join(__dirname, '..');
const guide = (stack: Stack) =>
  readFileSync(join(root, '../../docs/upgrade', `${stack}.md`), 'utf8');

describe('upgrade guides', () => {
  it('are up to date with their templates and the rules', () => {
    execFileSync('node', ['scripts/build-guides.mjs', '--check'], { cwd: root, stdio: 'pipe' });
  });

  it.each(['livewire', 'react', 'vue'] as const)('%s covers what the issue asks for', (stack) => {
    const text = guide(stack);
    // #70: DaisyUI and the new CSS with or without Tailwind, the tool, renames, theming, support.
    for (const heading of [
      '## How long the old version is supported',
      'Remove DaisyUI and adopt the new CSS',
      '### Replace raw DaisyUI classes',
      'Migrate your theme',
      '### Themes and presets',
      'Renamed and consolidated components',
      'Changes by component',
    ]) {
      expect(text).toContain(heading);
    }
    expect(text).toContain('security fixes only for 12 months');
    // Plain YAML title: the docs site's importer reads it verbatim, quotes included.
    expect(text).toMatch(/^---\ntitle: Upgrading [^"\n]+\nmenu_order: [1-3]\n---\n\n# Upgrading /);
    expect(text).toContain("@import '@artisanpack-ui/css';");
    expect(text).toContain("@import 'tailwindcss';");
    expect(text).toContain('data-preset');
    expect(text).toContain(
      stack === 'livewire' ? 'artisanpack:upgrade-ui --dry-run' : `codemods ${stack} src --dry-run`,
    );
    expect(text).not.toMatch(/\{\{\w+:/);
    expect(text).not.toMatch(/\(D-\d+\)/);
  });

  it('lists every renamed component and every changed member', () => {
    for (const stack of ['livewire', 'react', 'vue'] as const) {
      const text = guide(stack);
      const tag = (name: string) =>
        stack === 'livewire' ? `<x-artisanpack-${name}>` : `<${name}>`;
      for (const [name, rule] of Object.entries(rulesFor(stack).components)) {
        if (rule.to !== name) expect(text).toContain(`| \`${tag(name)}\` | \`${tag(rule.to)}\` |`);
        if (rule.props || rule.slots || rule.events) expect(text).toContain(`### \`${tag(name)}\``);
      }
    }
    expect(guide('livewire')).toContain(
      '| `<x-artisanpack-choices>` | `<x-artisanpack-combobox>` |',
    );
    expect(guide('livewire')).toContain(
      '| `variant` | Depends on the value: `color` for `primary`',
    );
    expect(guide('react')).toContain('| `onClose` | Now `onOpenChange`.');
    expect(guide('vue')).toContain('| `#actions` | Now `#footer`. | Yes |');
  });
});

describe('guide titles', () => {
  const rules = { stacks: { livewire: [], react: [], vue: [] } };
  const build = (heading: string) => () =>
    buildGuide('react', rules, (name: string) =>
      name === 'react.md' ? `# ${heading}\n\nBody` : '',
    );

  it('writes a plain scalar title', () => {
    expect(build('Upgrading to React 2.0')()).toMatch(
      /^---\ntitle: Upgrading to React 2\.0\nmenu_order: 2\n---/,
    );
  });

  it.each(['Upgrading: React 2.0', '@artisanpack-ui/react 2.0', 'Upgrading #2'])(
    'rejects a heading YAML would have to quote (%s)',
    (heading) => {
      expect(build(heading)).toThrow(/can't be a plain YAML title/);
    },
  );
});
