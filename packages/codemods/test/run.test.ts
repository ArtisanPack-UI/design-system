import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { run, transformFile } from '../src';

const root = join(__dirname, '..');
const REACT = `import { Modal } from '@artisanpack-ui/react';\nexport const App = () => <Modal subtitle="x" className="card" sparkle />;\n`;
const VUE = `<script setup>\nimport { Modal } from '@artisanpack-ui/vue';\n</script>\n<template><Modal subtitle="x" /></template>\n`;

let cwd: string;

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'apui-codemod-'));
  mkdirSync(join(cwd, 'src/pages'), { recursive: true });
  mkdirSync(join(cwd, 'src/node_modules/pkg'), { recursive: true });
  writeFileSync(join(cwd, 'src/pages/App.tsx'), REACT);
  writeFileSync(join(cwd, 'src/pages/Page.vue'), VUE);
  writeFileSync(join(cwd, 'src/app.css'), '@plugin "daisyui";\n');
  writeFileSync(join(cwd, 'src/clean.ts'), 'export const x = 1;\n');
  writeFileSync(join(cwd, 'src/node_modules/pkg/index.tsx'), REACT);
});

afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
});

describe('run', () => {
  it('rewrites the files of a stack and reports the rest', () => {
    const result = run({ stack: 'react', paths: ['src'], cwd });
    expect(result.scanned).toBe(3);
    expect(result.files.map((file) => [file.file, file.changed])).toEqual([
      ['src/app.css', false],
      ['src/pages/App.tsx', true],
    ]);
    expect(readFileSync(join(cwd, 'src/pages/App.tsx'), 'utf8')).toContain(
      '<Dialog description="x" className="card" sparkle />',
    );
    // Dependencies and other stacks' files are never touched.
    expect(readFileSync(join(cwd, 'src/node_modules/pkg/index.tsx'), 'utf8')).toBe(REACT);
    expect(readFileSync(join(cwd, 'src/pages/Page.vue'), 'utf8')).toBe(VUE);
    expect(result.files[1]!.findings.map((finding) => finding.kind)).toEqual([
      'rewrote',
      'rewrote',
      'class',
    ]);
  });

  it('writes nothing in a dry run and returns a diff', () => {
    const result = run({ stack: 'vue', paths: ['src'], cwd, dryRun: true });
    expect(readFileSync(join(cwd, 'src/pages/Page.vue'), 'utf8')).toBe(VUE);
    const page = result.files.find((file) => file.file === 'src/pages/Page.vue')!;
    expect(page.changed).toBe(true);
    expect(page.diff).toContain('-<template><Modal subtitle="x" /></template>');
    expect(page.diff).toContain('+<template><Dialog description="x" /></template>');
  });

  it('can skip the class report and take single files', () => {
    const result = run({
      stack: 'react',
      paths: ['src/pages/App.tsx'],
      cwd,
      classes: false,
      dryRun: true,
    });
    expect(result.scanned).toBe(1);
    expect(result.files[0]!.findings.every((finding) => finding.kind !== 'class')).toBe(true);
  });

  it('picks the transform by stack and extension', () => {
    expect(transformFile(REACT, 'App.tsx', { stack: 'react' }).changed).toBe(true);
    expect(transformFile(VUE, 'Page.vue', { stack: 'vue' }).changed).toBe(true);
    expect(transformFile(REACT, 'App.tsx', { stack: 'vue' }).changed).toBe(false);
  });
});

describe('apui-codemod', () => {
  const bin = join(root, 'bin/apui-codemod.mjs');

  beforeAll(() => {
    execFileSync('npx', ['tsup'], { cwd: root, stdio: 'pipe' });
  });

  it('previews with --dry-run', () => {
    const output = execFileSync('node', [bin, 'react', '--dry-run'], { cwd, encoding: 'utf8' });
    expect(output).toContain('--- a/src/pages/App.tsx');
    expect(output).toContain(
      '+export const App = () => <Dialog description="x" className="card" sparkle />;',
    );
    expect(output).toContain('2:57  class   `card` is a DaisyUI class');
    expect(output).toContain('3 files scanned, 1 would change.');
    expect(output).toContain('2 DaisyUI classes and theme references');
    expect(readFileSync(join(cwd, 'src/pages/App.tsx'), 'utf8')).toBe(REACT);
  });

  it('writes by default and prints JSON on request', () => {
    const report = JSON.parse(
      execFileSync('node', [bin, 'vue', 'src/pages', '--json', '--no-classes'], {
        cwd,
        encoding: 'utf8',
      }),
    );
    expect(report.files).toHaveLength(1);
    expect(report.files[0]).toMatchObject({ file: 'src/pages/Page.vue', changed: true });
    expect(readFileSync(join(cwd, 'src/pages/Page.vue'), 'utf8')).toContain(
      '<Dialog description="x" />',
    );
  });

  it('explains itself on bad input', () => {
    expect(spawnSync('node', [bin, 'svelte'], { cwd, encoding: 'utf8' })).toMatchObject({
      status: 2,
    });
    expect(spawnSync('node', [bin, 'react', 'nope'], { cwd, encoding: 'utf8' }).stderr).toContain(
      'No such file or directory: nope',
    );
    expect(spawnSync('node', [bin, 'react', '--fast'], { cwd, encoding: 'utf8' }).stderr).toContain(
      'Unknown option: --fast',
    );
    expect(execFileSync('node', [bin, '--help'], { cwd, encoding: 'utf8' })).toContain(
      'Usage: apui-codemod',
    );
  });
});
