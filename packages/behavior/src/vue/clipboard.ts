/**
 * `useClipboard` and `useApplePlatform` for the Vue adapter (#65), on the
 * same copy controller and platform check as the Alpine components, so
 * Clipboard, Code and Kbd behave alike in every stack. Options are an
 * object, a ref or a getter, so they can follow props.
 *
 *   const clipboard = useClipboard(() => ({ timeout: props.timeout }));
 *   <button :data-state="clipboard.status.value" @click="clipboard.copy(value)">…</button>
 */
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  ref,
  type Ref,
  toValue,
} from 'vue';

import { createClipboard, type ClipboardStatus } from '../widgets/clipboard';
import { isApplePlatform } from '../widgets/spotlight';

/** Options for `useClipboard`. */
export interface UseClipboardOptions {
  /** How long "Copied" shows, in ms. @defaultValue 2000 */
  timeout?: number;
}

/** What `useClipboard` returns. */
export interface UseClipboardResult {
  /** `idle`, `copied` or `failed`. */
  status: Ref<ClipboardStatus>;
  /** Copies the text; resolves `true` when it reached the clipboard. */
  copy: (text: string | null | undefined) => Promise<boolean>;
  /** Back to `idle` now. */
  reset: () => void;
}

/** The copy status and a `copy` function. The timer stops on unmount. */
export function useClipboard(
  options: MaybeRefOrGetter<UseClipboardOptions> = {},
): UseClipboardResult {
  const status = ref<ClipboardStatus>('idle');
  const controller = createClipboard({
    get timeout() {
      return toValue(options).timeout;
    },
    onStatusChange: (next) => {
      status.value = next;
    },
  });
  onBeforeUnmount(() => controller.destroy());
  return { status, copy: (text) => controller.copy(text), reset: () => controller.reset() };
}

/**
 * Whether to show Apple keys: fixed when the platform is given, else measured
 * after mount (the first render, and the server's, use the other platforms' keys).
 */
export function useApplePlatform(
  platform: MaybeRefOrGetter<'auto' | 'mac' | 'other' | undefined>,
): ComputedRef<boolean> {
  const measured = ref(false);
  onMounted(() => {
    measured.value = isApplePlatform();
  });
  return computed(() => {
    const value = toValue(platform) ?? 'auto';
    return value === 'auto' ? measured.value : value === 'mac';
  });
}
