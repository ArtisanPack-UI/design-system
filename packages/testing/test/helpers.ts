import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { loadManifest } from '@artisanpack-ui/manifest';

export const reference = join(__dirname, 'reference');
export const manifestsDir = join(reference, 'manifests');
export const probe = () => loadManifest('Probe', manifestsDir);

/** PHP with the root Composer install, for the Blade host. */
export const hasBlade = (() => {
  if (!existsSync(join(__dirname, '../../../vendor/autoload.php'))) return false;
  try {
    execFileSync('php', ['-v'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();
