import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { kebab, rulesFor, transformVue, transformVueScript } from '../src';
import { label, ruleCases } from './helpers';

const fixtures = join(__dirname, 'fixtures/vue');
const sfc = (template: string, imports = 'Modal') =>
  `<script setup lang="ts">\nimport { ${imports} } from '@artisanpack-ui/vue';\n</script>\n\n<template>\n  ${template}\n</template>\n`;
const run = (template: string, imports?: string) => {
  const result = transformVue(sfc(template, imports), 'App.vue');
  return { ...result, template: result.code.split('\n')[5]!.trim() };
};

describe('transformVue', () => {
  it.each(readdirSync(fixtures).filter((name) => name.includes('.input.')))(
    'migrates the %s fixture',
    (name) => {
      const input = readFileSync(join(fixtures, name), 'utf8');
      const expected = readFileSync(join(fixtures, name.replace('.input.', '.output.')), 'utf8');
      const result = transformVue(input, name);
      expect(result.code).toBe(expected);
      expect(transformVue(result.code, name).code).toBe(expected);
    },
  );

  it('renames the import and the tag, in the case each was written in', () => {
    const pascal = run('<Modal subtitle="x">Hi</Modal>');
    expect(pascal.code).toContain(`import { Dialog } from '@artisanpack-ui/vue';`);
    expect(pascal.template).toBe('<Dialog description="x">Hi</Dialog>');
    // A lowercase `<dialog>` would be the native element, so a one-word name is written in PascalCase.
    expect(run('<modal subtitle="x">Hi</modal>').template).toBe(
      '<Dialog description="x">Hi</Dialog>',
    );
    expect(run('<SpotlightSearch />', 'SpotlightSearch').template).toBe('<Spotlight />');
    expect(run('<spotlight-search />', 'SpotlightSearch').template).toBe('<Spotlight />');
  });

  it('only touches tags the file imports from the package', () => {
    const source = `<script setup>\nimport Modal from './Modal.vue';\n</script>\n<template><Modal subtitle="x" /></template>\n`;
    expect(transformVue(source, 'App.vue')).toMatchObject({ code: source, changed: false });
  });

  it('migrates globally registered components when asked', () => {
    const source = `<template>\n  <Modal subtitle="x">Hi</Modal>\n</template>\n`;
    expect(transformVue(source, 'App.vue').changed).toBe(false);
    const result = transformVue(source, 'App.vue', { global: true });
    expect(result.code).toBe(`<template>\n  <Dialog description="x">Hi</Dialog>\n</template>\n`);
    expect(result.findings[0]).toMatchObject({ kind: 'rewrote', component: 'Modal', line: 2 });
  });

  it('keeps an aliased import and its tag', () => {
    const source = `<script setup>\nimport { Modal as Sheet } from '@artisanpack-ui/vue';\n</script>\n<template><Sheet subtitle="x" /></template>\n`;
    expect(transformVue(source, 'App.vue').code).toBe(
      `<script setup>\nimport { Dialog as Sheet } from '@artisanpack-ui/vue';\n</script>\n<template><Sheet description="x" /></template>\n`,
    );
  });

  it('keeps the tag when the import had to be aliased', () => {
    const source = `<script setup>\nimport Dialog from './Dialog.vue';\nimport { Modal } from '@artisanpack-ui/vue';\n</script>\n<template><Modal subtitle="x" /><Dialog /></template>\n`;
    expect(transformVue(source, 'App.vue').code).toBe(
      `<script setup>\nimport Dialog from './Dialog.vue';\nimport { Dialog as Modal } from '@artisanpack-ui/vue';\n</script>\n<template><Modal description="x" /><Dialog /></template>\n`,
    );
  });

  it('renames a components option in a plain script block', () => {
    const source = `<script>\nimport { Modal } from '@artisanpack-ui/vue';\nexport default { components: { Modal } };\n</script>\n<template><Modal subtitle="x" /></template>\n`;
    expect(transformVue(source, 'App.vue').code).toBe(
      `<script>\nimport { Dialog } from '@artisanpack-ui/vue';\nexport default { components: { Dialog } };\n</script>\n<template><Dialog description="x" /></template>\n`,
    );
  });

  it('writes names in the style of the attribute it replaces', () => {
    expect(run('<Pagination :current-page="page" />', 'Pagination').template).toBe(
      '<Pagination :page="page" />',
    );
    expect(run('<Pagination :total-pages="9" />', 'Pagination').template).toBe(
      '<Pagination :page-count="9" />',
    );
    expect(run('<Pagination :totalPages="9" />', 'Pagination').template).toBe(
      '<Pagination :pageCount="9" />',
    );
    expect(run('<Pagination v-bind:total-pages="9" />', 'Pagination').template).toBe(
      '<Pagination v-bind:page-count="9" />',
    );
  });

  it('turns flags into values', () => {
    expect(run('<Tabs vertical />', 'Tabs').template).toBe('<Tabs orientation="vertical" />');
    expect(run('<Tabs :vertical="true" />', 'Tabs').template).toBe(
      '<Tabs orientation="vertical" />',
    );
    expect(run('<Tabs :vertical="false" />', 'Tabs').template).toBe('<Tabs />');
    const dynamic = run('<Tabs :vertical="tall" />', 'Tabs');
    expect(dynamic.template).toBe('<Tabs :vertical="tall" />');
    expect(dynamic.findings).toMatchObject([
      { kind: 'manual', member: 'vertical', line: 6, column: 9 },
    ]);
  });

  it('maps values that changed with the name', () => {
    expect(run('<Tooltip text="Hi" position="left" />', 'Tooltip').template).toBe(
      '<Tooltip content="Hi" placement="start" />',
    );
    expect(run(`<Tooltip :position="'right'" />`, 'Tooltip').template).toBe(
      `<Tooltip :placement="'end'" />`,
    );
    const dynamic = run('<Tooltip :position="side" />', 'Tooltip');
    expect(dynamic.template).toBe('<Tooltip :placement="side" />');
    expect(dynamic.findings[0]).toMatchObject({ kind: 'review' });
  });

  it('follows v-model to the prop it binds', () => {
    expect(run('<Calendar v-model="day" />', 'Calendar').template).toBe(
      '<Calendar v-model:date="day" />',
    );
    expect(run('<Tabs v-model:active-tab="tab" />', 'Tabs').template).toBe(
      '<Tabs v-model:model-value="tab" />',
    );
  });

  it('renames an update event with its prop, and reports events that are gone', () => {
    expect(run('<Tabs @update:activeTab="go" />', 'Tabs').template).toBe(
      '<Tabs @update:modelValue="go" />',
    );
    const gone = run('<Input @clear="reset" @click="go" />', 'Input');
    expect(gone.changed).toBe(false);
    expect(gone.findings).toMatchObject([{ kind: 'manual', member: 'clear' }]);
  });

  it('renames slots on a template child and on the component itself', () => {
    expect(run('<Modal><template #actions>OK</template></Modal>').template).toBe(
      '<Dialog><template #footer>OK</template></Dialog>',
    );
    expect(run('<Modal><template v-slot:actions>OK</template></Modal>').template).toBe(
      '<Dialog><template v-slot:footer>OK</template></Dialog>',
    );
    expect(run('<div><template #actions>OK</template></div>').template).toBe(
      '<div><template #actions>OK</template></div>',
    );
  });

  it('merges per-part classes into classes', () => {
    expect(run('<Button :badge-classes="tone" />', 'Button').template).toBe(
      '<Button :classes="{ badge: tone }" />',
    );
    const taken = run('<Button badge-classes="a" :classes="mine" />', 'Button');
    expect(taken.changed).toBe(false);
    expect(taken.findings[0]).toMatchObject({ kind: 'manual', member: 'badge-classes' });
  });

  it('does not set a prop the element already has, or build an object it cannot quote', () => {
    const taken = run('<Tabs vertical orientation="horizontal" />', 'Tabs');
    expect(taken.changed).toBe(false);
    expect(taken.findings[0]!.message).toContain('already set');
    const quoted = run(`<Button :badge-classes='on ? "a" : b' />`, 'Button');
    expect(quoted.changed).toBe(false);
    expect(quoted.findings[0]).toMatchObject({ kind: 'manual', member: 'badge-classes' });
  });

  it('flags v-bind objects and components that need a person', () => {
    expect(run('<Modal v-bind="props" />').findings.at(-1)).toMatchObject({
      kind: 'manual',
      component: 'Modal',
    });
    const toast = run('<ToastProvider><App /></ToastProvider>', 'ToastProvider');
    expect(toast.changed).toBe(false);
    expect(toast.findings[0]!.message).toContain('Toaster');
  });

  it('reports a file it cannot parse', () => {
    const result = transformVue('<template><div></template><template></template>', 'Bad.vue');
    expect(result.changed).toBe(false);
    expect(result.findings[0]).toMatchObject({ kind: 'manual', line: 1 });
  });

  it('leaves templates in other languages alone', () => {
    const source = `<script setup>\nimport { Modal } from '@artisanpack-ui/vue';\n</script>\n<template lang="pug">\nModal(subtitle="x")\n</template>\n`;
    expect(transformVue(source, 'App.vue').code).toContain('Modal(subtitle="x")');
  });

  // One generated case for every rule in the Vue rules: the fixture for every rename.
  describe.each(ruleCases('vue').map((item) => [label(item), item] as const))('%s', (_, item) => {
    const { component, rule, group, member, memberRule } = item;
    const added = (rule.add ?? [])
      .map((extra) =>
        extra.value === undefined
          ? ` ${kebab(extra.name)}`
          : ` ${kebab(extra.name)}="${extra.value}"`,
      )
      .join('');
    const open = `<${rule.to}${added}`;
    const attr = kebab(member);

    it('applies', () => {
      if (group === 'slots') {
        const result = run(
          `<${component}><template #${member}>x</template></${component}>`,
          component,
        );
        const to = memberRule.kind === 'rename' ? memberRule.to : member;
        expect(result.template).toBe(`${open}><template #${to}>x</template></${rule.to}>`);
        expect(result.findings.some((finding) => finding.member === member)).toBe(true);
        return;
      }
      if (group === 'events') {
        const result = run(`<${component} @${member}="go" />`, component);
        const to = memberRule.kind === 'rename' ? memberRule.to : member;
        expect(result.template).toBe(`${open} @${to}="go" />`);
        expect(result.findings.some((finding) => finding.member === member)).toBe(true);
        return;
      }
      switch (memberRule.kind) {
        case 'rename': {
          const [from, to] = Object.entries(memberRule.values ?? { x: 'x' })[0]!;
          expect(run(`<${component} ${attr}="${from}" />`, component).template).toBe(
            `${open} ${kebab(memberRule.to)}="${to}" />`,
          );
          break;
        }
        case 'value':
          expect(run(`<${component} ${attr} />`, component).template).toBe(
            `${open} ${kebab(memberRule.to)}="${memberRule.value}" />`,
          );
          break;
        case 'split': {
          const first = memberRule.cases[0]!;
          expect(run(`<${component} ${attr}="${first.values[0]}" />`, component).template).toBe(
            `${open} ${kebab(first.to)}="${first.values[0]}" />`,
          );
          break;
        }
        case 'invert':
          expect(run(`<${component} ${attr} />`, component).template).toBe(
            `${open} :${kebab(memberRule.to)}="false" />`,
          );
          break;
        case 'part-class':
          expect(run(`<${component} ${attr}="a b" />`, component).template).toBe(
            `${open} :classes="{ ${memberRule.part}: 'a b' }" />`,
          );
          break;
        case 'remove': {
          const result = run(`<${component} ${attr} />`, component);
          expect(result.template).toBe(`${open} />`);
          expect(result.findings.some((finding) => finding.kind === 'removed')).toBe(true);
          break;
        }
        default: {
          const result = run(`<${component} ${attr}="x" />`, component);
          expect(result.template).toBe(`${open} ${attr}="x" />`);
          expect(result.findings.some((finding) => finding.kind === 'manual')).toBe(true);
        }
      }
    });
  });

  it('has a case for every Vue rule', () => {
    const count = Object.values(rulesFor('vue').components).reduce(
      (sum, rule) =>
        sum +
        Object.keys(rule.props ?? {}).length +
        Object.keys(rule.slots ?? {}).length +
        Object.keys(rule.events ?? {}).length,
      0,
    );
    expect(ruleCases('vue')).toHaveLength(count);
    expect(count).toBeGreaterThan(150);
  });
});

describe('transformVueScript', () => {
  it('renames imports and references in a plain script', () => {
    expect(
      transformVueScript(
        `import { Modal } from '@artisanpack-ui/vue';\napp.component('AppModal', Modal);\n`,
        'main.ts',
      ).code,
    ).toBe(`import { Dialog } from '@artisanpack-ui/vue';\napp.component('AppModal', Dialog);\n`);
  });

  it('skips files that do not use the package', () => {
    expect(transformVueScript(`import { Modal } from './x';\n`, 'main.ts').changed).toBe(false);
  });
});
