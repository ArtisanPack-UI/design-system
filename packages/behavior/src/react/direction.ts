/**
 * `useDirection` for the React hooks: the explicit `dir`, else the direction
 * measured around the widget after mount (`measureDirection`), else
 * undefined, so the first render (and the server's) reads `<html dir>`.
 */
import { useEffect, useLayoutEffect, useState } from 'react';

import { measureDirection } from '../core/direction';
import type { Direction } from '../positioning';

/** useLayoutEffect in the browser, so the machine gets the direction before paint; useEffect on the server. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** The direction to pass to a machine: `explicit`, else the measured one. */
export function useDirection(
  explicit: Direction | undefined,
  id: string,
  ids?: unknown,
): Direction | undefined {
  const [measured, setMeasured] = useState<Direction | undefined>(undefined);
  useIsomorphicLayoutEffect(() => {
    if (explicit) return;
    const next = measureDirection(id, ids);
    if (next && next !== measured) setMeasured(next);
    // Measured once per mount and id: reading computed style on every render
    // would force a style recalculation per keystroke.
  }, [explicit, id]);
  return explicit ?? measured;
}
