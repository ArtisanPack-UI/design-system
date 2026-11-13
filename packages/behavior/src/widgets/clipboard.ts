/**
 * Clipboard (#65): the copy logic Clipboard and Code share in every stack.
 * Not a Zag machine: a small controller around `navigator.clipboard` with a
 * hidden-textarea fallback for pages where the async API is missing or
 * blocked (http, old browsers, some embedded webviews), and the timeout that
 * turns "Copied" back into "Copy".
 *
 * The status is `idle`, `copied` or `failed`. A component shows it as
 * `data-state`, swaps its label to "Copied" while copied, and puts the
 * message (`clipboardMessage`) in a live region, so the result is announced
 * either way. A failure is announced too, never silent.
 *
 *   const clipboard = createClipboard({ onStatusChange: (status) => render(status) });
 *   await clipboard.copy('https://example.com');
 *   clipboard.destroy();
 *
 * The Alpine component is `apuiClipboard`; React and Vue have `useClipboard`.
 */

/** The `data-scope` Clipboard's parts carry. */
export const CLIPBOARD_SCOPE = 'clipboard';

/** How long "Copied" (or the failure) shows, in ms, from the spec. */
export const CLIPBOARD_TIMEOUT = 2000;

/** The built-in strings. Translate them through each component's label props. */
export const CLIPBOARD_LABELS = {
  /** The button's label while idle. */
  copy: 'Copy',
  /** The button's label after a copy. */
  copied: 'Copied',
  /** Announced (and shown in the icon button's tooltip) after a copy. */
  copiedMessage: 'Copied to clipboard',
  /** Announced (and shown in the icon button's tooltip) when the copy fails. */
  errorMessage: "Couldn't copy. Select the text and copy it yourself.",
} as const;

/** A copy's result, shown as `data-state`. */
export type ClipboardStatus = 'idle' | 'copied' | 'failed';

/** Labels for the copy button and its live region. */
export type ClipboardLabels = Partial<Record<keyof typeof CLIPBOARD_LABELS, string>>;

/** Options for {@link createClipboard}. */
export interface ClipboardOptions {
  /** How long the result shows before the status returns to `idle`, in ms. @defaultValue 2000 */
  timeout?: number;
  /** Called on every status change. */
  onStatusChange?: (status: ClipboardStatus) => void;
  /** Writes the text; defaults to {@link writeClipboard}. Tests swap it. */
  write?: (text: string) => Promise<boolean>;
}

/** The controller {@link createClipboard} returns. */
export interface ClipboardController {
  /** The current status. */
  readonly status: ClipboardStatus;
  /** Copies the text; resolves `true` when it reached the clipboard. */
  copy(text: string | null | undefined): Promise<boolean>;
  /** Back to `idle` now. */
  reset(): void;
  /** Clears the timer. Call it when the component unmounts. */
  destroy(): void;
}

/**
 * Copies with a hidden, read-only textarea and `execCommand('copy')`, for
 * pages where `navigator.clipboard` isn't available. Focus returns to where
 * it was.
 */
function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined' || !document.body) return false;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.tabIndex = -1;
  area.style.position = 'fixed';
  area.style.insetBlockStart = '0';
  area.style.insetInlineStart = '0';
  area.style.opacity = '0';
  area.style.pointerEvents = 'none';
  const active = document.activeElement as HTMLElement | null;
  document.body.appendChild(area);
  let copied: boolean;
  try {
    area.focus({ preventScroll: true });
    area.select();
    area.setSelectionRange(0, text.length);
    copied = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    copied = false;
  }
  area.remove();
  active?.focus?.({ preventScroll: true });
  return copied;
}

/**
 * Writes text to the clipboard: `navigator.clipboard.writeText` when the page
 * may use it, else the textarea fallback. Resolves `false` when both fail.
 */
export async function writeClipboard(text: string): Promise<boolean> {
  const api = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
  if (api && typeof api.writeText === 'function') {
    try {
      await api.writeText(text);
      return true;
    } catch {
      // Blocked (no permission, not focused, insecure context): try the fallback.
    }
  }
  return legacyCopy(text);
}

/** The live region's text for a status: empty while idle. */
export function clipboardMessage(status: ClipboardStatus, labels: ClipboardLabels = {}): string {
  if (status === 'copied') return labels.copiedMessage ?? CLIPBOARD_LABELS.copiedMessage;
  if (status === 'failed') return labels.errorMessage ?? CLIPBOARD_LABELS.errorMessage;
  return '';
}

/** The copy button's label for a status: "Copied" only after a copy. */
export function clipboardLabel(status: ClipboardStatus, labels: ClipboardLabels = {}): string {
  return status === 'copied'
    ? (labels.copied ?? CLIPBOARD_LABELS.copied)
    : (labels.copy ?? CLIPBOARD_LABELS.copy);
}

/** The timeout as a whole, non-negative number of ms; the default for anything else. */
export function clipboardTimeout(timeout: unknown): number {
  const value = typeof timeout === 'string' && timeout.trim() !== '' ? Number(timeout) : timeout;
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : CLIPBOARD_TIMEOUT;
}

/**
 * A copy controller. Each copy goes back to `idle` first, so copying the same
 * text twice changes the live region twice and is announced twice.
 */
export function createClipboard(options: ClipboardOptions = {}): ClipboardController {
  let status: ClipboardStatus = 'idle';
  let timer: ReturnType<typeof setTimeout> | undefined;
  let run = 0;
  const write = options.write ?? writeClipboard;

  const clear = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const set = (next: ClipboardStatus) => {
    if (next === status) return;
    status = next;
    options.onStatusChange?.(next);
  };

  return {
    get status() {
      return status;
    },
    async copy(text) {
      clear();
      set('idle');
      const current = ++run;
      let copied: boolean;
      try {
        copied = await write(String(text ?? ''));
      } catch {
        copied = false;
      }
      // A newer copy started meanwhile: it owns the status.
      if (current !== run) return copied;
      set(copied ? 'copied' : 'failed');
      timer = setTimeout(() => {
        timer = undefined;
        set('idle');
      }, clipboardTimeout(options.timeout));
      return copied;
    },
    reset() {
      clear();
      run++;
      set('idle');
    },
    destroy() {
      clear();
      run++;
    },
  };
}
