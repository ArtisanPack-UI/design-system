import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'index.css'),
  'utf8',
);

describe('@artisanpack-ui/css', () => {
  it('declares the apui cascade layers in order (D-002)', () => {
    expect(css).toContain('@layer apui.reset, apui.tokens, apui.components, apui.utilities;');
  });

  it('does not use the ap- namespace (D-002)', () => {
    expect(css).not.toMatch(/\.ap-|--ap-/);
  });
});
