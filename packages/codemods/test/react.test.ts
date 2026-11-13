import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { rulesFor, transformReact } from '../src';
import { label, ruleCases } from './helpers';

const fixtures = join(__dirname, 'fixtures/react');
const kinds = (source: string, file = 'App.tsx') =>
  transformReact(source, file).findings.map((finding) =>
    `${finding.kind} ${finding.member ?? ''}`.trim(),
  );
const jsx = (body: string, imports = 'Modal') =>
  `import { ${imports} } from '@artisanpack-ui/react';\nexport const App = () => ${body};\n`;
const body = (source: string, imports?: string) =>
  transformReact(jsx(source, imports), 'App.tsx')
    .code.split('\n')[1]!
    .replace(/^export const App = \(\) => |;$/g, '');

describe('transformReact', () => {
  it.each(readdirSync(fixtures).filter((name) => name.includes('.input.')))(
    'migrates the %s fixture',
    (name) => {
      const input = readFileSync(join(fixtures, name), 'utf8');
      const expected = readFileSync(join(fixtures, name.replace('.input.', '.output.')), 'utf8');
      const result = transformReact(input, name);
      expect(result.code).toBe(expected);
      // A second run has nothing left to rewrite.
      expect(transformReact(result.code, name).code).toBe(expected);
    },
  );

  it('leaves files that do not use the package alone', () => {
    const source = `import { Modal } from './Modal';\nexport const App = () => <Modal subtitle="x" />;\n`;
    expect(transformReact(source, 'App.tsx')).toEqual({
      code: source,
      changed: false,
      findings: [],
    });
  });

  it('renames an import, its references and its props type', () => {
    const result = transformReact(
      `import { Modal, type ModalProps } from '@artisanpack-ui/react';\nconst props: ModalProps = { open: true };\nconst Lazy = wrap(Modal);\nexport const App = () => <Modal {...props}>Hi</Modal>;\n`,
      'App.tsx',
    );
    expect(result.code).toBe(
      `import { Dialog, type DialogProps } from '@artisanpack-ui/react';\nconst props: DialogProps = { open: true };\nconst Lazy = wrap(Dialog);\nexport const App = () => <Dialog {...props}>Hi</Dialog>;\n`,
    );
    expect(result.findings.map((finding) => finding.kind)).toEqual([
      'rewrote',
      'rewrote',
      'manual',
    ]);
  });

  it('reads the entry points too', () => {
    const result = transformReact(
      `import { Modal } from '@artisanpack-ui/react/layout';\nexport const App = () => <Modal subtitle="x" />;\n`,
      'App.tsx',
    );
    expect(result.code).toContain(`import { Dialog } from '@artisanpack-ui/react/layout';`);
    expect(result.code).toContain('<Dialog description="x" />');
  });

  it('keeps an alias and renames only what is imported', () => {
    expect(
      transformReact(
        `import { Modal as Sheet } from '@artisanpack-ui/react';\nexport const App = () => <Sheet subtitle="x" />;\n`,
        'App.tsx',
      ).code,
    ).toBe(
      `import { Dialog as Sheet } from '@artisanpack-ui/react';\nexport const App = () => <Sheet description="x" />;\n`,
    );
  });

  it('aliases the import when the new name is taken', () => {
    const result = transformReact(
      `import { Modal } from '@artisanpack-ui/react';\nimport { Dialog } from './Dialog';\nexport const App = () => <><Modal open /><Dialog /></>;\n`,
      'App.tsx',
    );
    expect(result.code).toContain(`import { Dialog as Modal } from '@artisanpack-ui/react';`);
    expect(result.code).toContain('<Modal open /><Dialog />');
    expect(result.findings[0]).toMatchObject({ kind: 'review', line: 1, column: 10 });
  });

  it('merges two imports that become one', () => {
    const result = transformReact(
      `import { Grid, StatGroup, Stat } from '@artisanpack-ui/react';\nexport const App = () => <StatGroup><Grid /><Stat /></StatGroup>;\n`,
      'App.tsx',
    );
    expect(result.code).toBe(
      `import { Grid, Stat } from '@artisanpack-ui/react';\nexport const App = () => <Grid><Grid /><Stat /></Grid>;\n`,
    );
  });

  it('follows a namespace import', () => {
    expect(
      transformReact(
        `import * as UI from '@artisanpack-ui/react';\nexport const App = () => <UI.Modal subtitle="x">Hi</UI.Modal>;\n`,
        'App.tsx',
      ).code,
    ).toBe(
      `import * as UI from '@artisanpack-ui/react';\nexport const App = () => <UI.Dialog description="x">Hi</UI.Dialog>;\n`,
    );
  });

  it('expands an object shorthand so the key stays', () => {
    expect(
      transformReact(
        `import { Modal } from '@artisanpack-ui/react';\nexport const parts = { Modal };\n`,
        'parts.ts',
      ).code,
    ).toBe(
      `import { Dialog } from '@artisanpack-ui/react';\nexport const parts = { Modal: Dialog };\n`,
    );
  });

  it('does not touch a property or a prop that shares the name', () => {
    const source = `import { Modal } from '@artisanpack-ui/react';\nconst a = ui.Modal;\nconst b = { Modal: 1 };\nexport const App = () => <Other Modal="x" />;\n`;
    const { code } = transformReact(source, 'App.tsx');
    expect(code).toContain('ui.Modal');
    expect(code).toContain('{ Modal: 1 }');
    expect(code).toContain('<Other Modal="x" />');
  });

  it('turns flags into values, and drops them when false', () => {
    expect(body('<Tabs vertical />', 'Tabs')).toBe('<Tabs orientation="vertical" />');
    expect(body('<Tabs vertical={true} />', 'Tabs')).toBe('<Tabs orientation="vertical" />');
    expect(body('<Tabs vertical={false} />', 'Tabs')).toBe('<Tabs />');
    expect(body('<Tabs vertical={isTall} />', 'Tabs')).toBe('<Tabs vertical={isTall} />');
    expect(kinds(jsx('<Tabs vertical={isTall} />', 'Tabs'))).toEqual(['manual vertical']);
  });

  it('maps values that changed with the name', () => {
    expect(body('<Tooltip tip="Hi" position="left" />', 'Tooltip')).toBe(
      '<Tooltip content="Hi" placement="start" />',
    );
    expect(body(`<Tooltip position={'right'} />`, 'Tooltip')).toBe(`<Tooltip placement={'end'} />`);
    expect(body('<Tooltip position="top" />', 'Tooltip')).toBe('<Tooltip placement="top" />');
    const dynamic = transformReact(jsx('<Tooltip position={side} />', 'Tooltip'), 'App.tsx');
    expect(dynamic.code).toContain('<Tooltip placement={side} />');
    expect(dynamic.findings.at(-1)).toMatchObject({ kind: 'review' });
    expect(dynamic.findings.at(-1)!.message).toContain('`left` is now `start`');
  });

  it('merges per-part class props into classes', () => {
    expect(body('<Tabs tabListClassName="a" panelClassName={b} />', 'Tabs')).toBe(
      `<Tabs classes={{ tabList: 'a', panel: b }} />`,
    );
    const taken = transformReact(
      jsx('<Tabs tabListClassName="a" classes={c} />', 'Tabs'),
      'App.tsx',
    );
    expect(taken.changed).toBe(false);
    expect(taken.findings[0]).toMatchObject({ kind: 'manual', member: 'tabListClassName' });
  });

  it('renames events and asks for a look at the handler', () => {
    const result = transformReact(jsx('<Modal open onClose={close} />'), 'App.tsx');
    expect(result.code).toContain('<Dialog open onOpenChange={close} />');
    expect(result.findings.at(-1)).toMatchObject({ kind: 'review', member: 'onClose', line: 2 });
  });

  it('does not write a prop twice', () => {
    const result = transformReact(
      jsx('<Table selectableKey="id" expandableKey="id" />', 'Table'),
      'App.tsx',
    );
    expect(result.code).toContain('<Table keyBy="id" expandableKey="id" />');
    expect(result.findings.at(-1)).toMatchObject({ kind: 'manual', member: 'expandableKey' });
  });

  it('does not set a prop the element already has', () => {
    const result = transformReact(
      jsx('<Tabs vertical orientation="horizontal" />', 'Tabs'),
      'App.tsx',
    );
    expect(result.changed).toBe(false);
    expect(result.findings[0]).toMatchObject({ kind: 'manual', member: 'vertical' });
    expect(result.findings[0]!.message).toContain('already set');
  });

  it('reports components that need a person', () => {
    const result = transformReact(
      `import { ToastProvider } from '@artisanpack-ui/react';\nexport const App = () => <ToastProvider><Page /></ToastProvider>;\n`,
      'App.tsx',
    );
    expect(result.changed).toBe(false);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({ kind: 'manual', component: 'ToastProvider' });
    expect(result.findings[0]!.message).toContain('Toaster');
  });

  it('flags spread props', () => {
    expect(kinds(jsx('<Modal {...rest} />'))).toEqual(['rewrote', 'manual']);
  });

  it('gives each finding its line and column', () => {
    const result = transformReact(jsx('(\n  <Modal\n    subtitle="x"\n  />\n)'), 'App.tsx');
    expect(result.findings.find((finding) => finding.member === 'subtitle')).toMatchObject({
      line: 4,
      column: 5,
    });
  });

  it('parses plain JavaScript and TypeScript', () => {
    expect(
      transformReact(
        `import { Modal } from '@artisanpack-ui/react';\nconst x = <T,>(a: T) => a;\nexport default Modal;\n`,
        'modal.ts',
      ).code,
    ).toContain('export default Dialog;');
    expect(
      transformReact(
        `import { Modal } from '@artisanpack-ui/react';\nexport const App = () => <Modal subtitle="x" />;\n`,
        'App.jsx',
      ).code,
    ).toContain('<Dialog description="x" />');
  });

  // One generated case for every rule in the React rules: the fixture for every rename.
  describe.each(ruleCases('react').map((item) => [label(item), item] as const))('%s', (_, item) => {
    const { component, rule, member, memberRule } = item;
    const tag = rule.to;
    const run = (attribute: string) => {
      const result = transformReact(
        `import { ${component} } from '@artisanpack-ui/react';\nexport const App = () => <${component} ${attribute} />;\n`,
        'App.tsx',
      );
      const added = (rule.add ?? [])
        .map((extra) =>
          extra.value === undefined ? ` ${extra.name}` : ` ${extra.name}="${extra.value}"`,
        )
        .join('');
      return {
        ...result,
        element: result.code
          .split('\n')[1]!
          .replace('export const App = () => ', '')
          .replace(/;$/, ''),
        open: `<${tag}${added}`,
      };
    };

    it('applies', () => {
      switch (memberRule.kind) {
        case 'rename': {
          const [from, to] = Object.entries(memberRule.values ?? { x: 'x' })[0]!;
          const result = run(`${member}="${from}"`);
          expect(result.element).toBe(`${result.open} ${memberRule.to}="${to}" />`);
          break;
        }
        case 'value': {
          const result = run(member);
          expect(result.element).toBe(`${result.open} ${memberRule.to}="${memberRule.value}" />`);
          break;
        }
        case 'split': {
          const first = memberRule.cases[0]!;
          const result = run(`${member}="${first.values[0]}"`);
          expect(result.element).toBe(`${result.open} ${first.to}="${first.values[0]}" />`);
          break;
        }
        case 'invert': {
          const result = run(member);
          expect(result.element).toBe(`${result.open} ${memberRule.to}={false} />`);
          break;
        }
        case 'part-class': {
          const result = run(`${member}="a b"`);
          expect(result.element).toBe(`${result.open} classes={{ ${memberRule.part}: 'a b' }} />`);
          break;
        }
        case 'remove': {
          const result = run(member);
          expect(result.element).toBe(`${result.open} />`);
          expect(result.findings.some((finding) => finding.kind === 'removed')).toBe(true);
          break;
        }
        default: {
          const result = run(`${member}="x"`);
          expect(result.element).toBe(`${result.open} ${member}="x" />`);
          expect(result.findings.some((finding) => finding.kind === 'manual')).toBe(true);
        }
      }
    });
  });

  it('has a case for every React rule', () => {
    const count = Object.values(rulesFor('react').components).reduce(
      (sum, rule) =>
        sum + Object.keys(rule.props ?? {}).length + Object.keys(rule.events ?? {}).length,
      0,
    );
    expect(ruleCases('react')).toHaveLength(count);
    expect(count).toBeGreaterThan(150);
  });
});
