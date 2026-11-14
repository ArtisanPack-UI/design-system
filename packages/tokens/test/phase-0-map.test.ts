/**
 * Every target in the Phase 0 token audit is mapped into the DTCG tokens
 * (#18): it exists as a token, or contributing/tokens/phase-0-map.json records what
 * superseded it, or why it was dropped or deferred.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadTokens } from '../scripts/lib/model.mjs';

interface Resolution {
  status: 'superseded' | 'dropped' | 'deferred';
  by?: string[];
  issue?: number;
  reason: string;
}

const repo = join(__dirname, '..', '..', '..');
const audit = JSON.parse(
  readFileSync(join(repo, 'contributing/inventory/data/token-map.json'), 'utf8'),
);
const map: { resolutions: Record<string, Resolution> } = JSON.parse(
  readFileSync(join(repo, 'contributing/tokens/phase-0-map.json'), 'utf8'),
);
const model = loadTokens(join(__dirname, '..', 'tokens'));
const cssVars = [...model.tokens.values()].map((entry) => entry.cssVar as string);

const targets: string[] = [
  ...new Set<string>(
    audit.tokens
      .filter((row: { target: string | null }) => row.target)
      .map((row: { target: string }) => row.target),
  ),
];
const pattern = (target: string) =>
  new RegExp(`^${target.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.+')}$`);
const built = (target: string) => cssVars.some((name) => pattern(target).test(name));

describe.each(targets)('%s', (target) => {
  it('exists as a token or has a resolution', () => {
    const resolution = map.resolutions[target];
    expect(built(target) || resolution !== undefined, target).toBe(true);
  });
});

describe.each(Object.entries(map.resolutions))('resolution for %s', (target, resolution) => {
  it('is for an audit target that has no token', () => {
    expect(targets).toContain(target);
    expect(built(target)).toBe(false);
  });

  it('is complete', () => {
    expect(resolution.reason.length).toBeGreaterThan(0);
    if (resolution.status === 'superseded') {
      expect(resolution.by?.length).toBeGreaterThan(0);
      for (const path of resolution.by!) expect(model.tokens.has(path), path).toBe(true);
    } else if (resolution.status === 'deferred') {
      expect(resolution.issue).toBeGreaterThan(0);
    } else {
      expect(resolution.status).toBe('dropped');
    }
  });
});
