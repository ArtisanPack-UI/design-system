/**
 * WCAG 2.2 AA contrast for semantic pairs (#20), in every theme, for the
 * source and for every preset (#23). Text pairs need 4.5:1; control edges,
 * focus rings and non-text marks need 3:1 (WCAG 1.4.3 and 1.4.11).
 */
import { join } from 'node:path';

import {
  BACKDROPS,
  checkContrast,
  contrastPairs,
  formatFailures,
  GLASS_PAIRS,
  ratio,
  THEMES,
} from '../scripts/lib/contrast-pairs.mjs';
import { loadTokens } from '../scripts/lib/model.mjs';
import { loadPresets } from '../scripts/lib/presets.mjs';

const root = join(__dirname, '..');
const model = loadTokens(join(root, 'tokens'));
const presets = loadPresets(join(root, 'tokens'), join(root, 'presets'));

describe.each(THEMES)('%s theme', (theme) => {
  it.each(contrastPairs())('%s on %s reaches %s:1', (fg, bg, min) => {
    expect(ratio(model, fg, bg, theme)).toBeGreaterThanOrEqual(min);
  });

  it.each(Object.keys(BACKDROPS))('glass text holds over a %s backdrop', (name) => {
    const backdrop = BACKDROPS[name as keyof typeof BACKDROPS];
    for (const [fg, min] of GLASS_PAIRS) {
      expect(ratio(model, fg, 'surface.glass', theme, backdrop)).toBeGreaterThanOrEqual(min);
    }
  });
});

describe('presets', () => {
  it('has the Ledger and Harbor presets (D-005)', () => {
    expect([...presets.keys()]).toEqual(expect.arrayContaining(['ledger', 'harbor']));
  });

  it.each([...presets.keys()])('%s passes every pair in every theme', (name) => {
    const failures = checkContrast(presets.get(name)!);
    expect(failures, formatFailures(failures)).toEqual([]);
  });
});
