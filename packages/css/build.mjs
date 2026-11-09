/**
 * Bundles src/index.css into dist/index.css by inlining each @import in order.
 * Package imports (such as @artisanpack-ui/tokens/css) resolve through Node.
 */
import { mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const IMPORT = /^@import\s+['"]([^'"]+)['"];\s*$/gm;

function resolveImport(specifier, from) {
  return specifier.startsWith('.') ? resolve(dirname(from), specifier) : require.resolve(specifier);
}

/** Returns the bundled CSS for an entry file. */
export function bundle(entry = join(here, 'src', 'index.css'), seen = new Set()) {
  if (seen.has(entry)) throw new Error(`circular @import of ${entry}`);
  seen.add(entry);
  const css = readFileSync(entry, 'utf8');
  return css.replace(IMPORT, (_line, specifier) =>
    bundle(resolveImport(specifier, entry), new Set(seen)).trimEnd(),
  );
}

// Real paths, so running the script through a symlink still builds.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = join(here, 'dist');
  rmSync(dist, { recursive: true, force: true });
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, 'index.css'), bundle());
  console.log('wrote dist/index.css');
}
