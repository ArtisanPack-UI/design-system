#!/usr/bin/env node
/**
 * Writes the Figma sync as numbered Plugin API scripts that each fit the Figma
 * connector's size cap (#28). See contributing/figma.md.
 *
 *   node scripts/figma-chunks.mjs [out-dir]   Default out-dir: .figma-chunks
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { figmaChunks } from './lib/figma.mjs';
import { loadTokens } from './lib/model.mjs';
import { loadPresets } from './lib/presets.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? join(packageRoot, '.figma-chunks'));

const base = loadTokens(join(packageRoot, 'tokens'));
const presets = loadPresets(join(packageRoot, 'tokens'), join(packageRoot, 'presets'));
const chunks = figmaChunks(base, presets);

mkdirSync(out, { recursive: true });
for (const name of readdirSync(out)) {
  // Only files this script writes, so a wrong out-dir loses nothing else.
  if (/^\d{2}-(declare|values|prune|reference)\.js$/.test(name)) rmSync(join(out, name));
}
chunks.forEach((chunk, index) => {
  const file = `${String(index + 1).padStart(2, '0')}-${chunk.step}.js`;
  writeFileSync(join(out, file), chunk.code);
  console.log(`${file} (${chunk.code.length} characters)`);
});
