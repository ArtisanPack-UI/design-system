#!/usr/bin/env node
/**
 * Builds the token outputs from the DTCG source.
 *
 *   node scripts/build-tokens.mjs           Validate and write the outputs.
 *   node scripts/build-tokens.mjs --check   Validate and fail if any output is stale.
 */
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatCss, formatPhp, formatTs } from './lib/formats.mjs';
import { loadTokens, TokenError } from './lib/model.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

export const OUTPUTS = {
  'generated/tokens.css': formatCss,
  'generated/tokens.php': formatPhp,
  'src/generated/tokens.ts': formatTs,
};

export function buildOutputs(root = packageRoot) {
  const model = loadTokens(join(root, 'tokens'));
  return Object.fromEntries(Object.entries(OUTPUTS).map(([file, format]) => [file, format(model)]));
}

function main() {
  const check = process.argv.includes('--check');
  let outputs;
  try {
    outputs = buildOutputs();
  } catch (error) {
    if (!(error instanceof TokenError)) throw error;
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const stale = [];
  for (const [file, contents] of Object.entries(outputs)) {
    const path = join(packageRoot, file);
    const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (current === contents) continue;
    if (check) {
      stale.push(file);
      continue;
    }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
    console.log(`wrote ${relative(process.cwd(), path)}`);
  }

  if (stale.length) {
    console.error(
      `Token outputs are stale: ${stale.join(', ')}.\nRun \`npm run tokens\` in packages/tokens and commit the result.`,
    );
    process.exitCode = 1;
  } else if (check) {
    console.log('Token outputs are up to date.');
  }
}

// Compare real paths: run through a symlink, argv[1] keeps the link while
// import.meta.url has the target, and the check would silently not run.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
