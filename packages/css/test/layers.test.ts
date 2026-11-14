import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { bundle } from '../build.mjs';

const source = readFileSync(join(__dirname, '..', 'src', 'index.css'), 'utf8');
const css = bundle();

describe('@artisanpack-ui/css', () => {
  it('declares the apui cascade layers in order (D-002)', () => {
    expect(source).toContain('@layer apui.reset, apui.tokens, apui.components, apui.utilities;');
    expect(css.indexOf('@layer apui.reset, apui.tokens')).toBeLessThan(
      css.indexOf('@layer apui.reset {'),
    );
  });

  it('inlines every import into one file', () => {
    expect(css).not.toMatch(/^@import/m);
    for (const layer of ['apui.reset', 'apui.tokens', 'apui.utilities']) {
      expect(css).toContain(`@layer ${layer} {`);
    }
    expect(css).toContain('--apui-color-primary:');
  });

  it('does not use the ap- namespace (D-002)', () => {
    expect(css).not.toMatch(/\.ap-|--ap-/);
  });

  it('never uses !important', () => {
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toContain('!important');
  });
});
