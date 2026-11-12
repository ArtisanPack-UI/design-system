/**
 * `useDirection` for the Vue composables: the explicit `dir`, else the
 * direction measured around the widget after mount (`measureDirection`),
 * else undefined, so the first render (and the server's) reads `<html dir>`.
 */
import { onMounted, ref, type Ref } from 'vue';

import { measureDirection } from '../core/direction';
import type { Direction } from '../positioning';

/**
 * The measured direction, set after mount. Read it in the options getter as
 * `explicit ?? measured.value`; `target()` gives the machine id and ids.
 */
export function useDirection(
  target: () => { id: string; ids?: unknown },
): Ref<Direction | undefined> {
  const measured = ref<Direction | undefined>(undefined);
  onMounted(() => {
    const { id, ids } = target();
    measured.value = measureDirection(id, ids);
  });
  return measured;
}
