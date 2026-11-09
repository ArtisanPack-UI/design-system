/**
 * The lint rules that enforce the CSS conventions (#21).
 */
import { join } from 'node:path';

import stylelint from 'stylelint';

import {
  asymmetricBox,
  asymmetricRadius,
  splitValue,
} from '../../../tools/stylelint/apui-plugin.mjs';

const configFile = join(__dirname, '..', '..', '..', 'stylelint.config.mjs');

async function lint(code: string): Promise<string[]> {
  const { results } = await stylelint.lint({ code, configFile });
  return results.flatMap((result) => result.warnings.map((warning) => warning.rule));
}

const inLayer = (body: string) => `@layer apui.components {\n${body}\n}\n`;

describe('accepted CSS', () => {
  it('passes a component that follows the conventions', async () => {
    expect(
      await lint(
        inLayer(`
  .apui-button { padding-inline: var(--apui-space-3); border-radius: var(--apui-button-radius); margin: 0 auto; }
  .apui-button[data-variant='soft'] [data-scope='button'][data-part='icon'] { inset-inline-start: 0; }
  .apui-button { --apui-_bg: var(--apui-color-primary); text-align: start; float: inline-end; }
  @media (prefers-reduced-motion: reduce) { .apui-button { transition: none; } }`),
      ),
    ).toEqual([]);
  });

  it('allows the layer order statement and imports outside a layer', async () => {
    expect(
      await lint(
        "@layer apui.reset, apui.tokens, apui.components, apui.utilities;\n@import './reset.css';\n",
      ),
    ).toEqual([]);
  });

  it('allows a physical property with a described exception', async () => {
    expect(
      await lint(
        inLayer(`  .apui-chart {
    /* stylelint-disable-next-line property-disallowed-list -- chart plots stay LTR (D-004) */
    left: 0;
  }`),
      ),
    ).toEqual([]);
  });
});

describe('rejected CSS', () => {
  it.each([
    ['a rule outside a layer', '.apui-button { color: red; }', 'apui/layer'],
    [
      'an @media block outside a layer',
      '@media print { .apui-button { color: red; } }',
      'apui/layer',
    ],
    ['an unknown layer', '@layer app { .apui-button { color: red; } }', 'apui/layer'],
    [
      'a nested layer',
      '@layer apui.components { @layer inner { .apui-button { color: red; } } }',
      'apui/layer',
    ],
    ['an unprefixed class', inLayer('.button { color: red; }'), 'selector-class-pattern'],
    ['the ap- namespace', inLayer('.ap-tabs { color: red; }'), 'selector-class-pattern'],
    [
      'a preview-only state class',
      inLayer('.apui-button.is-hover { color: red; }'),
      'selector-class-pattern',
    ],
    [
      'an unprefixed custom property',
      inLayer('.apui-button { --bg: red; }'),
      'custom-property-pattern',
    ],
    ['!important', inLayer('.apui-button { color: red !important; }'), 'declaration-no-important'],
    ['margin-left', inLayer('.apui-button { margin-left: 4px; }'), 'property-disallowed-list'],
    ['padding-right', inLayer('.apui-button { padding-right: 4px; }'), 'property-disallowed-list'],
    [
      'border-left-color',
      inLayer('.apui-button { border-left-color: red; }'),
      'property-disallowed-list',
    ],
    [
      'border-top-left-radius',
      inLayer('.apui-button { border-top-left-radius: 4px; }'),
      'property-disallowed-list',
    ],
    ['left', inLayer('.apui-button { left: 0; }'), 'property-disallowed-list'],
    ['top', inLayer('.apui-button { top: 0; }'), 'property-disallowed-list'],
    [
      'text-align: left',
      inLayer('.apui-button { text-align: left; }'),
      'declaration-property-value-disallowed-list',
    ],
    [
      'float: right',
      inLayer('.apui-button { float: right; }'),
      'declaration-property-value-disallowed-list',
    ],
    [
      'an asymmetric margin shorthand',
      inLayer('.apui-button { margin: 0 4px 0 8px; }'),
      'apui/mirror-safe-shorthand',
    ],
    [
      'an asymmetric inset shorthand',
      inLayer('.apui-button { inset: 0 auto auto 0; }'),
      'apui/mirror-safe-shorthand',
    ],
    [
      'an asymmetric border-radius',
      inLayer('.apui-button { border-radius: 0 4px 4px 0; }'),
      'apui/mirror-safe-shorthand',
    ],
  ])('rejects %s', async (_label, code, rule) => {
    expect(await lint(code)).toContain(rule);
  });

  it('requires a description on a lint exception', async () => {
    const rules = await lint(
      inLayer(`  .apui-chart {
    /* stylelint-disable-next-line property-disallowed-list */
    left: 0;
  }`),
    );
    expect(rules).toContain('--report-descriptionless-disables');
  });
});

describe('shorthand helpers', () => {
  it('splits values at top-level whitespace only', () => {
    expect(splitValue('0 calc(var(--a) + 2px) 0  auto')).toEqual([
      '0',
      'calc(var(--a) + 2px)',
      '0',
      'auto',
    ]);
  });

  it.each([
    ['0', false],
    ['0 4px', false],
    ['0 4px 8px', false],
    ['0 4px 8px 4px', false],
    ['0 4px 8px 2px', true],
  ])('box %s is asymmetric: %s', (value, expected) => {
    expect(asymmetricBox(value)).toBe(expected);
  });

  it.each([
    ['4px', false],
    ['4px 4px', false],
    ['4px 8px', true],
    ['4px 4px 0 0', false],
    ['4px 4px 0', true],
    ['4px / 2px', false],
    ['4px 4px 0 0 / 2px 3px', true],
  ])('radius %s is asymmetric: %s', (value, expected) => {
    expect(asymmetricRadius(value)).toBe(expected);
  });
});
