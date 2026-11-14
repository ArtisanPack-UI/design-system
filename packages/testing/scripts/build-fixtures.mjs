#!/usr/bin/env node
/**
 * Writes generated/fixtures/<Name>.json for every manifest in
 * @artisanpack-ui/manifest, so the Blade host renders the same fixtures as
 * React and Vue without Node (#39).
 *
 *   node scripts/build-fixtures.mjs           Write the output.
 *   node scripts/build-fixtures.mjs --check   Fail if the output is stale.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadManifests } from '@artisanpack-ui/manifest';

import { componentFixtures } from '../dist/index.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const OUTPUT = join(packageRoot, 'generated', 'fixtures');

/** The fixture files, keyed by file name. */
export function buildFixtures() {
  return Object.fromEntries(
    loadManifests().map((manifest) => [
      `${manifest.name}.json`,
      `${JSON.stringify(componentFixtures(manifest), null, 2)}\n`,
    ]),
  );
}

function main() {
  const check = process.argv.includes('--check');
  const files = buildFixtures();
  const existing = existsSync(OUTPUT) ? readdirSync(OUTPUT).filter((f) => f.endsWith('.json')) : [];
  const stale = [
    ...Object.entries(files)
      .filter(
        ([name, contents]) =>
          !existsSync(join(OUTPUT, name)) || readFileSync(join(OUTPUT, name), 'utf8') !== contents,
      )
      .map(([name]) => name),
    ...existing.filter((name) => !(name in files)),
  ];
  if (check) {
    if (stale.length) {
      console.error(
        `generated/fixtures is stale (${stale.join(', ')}).\nRun \`npm run fixtures\` in packages/testing and commit the result.`,
      );
      process.exitCode = 1;
    } else {
      console.log('Fixtures are up to date.');
    }
    return;
  }
  mkdirSync(OUTPUT, { recursive: true });
  for (const name of existing) if (!(name in files)) rmSync(join(OUTPUT, name));
  for (const [name, contents] of Object.entries(files)) writeFileSync(join(OUTPUT, name), contents);
  console.log(`wrote ${Object.keys(files).length} fixture file(s)`);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
