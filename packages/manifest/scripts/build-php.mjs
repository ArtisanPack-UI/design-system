#!/usr/bin/env node
/**
 * Writes generated/manifests.php from components/*.json, for the PHP loader
 * in php/ (Livewire test harnesses read it without Node).
 *
 *   node scripts/build-php.mjs           Write the output.
 *   node scripts/build-php.mjs --check   Fail if the output is stale.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const OUTPUT = 'generated/manifests.php';

const NOTICE =
  'Generated from packages/manifest/components/*.json. Do not edit; run `npm run manifest`.';

const phpString = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** A PHP literal in the same style as the tokens' PHP output: tabs, aligned `=>`. */
export function phpValue(value, depth = 0) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return phpString(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    if (value.every((item) => item === null || typeof item !== 'object')) {
      return `[ ${value.map((item) => phpValue(item, depth)).join(', ')} ]`;
    }
    const indent = '\t'.repeat(depth + 1);
    const rows = value.map((item) => `${indent}${phpValue(item, depth + 1)},`);
    return `[\n${rows.join('\n')}\n${'\t'.repeat(depth)}]`;
  }
  const entries = Object.entries(value);
  if (!entries.length) return '[]';
  const indent = '\t'.repeat(depth + 1);
  const keys = entries.map(([key]) => phpString(key));
  const width = Math.max(...keys.map((key) => key.length));
  const rows = entries.map(
    ([, item], i) => `${indent}${keys[i].padEnd(width)} => ${phpValue(item, depth + 1)},`,
  );
  return `[\n${rows.join('\n')}\n${'\t'.repeat(depth)}]`;
}

/** Reads every manifest, sorted by file name, without the `$schema` pointer. */
export function readManifests(root = packageRoot) {
  const dir = join(root, 'components');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const manifest = JSON.parse(readFileSync(join(dir, name), 'utf8'));
      delete manifest.$schema;
      return manifest;
    });
}

/** The contents of generated/manifests.php. */
export function formatPhp(manifests) {
  const data = Object.fromEntries(manifests.map((manifest) => [manifest.name, manifest]));
  return `<?php\n\n/**\n * ${NOTICE}\n *\n * @package ArtisanPack_UI\n */\n\nreturn ${phpValue(data, 0)};\n`;
}

export function buildPhp(root = packageRoot) {
  return formatPhp(readManifests(root));
}

function main() {
  const check = process.argv.includes('--check');
  const path = join(packageRoot, OUTPUT);
  const contents = buildPhp();
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (current === contents) {
    if (check) console.log('Manifest PHP output is up to date.');
    return;
  }
  if (check) {
    console.error(
      `${OUTPUT} is stale.\nRun \`npm run manifest\` in packages/manifest and commit the result.`,
    );
    process.exitCode = 1;
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  console.log(`wrote ${relative(process.cwd(), path)}`);
}

// Compare real paths: run through a symlink, argv[1] keeps the link while
// import.meta.url has the target, and the check would silently not run.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
