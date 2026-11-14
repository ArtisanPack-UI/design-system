#!/usr/bin/env node
/**
 * Builds the token playground (#29) into dist/: plain files that open from
 * disk, with no server and no bundler.
 *
 *   node build.mjs          Write dist/.
 *   node build.mjs --open   Write dist/ and print the file URL to open.
 *
 * dist/apui.css is the full @artisanpack-ui/css bundle plus every brand preset,
 * and dist/tokens.js puts the token map on `window.APUI_TOKENS`. Classic
 * scripts, not modules, because browsers block module scripts on file://.
 */
import { mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { axes, presetAttribute, presets, tokens } from '@artisanpack-ui/tokens';

import { bundle } from '../../packages/css/build.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/** Presets that ship in @artisanpack-ui/css; any other preset is an opt-in import. */
const BUNDLED_PRESETS = ['ledger', 'harbor'];

/** The data the page needs: every token, the axes and the presets. */
export function playgroundData() {
  return {
    axes,
    presetAttribute,
    presets: Object.values(presets).map(({ name, description, tokens: changes }) => ({
      name,
      description,
      values: Object.fromEntries(Object.entries(changes).map(([path, { value }]) => [path, value])),
    })),
    tokens: Object.entries(tokens).map(([path, token]) => ({
      path,
      cssVar: token.cssVar,
      type: token.type,
      tier: token.tier,
      axis: token.axis,
      value: token.value,
    })),
  };
}

/** The stylesheet: the CSS bundle, then each brand preset that isn't in it. */
export function playgroundCss() {
  const brand = Object.keys(presets)
    .filter((name) => !BUNDLED_PRESETS.includes(name))
    .map((name) =>
      readFileSync(require.resolve(`@artisanpack-ui/tokens/presets/${name}.css`), 'utf8'),
    );
  return [bundle(), ...brand].join('\n');
}

/** Every file in dist/, keyed by name. */
export function buildPlayground() {
  return {
    'apui.css': playgroundCss(),
    'tokens.js': `window.APUI_TOKENS = ${JSON.stringify(playgroundData())};\n`,
    'index.html': readFileSync(join(here, 'src', 'index.html'), 'utf8'),
    'playground.css': readFileSync(join(here, 'src', 'playground.css'), 'utf8'),
    'playground.js': readFileSync(join(here, 'src', 'playground.js'), 'utf8'),
  };
}

/** Writes dist/ and returns the path of the page. */
export function writePlayground(dist = join(here, 'dist')) {
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });
  for (const [file, contents] of Object.entries(buildPlayground())) {
    writeFileSync(join(dist, file), contents);
  }
  return join(dist, 'index.html');
}

// Real paths, so running the script through a symlink still builds.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const page = writePlayground();
  console.log(`wrote ${page}`);
  if (process.argv.includes('--open')) console.log(`open ${pathToFileURL(page).href}`);
}
