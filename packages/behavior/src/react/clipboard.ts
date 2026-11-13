/**
 * `useClipboard` and `useApplePlatform` for the React adapter (#65), on the
 * same copy controller and platform check as the Alpine components, so
 * Clipboard, Code and Kbd behave alike in every stack.
 *
 *   const clipboard = useClipboard({ timeout: 2000 });
 *   <button data-state={clipboard.status} onClick={() => clipboard.copy(value)}>…</button>
 *   <span role="status">{clipboardMessage(clipboard.status, labels)}</span>
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createClipboard,
  type ClipboardController,
  type ClipboardStatus,
} from '../widgets/clipboard';
import { isApplePlatform } from '../widgets/spotlight';

/** Options for `useClipboard`. */
export interface UseClipboardOptions {
  /** How long "Copied" shows, in ms. @defaultValue 2000 */
  timeout?: number;
}

/** What `useClipboard` returns. */
export interface UseClipboardResult {
  /** `idle`, `copied` or `failed`. */
  status: ClipboardStatus;
  /** Copies the text; resolves `true` when it reached the clipboard. */
  copy: (text: string | null | undefined) => Promise<boolean>;
  /** Back to `idle` now. */
  reset: () => void;
}

/** The copy status and a `copy` function. The timer stops on unmount. */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardResult {
  const [status, setStatus] = useState<ClipboardStatus>('idle');
  const timeout = useRef(options.timeout);
  timeout.current = options.timeout;
  const controller = useRef<ClipboardController | null>(null);

  const get = () => {
    controller.current ??= createClipboard({
      get timeout() {
        return timeout.current;
      },
      onStatusChange: setStatus,
    });
    return controller.current;
  };

  useEffect(
    () => () => {
      controller.current?.destroy();
      controller.current = null;
    },
    [],
  );

  const copy = useCallback((text: string | null | undefined) => get().copy(text), []);
  const reset = useCallback(() => get().reset(), []);
  return { status, copy, reset };
}

/**
 * Whether to show Apple keys: `true` or `false` when the platform is given,
 * else measured after mount (the first render, and the server's, use the
 * other platforms' keys).
 */
export function useApplePlatform(platform: 'auto' | 'mac' | 'other' = 'auto'): boolean {
  const [apple, setApple] = useState(false);
  useEffect(() => {
    if (platform === 'auto') setApple(isApplePlatform());
  }, [platform]);
  return platform === 'auto' ? apple : platform === 'mac';
}
