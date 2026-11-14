/**
 * The apui-manifest CLI, run from the built package.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { button } from './helpers';

const bin = join(__dirname, '..', 'bin', 'apui-manifest.mjs');
const dir = mkdtempSync(join(tmpdir(), 'apui-manifest-cli-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const run = (...args: string[]) =>
  spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8' });

function file(name: string, contents: unknown): string {
  const path = join(dir, name);
  writeFileSync(path, typeof contents === 'string' ? contents : JSON.stringify(contents));
  return path;
}

describe('apui-manifest', () => {
  it('validates the shipped manifests', () => {
    const { status, stdout } = run('validate');
    expect(status).toBe(0);
    expect(stdout).toMatch(/manifests? valid/);
  });

  it('reports a missing file or bad JSON without a stack trace', () => {
    const missing = run('validate', join(dir, 'nope.json'));
    expect(missing.status).toBe(1);
    expect(missing.stderr).toContain('nope.json: ENOENT');
    expect(missing.stderr).not.toContain('    at ');

    const broken = run('validate', file('Broken.json', '{ "name": '));
    expect(broken.status).toBe(1);
    expect(broken.stderr).toContain('Broken.json:');
    expect(broken.stderr).not.toContain('    at ');
  });

  it('prints usage for flags', () => {
    const { status, stderr } = run('validate', '--help');
    expect(status).toBe(2);
    expect(stderr).toContain('Usage: apui-manifest');
  });

  it('validates diff inputs before comparing them', () => {
    const { status, stderr } = run(
      'diff',
      file('Before.json', button()),
      file('NotAManifest.json', { hello: 'world' }),
    );
    expect(status).toBe(1);
    expect(stderr).toContain('NotAManifest.json');
    expect(stderr).not.toContain('TypeError');
  });

  it('diffs two versions of a manifest', () => {
    const after = button();
    after.props = after.props.filter((prop) => prop.name !== 'href');
    const { status, stdout } = run(
      'diff',
      file('Button.v1.json', button()),
      file('Button.v2.json', after),
    );
    expect(status).toBe(0);
    expect(stdout).toContain('`href`');
  });
});
