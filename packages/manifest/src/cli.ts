/**
 * apui-manifest: validate manifests and diff two versions of one.
 *
 *   apui-manifest validate [files...]       All of components/ when no files are given.
 *   apui-manifest diff <before> <after>     Markdown for an upgrade guide.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { diffManifests, formatChanges } from './diff';
import { componentsDir } from './load';
import type { ComponentManifest } from './types';
import { validateManifest, validateManifests } from './validate';

const USAGE =
  'Usage: apui-manifest validate [files...] | apui-manifest diff <before.json> <after.json>';

class ReadError extends Error {}

function read(file: string): unknown {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new ReadError(`${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function report(errors: { path: string; message: string }[], file?: string): void {
  for (const error of errors) {
    console.error(`${file ? `${file} ` : ''}${error.path}: ${error.message}`);
  }
}

function validate(files: string[]): number {
  const paths = files.length
    ? files
    : readdirSync(componentsDir)
        .filter((name) => name.endsWith('.json'))
        .sort()
        .map((name) => join(componentsDir, name));
  const sources = paths.map((file) => ({ data: read(file), file: basename(file) }));
  const result = validateManifests(sources);
  report(result.errors);
  if (!result.valid) return 1;
  console.log(`${sources.length} manifest${sources.length === 1 ? '' : 's'} valid.`);
  return 0;
}

function diff(files: string[]): number {
  if (files.length !== 2) {
    console.error(USAGE);
    return 2;
  }
  let invalid = false;
  const [before, after] = files.map((file) => {
    const data = read(file);
    const result = validateManifest(data);
    report(result.errors, file);
    invalid ||= !result.valid;
    return data as ComponentManifest;
  }) as [ComponentManifest, ComponentManifest];
  if (invalid) return 1;
  console.log(formatChanges(diffManifests(before, after), { component: after.name }));
  return 0;
}

function run(command: string | undefined, args: string[]): number {
  if (args.some((arg) => arg.startsWith('-'))) {
    console.error(USAGE);
    return 2;
  }
  try {
    if (command === 'validate') return validate(args);
    if (command === 'diff') return diff(args);
  } catch (error) {
    if (!(error instanceof ReadError)) throw error;
    console.error(error.message);
    return 1;
  }
  console.error(USAGE);
  return 2;
}

const [command, ...args] = process.argv.slice(2);
process.exitCode = run(command, args);
