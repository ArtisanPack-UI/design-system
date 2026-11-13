/** Runs a codemod over files on disk. */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

import { findClasses } from './classes';
import { unifiedDiff } from './diff';
import { transformReact } from './react';
import type { Finding, TransformResult, UpgradeRules } from './types';
import { transformVue, transformVueScript } from './vue';

export type CodemodStack = 'react' | 'vue';

export interface RunOptions {
  stack: CodemodStack;
  /** Files and directories; directories are walked. */
  paths: string[];
  /** Report and diff without writing. */
  dryRun?: boolean;
  /** Also report raw DaisyUI classes and theme references. On by default. */
  classes?: boolean;
  /** Vue: treat unimported tags named like 2.x components as components. */
  global?: boolean;
  /** Paths in the report are relative to this; the working directory by default. */
  cwd?: string;
  rules?: UpgradeRules;
}

export interface FileResult {
  /** Relative to `cwd`. */
  file: string;
  changed: boolean;
  findings: Finding[];
  /** A unified diff, when the file changed. */
  diff: string;
}

export interface RunResult {
  files: FileResult[];
  scanned: number;
}

const EXTENSIONS: Record<CodemodStack, Set<string>> = {
  react: new Set(['.tsx', '.jsx', '.ts', '.js', '.mts', '.mjs']),
  vue: new Set(['.vue', '.ts', '.js', '.tsx', '.jsx', '.mts', '.mjs']),
};
/** Other files that can carry DaisyUI classes or theme variables. */
const CLASS_EXTENSIONS = new Set(['.css', '.html', '.php']);
const SKIP = new Set([
  'node_modules',
  'vendor',
  'dist',
  'build',
  '.git',
  '.next',
  '.nuxt',
  'coverage',
]);

function collect(path: string, wanted: (file: string) => boolean, out: string[]): void {
  const stats = statSync(path);
  if (stats.isFile()) {
    if (wanted(path)) out.push(path);
    return;
  }
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP.has(entry.name)) continue;
    const child = join(path, entry.name);
    if (entry.isDirectory()) collect(child, wanted, out);
    else if (entry.isFile() && wanted(child)) out.push(child);
  }
}

/** Transforms one source file for a stack, by its extension. */
export function transformFile(
  source: string,
  file: string,
  options: Pick<RunOptions, 'stack' | 'global' | 'rules'>,
): TransformResult {
  if (options.stack === 'react') return transformReact(source, file, { rules: options.rules });
  return extname(file) === '.vue'
    ? transformVue(source, file, { rules: options.rules, global: options.global })
    : transformVueScript(source, file, { rules: options.rules });
}

/** Runs the codemod for a stack over `paths`, writing files unless `dryRun`. */
export function run(options: RunOptions): RunResult {
  const cwd = options.cwd ?? process.cwd();
  const code = EXTENSIONS[options.stack];
  const withClasses = options.classes !== false;
  const files: string[] = [];
  for (const path of options.paths) {
    collect(
      resolve(cwd, path),
      (file) => code.has(extname(file)) || (withClasses && CLASS_EXTENSIONS.has(extname(file))),
      files,
    );
  }

  const results: FileResult[] = [];
  for (const path of [...new Set(files)].sort()) {
    const source = readFileSync(path, 'utf8');
    const file = relative(cwd, path);
    const result = code.has(extname(path))
      ? transformFile(source, path, options)
      : { code: source, changed: false, findings: [] };
    const findings = withClasses
      ? [...result.findings, ...findClasses(source, options.rules?.classes)]
      : result.findings;
    if (!result.changed && !findings.length) continue;
    // The diff comes first, so a file is never written without its report.
    const diff = result.changed ? unifiedDiff(file, source, result.code) : '';
    if (result.changed && !options.dryRun) writeFileSync(path, result.code);
    results.push({ file, changed: result.changed, findings, diff });
  }
  return { files: results, scanned: new Set(files).size };
}
