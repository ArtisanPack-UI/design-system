import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { packageName } from '../src/index';

describe('@artisanpack-ui/behavior', () => {
  it('exports its package name', () => {
    expect(packageName).toBe('@artisanpack-ui/behavior');
  });
});

describe('the prebuilt asset', () => {
  const file = join(__dirname, '../dist/alpine.global.js');

  // Built by `npm run build`, which CI runs before the tests.
  it.skipIf(!existsSync(file))('runs as a classic script, with no Node globals', () => {
    const source = readFileSync(file, 'utf8');
    expect(source).not.toMatch(/\bprocess\.env\b/);
    expect(source).not.toMatch(/\brequire\(/);
  });
});
