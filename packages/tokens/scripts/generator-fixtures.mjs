#!/usr/bin/env node
/**
 * Golden fixtures for the brand preset generator (#27): inputs and the exact
 * CSS and data the JavaScript core produces. Ports of the generator, such as
 * the Livewire package's PHP PresetGenerator, test against copies of them.
 *
 *   node scripts/generator-fixtures.mjs           Write test/fixtures/generator/*.json
 *   node scripts/generator-fixtures.mjs --check   Fail if they are stale.
 */
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderPreset } from './generate-preset.mjs';
import { generatePreset } from './lib/generator.mjs';
import { presetData } from './lib/presets.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const FIXTURE_DIR = join(packageRoot, 'test', 'fixtures', 'generator');

/** Inputs that cover each option and a spread of hues, lightnesses and chromas. */
export const CASES = {
  forest: { primary: '#1f6f3d' },
  violet: { primary: '#7c3aed', accent: '#f59e0b' },
  coral: { primary: '#e88761', neutral: 'pure' },
  lemon: { primary: '#ffee00', secondary: '#ff0066', neutral: 'keep' },
  ink: {
    primary: '#111111',
    fontSans: 'Inter, system-ui, sans-serif',
    fontDisplay: 'Fraunces, serif',
  },
  cyan: { primary: '#0cf' },
};

/** Every fixture file and its contents. */
export function buildFixtures() {
  return Object.fromEntries(
    Object.entries(CASES).map(([name, options]) => {
      const result = generatePreset(join(packageRoot, 'tokens'), { name, ...options });
      const fixture = {
        options: { name, ...options },
        anchors: result.anchors,
        failures: result.failures.length,
        data: presetData(result.base, result.model),
        css: renderPreset(result, 'css')[''],
      };
      return [`${name}.json`, `${JSON.stringify(fixture, null, 2)}\n`];
    }),
  );
}

function main() {
  const check = process.argv.includes('--check');
  const stale = [];
  for (const [file, contents] of Object.entries(buildFixtures())) {
    const path = join(FIXTURE_DIR, file);
    if (existsSync(path) && readFileSync(path, 'utf8') === contents) continue;
    if (check) {
      stale.push(file);
      continue;
    }
    mkdirSync(FIXTURE_DIR, { recursive: true });
    writeFileSync(path, contents);
    console.log(`wrote test/fixtures/generator/${file}`);
  }
  if (stale.length) {
    console.error(
      `Generator fixtures are stale: ${stale.join(', ')}. Run \`npm run preset:fixtures\`.`,
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
