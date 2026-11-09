// Copies src/ to dist/. #21 replaces this with the real CSS build.
import { cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
rmSync(join(here, 'dist'), { recursive: true, force: true });
cpSync(join(here, 'src'), join(here, 'dist'), { recursive: true });
