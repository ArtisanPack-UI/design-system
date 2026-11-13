import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { hasChanges, kebab, camel, rulesFor, upgradeRules } from '../src';
import type { MemberRule, Stack } from '../src';

const root = join(__dirname, '..');
const STACKS: Stack[] = ['livewire', 'react', 'vue'];

const members = (stack: Stack) =>
  Object.entries(rulesFor(stack).components).flatMap(([name, component]) =>
    (['props', 'slots', 'events'] as const).flatMap((group) =>
      Object.entries(component[group] ?? {}).map(
        ([member, rule]) => [name, group, member, rule] as [string, string, string, MemberRule],
      ),
    ),
  );

describe('upgrade rules', () => {
  it('are up to date with the manifests, the inventory and the curated rules', () => {
    // Throws, listing the files, when a committed output is stale.
    execFileSync('node', ['scripts/build-rules.mjs', '--check'], { cwd: root, stdio: 'pipe' });
  });

  it('cover every stack', () => {
    for (const stack of STACKS) {
      expect(Object.keys(rulesFor(stack).components).length).toBeGreaterThan(50);
    }
    expect(rulesFor('livewire')).toMatchObject({ from: '2.x', to: '3.0' });
    expect(rulesFor('react').package).toBe('@artisanpack-ui/react');
  });

  it('rename the components the vocabulary renamed', () => {
    const to = (stack: Stack, name: string) => rulesFor(stack).components[name]?.to;
    expect(to('livewire', 'modal')).toBe('dialog');
    expect(to('livewire', 'choices')).toBe('combobox');
    expect(to('livewire', 'choices-offline')).toBe('combobox');
    expect(to('livewire', 'header')).toBe('page-header');
    expect(to('livewire', 'colorpicker')).toBe('color-picker');
    expect(to('react', 'Modal')).toBe('Dialog');
    expect(to('react', 'StatGroup')).toBe('Grid');
    expect(to('vue', 'FileUpload')).toBe('File');
    expect(to('vue', 'SpotlightSearch')).toBe('Spotlight');
  });

  it('keep child components under their own names', () => {
    for (const name of ['menu-item', 'tab', 'step', 'timeline-item']) {
      expect(rulesFor('livewire').components[name]?.to).toBe(name);
    }
  });

  it('read the value of Button variant instead of renaming it blindly', () => {
    const rule = rulesFor('livewire').components.button?.props?.variant;
    expect(rule).toMatchObject({ kind: 'split', keep: expect.arrayContaining(['ghost']) });
    expect(rule?.kind === 'split' && rule.cases[0]).toMatchObject({
      to: 'color',
      values: expect.arrayContaining(['primary', 'error']),
    });
  });

  it('give every manual rule a note a person can act on', () => {
    for (const stack of STACKS) {
      for (const [name, , member, rule] of members(stack)) {
        if (rule.kind === 'manual') {
          expect(rule.note, `${stack} ${name}.${member}`).toMatch(/\w{3}/);
        }
      }
    }
  });

  it('never rename a member to itself', () => {
    for (const stack of STACKS) {
      for (const [name, , member, rule] of members(stack)) {
        if (rule.kind === 'rename') expect(rule.to, `${stack} ${name}.${member}`).not.toBe(member);
      }
    }
  });

  it('carry the DaisyUI class lists from the Phase 0 scanner', () => {
    expect(upgradeRules.classes.component).toContain('btn');
    expect(upgradeRules.classes.ambiguous).toContain('input');
    for (const pattern of Object.values(upgradeRules.classes.patterns)) {
      expect(() => new RegExp(pattern)).not.toThrow();
    }
  });

  it('ship the Livewire rules as PHP for the Blade command', () => {
    const php = readFileSync(join(root, 'generated/upgrade-rules.php'), 'utf8');
    expect(php).toContain("'modal'");
    expect(php).toContain("'to'        => 'dialog'");
    expect(php).not.toContain("'Modal'");
    const output = execFileSync(
      'php',
      [
        '-r',
        'echo json_encode(array_keys((require $argv[1])["components"]));',
        php ? join(root, 'generated/upgrade-rules.php') : '',
      ],
      { encoding: 'utf8' },
    );
    expect(JSON.parse(output)).toEqual(Object.keys(rulesFor('livewire').components));
  });

  it('report whether a component changes at all', () => {
    expect(hasChanges('Modal', rulesFor('react').components.Modal!)).toBe(true);
    expect(hasChanges('X', { canonical: 'X', to: 'X' })).toBe(false);
  });

  it('convert names', () => {
    expect(kebab('noWireNavigate')).toBe('no-wire-navigate');
    expect(camel('no-wire-navigate')).toBe('noWireNavigate');
  });
});
