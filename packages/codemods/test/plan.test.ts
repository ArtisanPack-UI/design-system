import { describe, expect, it } from 'vitest';

import { planAttribute } from '../src';
import { durationMs } from '../src/plan';

describe('durationMs', () => {
  it.each([
    ['250ms', 250],
    ['250', 250],
    ['1s', 1000],
    ['1.5s', 1500],
    [' 2 S ', 2000],
    ['0', 0],
  ])('reads %s as %d', (text, ms) => {
    expect(durationMs(text)).toBe(ms);
  });

  it.each(['', 'fast', '1m', '-5ms', '1s 2'])('rejects %j', (text) => {
    expect(durationMs(text)).toBeNull();
  });
});

describe('planAttribute', () => {
  const duration = { kind: 'duration', to: 'debounce' } as const;

  it('turns a duration literal into a number', () => {
    expect(planAttribute('debounce', duration, { type: 'literal', value: '1s', string: true })).toEqual({
      plan: { type: 'number', to: 'debounce', value: 1000 },
    });
    expect(planAttribute('debounce', duration, { type: 'literal', value: '300', string: false })).toEqual({
      plan: { type: 'number', to: 'debounce', value: 300 },
    });
  });

  it('leaves a dynamic or unreadable duration for a person', () => {
    for (const attr of [
      { type: 'dynamic' as const },
      { type: 'literal' as const, value: 'soon', string: true },
    ]) {
      const planned = planAttribute('debounce', duration, attr);
      expect(planned.plan).toEqual({ type: 'none' });
      expect(planned.manual).toContain('integer milliseconds');
    }
  });

  it('leaves a kept member alone', () => {
    expect(
      planAttribute('title', { kind: 'keep', note: 'Unchanged.' }, { type: 'literal', value: 'x', string: true }),
    ).toEqual({ plan: { type: 'none' } });
  });
});
