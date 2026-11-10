import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { ComponentManifest } from '../src/types';

/** A fresh copy of the Button manifest to mutate in a test. */
export function button(): ComponentManifest {
  return JSON.parse(
    readFileSync(join(__dirname, '..', 'components', 'Button.json'), 'utf8'),
  ) as ComponentManifest;
}
