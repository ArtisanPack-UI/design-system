/**
 * The token build (#19): committed outputs are current, deterministic, and
 * shaped for each consumer.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { buildOutputs } from '../scripts/build-tokens.mjs';
import { loadTokens } from '../scripts/lib/model.mjs';
import { axes, cssVar, tokens } from '../src';

const root = join(__dirname, '..');
const outputs = buildOutputs(root);
const model = loadTokens(join(root, 'tokens'));
const css = outputs['generated/tokens.css']!;
const php = outputs['generated/tokens.php']!;

function hasPhp(): boolean {
  try {
    execFileSync('php', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** The declarations in the block whose selector ends with `selector`. */
function blockFor(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`no block for ${selector}`);
  return css.slice(start, css.indexOf('}', start));
}

describe('outputs', () => {
  it.each(Object.keys(outputs))('%s is committed and up to date', (file) => {
    expect(readFileSync(join(root, file), 'utf8')).toBe(outputs[file]);
  });

  it('builds the same output every time', () => {
    expect(buildOutputs(root)).toEqual(outputs);
  });
});

describe('CSS', () => {
  it('sits in the apui.tokens layer', () => {
    expect(css).toMatch(/^@layer apui\.tokens \{$/m);
    expect(css.trimEnd().endsWith('}')).toBe(true);
  });

  it('declares every token', () => {
    for (const entry of model.tokens.values()) {
      expect(css).toContain(`${entry.cssVar}:`);
    }
  });

  it('only uses the apui namespace (D-002)', () => {
    const names = [...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]);
    expect(names.every((name) => name!.startsWith('--apui-'))).toBe(true);
    expect(css).not.toMatch(/--ap-|\.ap-/);
  });

  it.each(Object.entries(axes))(
    'puts the default %s block, which matches :root, before the others',
    (_axis, axis) => {
      const order = axis.modes.map((mode) => css.indexOf(`[${axis.attribute}="${mode}"]`));
      const defaultAt = css.indexOf(`[${axis.attribute}="${axis.default}"]`);
      expect(Math.min(...order)).toBe(defaultAt);
      expect(css).toContain(`:root,\n  [${axis.attribute}="${axis.default}"]`);
    },
  );

  it('re-declares tokens that alias a mode token in every block of that axis', () => {
    for (const mode of axes.density.modes) {
      const block = blockFor(`[data-density="${mode}"]`);
      expect(block).toContain('--apui-panel-padding:');
      expect(block).toContain('--apui-card-padding: var(--apui-panel-padding);');
      expect(block).toContain('--apui-table-row-height: var(--apui-row-height);');
    }
    expect(blockFor(':root')).not.toContain('--apui-card-padding:');
  });

  it('keeps theme tokens out of the density blocks and back', () => {
    expect(blockFor('[data-density="compact"]')).not.toContain('--apui-color-primary:');
    expect(blockFor('[data-theme="dark"]')).not.toContain('--apui-panel-padding:');
  });
});

describe('TypeScript', () => {
  it('maps paths to custom properties and values', () => {
    expect(tokens['color.primary']).toMatchObject({
      cssVar: '--apui-color-primary',
      tier: 'semantic',
      axis: 'theme',
      value: { light: 'var(--apui-steel-600)' },
      resolved: { light: '#2a75ba', dark: '#60aaf3', 'high-contrast': '#01477d' },
    });
    expect(tokens['space.4']).toMatchObject({
      value: '16px',
      resolved: '16px',
      axis: null,
      varies: null,
    });
  });

  it('resolves tokens that follow a mode per mode', () => {
    expect(tokens['card.padding'].resolved).toEqual({
      compact: '16px',
      default: '20px',
      comfortable: '24px',
    });
  });

  it('builds var() references', () => {
    expect(cssVar('surface.page')).toBe('var(--apui-surface-page)');
  });
});

describe('PHP', () => {
  it('returns an array with every token', () => {
    expect(php.startsWith('<?php')).toBe(true);
    expect(php).toContain("'prefix' => 'apui',");
    const count = [...php.matchAll(/'cssVar'\s+=> '--apui-/g)].length;
    expect(count).toBe(model.tokens.size);
  });

  it.runIf(hasPhp())('is valid PHP that matches the TypeScript map', () => {
    const json = execFileSync(
      'php',
      ['-r', `echo json_encode(require '${join(root, 'generated/tokens.php')}');`],
      {
        encoding: 'utf8',
      },
    );
    const data = JSON.parse(json);
    expect(Object.keys(data.tokens)).toEqual(Object.keys(tokens));
    expect(data.tokens['color.primary']).toEqual(tokens['color.primary']);
    expect(data.axes).toEqual(axes);
  });
});
