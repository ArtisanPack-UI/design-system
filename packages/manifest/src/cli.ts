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
import { validateManifests } from './validate';

const USAGE =
  'Usage: apui-manifest validate [files...] | apui-manifest diff <before.json> <after.json>';

function read(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
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
  for (const error of result.errors) console.error(`${error.path}: ${error.message}`);
  if (!result.valid) return 1;
  console.log(`${sources.length} manifest${sources.length === 1 ? '' : 's'} valid.`);
  return 0;
}

function diff(files: string[]): number {
  if (files.length !== 2) {
    console.error(USAGE);
    return 2;
  }
  const [before, after] = files.map((file) => read(file) as ComponentManifest) as [
    ComponentManifest,
    ComponentManifest,
  ];
  console.log(formatChanges(diffManifests(before, after), { component: after.name }));
  return 0;
}

const [command, ...args] = process.argv.slice(2);
if (command === 'validate') process.exitCode = validate(args);
else if (command === 'diff') process.exitCode = diff(args);
else {
  console.error(USAGE);
  process.exitCode = 2;
}
