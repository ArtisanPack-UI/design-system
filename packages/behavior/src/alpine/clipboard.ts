/**
 * The `apuiClipboard` and `apuiKbd` Alpine components (#65).
 *
 * `apuiClipboard` holds the copy status for Clipboard and Code. The view
 * binds `data-state` to `status`, the label to `label`, the icon to `icon`
 * and the live region to `message`; the button calls `copy(value)` (Code's
 * calls `copyCode()`, which reads the server-rendered lines back):
 *
 *   <span class="apui-clipboard" data-scope="clipboard" data-part="root" data-variant="button"
 *     data-size="sm" x-data="apuiClipboard({ timeout: 2000 })" x-bind:data-state="status">
 *     <button class="apui-button" data-scope="clipboard" data-part="button" value="…"
 *       x-bind:data-state="status" x-on:click="copy($el.value)">
 *       <span x-html="icon">…</span><span x-text="label">Copy</span>
 *     </button>
 *     <span data-scope="clipboard" data-part="tooltip" role="status" x-text="message"></span>
 *   </span>
 *
 * `apuiKbd` shows a server-rendered combo's keys for the platform: the
 * server renders Ctrl for `mod`, the client ⌘ on Apple platforms.
 *
 *   <kbd class="apui-kbd-combo" x-data="apuiKbd({ keys: ['mod', 'k'] })">
 *     <kbd class="apui-kbd"><span x-text="keys[0].text">Ctrl</span>…</kbd>
 *   </kbd>
 */
import { codeText } from '../data/code';
import { kbdKeys, type KbdKey, type KbdLabels } from '../data/kbd';
import { iconSvg } from '../icons';
import {
  clipboardLabel,
  clipboardMessage,
  createClipboard,
  type ClipboardController,
  type ClipboardLabels,
  type ClipboardStatus,
} from '../widgets/clipboard';
import { isApplePlatform } from '../widgets/spotlight';

/** Options for `apuiClipboard`. */
export interface ClipboardAlpineOptions {
  /** How long "Copied" shows, in ms. @defaultValue 2000 */
  timeout?: number;
  /** The button's labels and the live region's messages. */
  labels?: ClipboardLabels;
}

interface AlpineMagics {
  $root: HTMLElement;
}

/** The `apuiClipboard` component: status, label, icon and message for the view to bind. */
export function clipboardComponent(options: ClipboardAlpineOptions = {}) {
  let controller: ClipboardController | undefined;
  return {
    status: 'idle' as ClipboardStatus,

    init(this: { status: ClipboardStatus }) {
      controller = createClipboard({
        timeout: options.timeout,
        onStatusChange: (status) => {
          this.status = status;
        },
      });
    },

    destroy() {
      controller?.destroy();
    },

    /** Whether the last copy worked and its timeout hasn't run out. */
    get copied(): boolean {
      return this.status === 'copied';
    },

    /** The button's label: "Copied" while copied, else "Copy". */
    get label(): string {
      return clipboardLabel(this.status, options.labels);
    },

    /** The live region's text: empty while idle. */
    get message(): string {
      return clipboardMessage(this.status, options.labels);
    },

    /** The button's icon: a check while copied, else the copy icon. */
    get icon(): string {
      return iconSvg(this.status === 'copied' ? 'check' : 'copy');
    },

    /** Copies the text; resolves `true` when it reached the clipboard. */
    copy(text: string | null | undefined): Promise<boolean> {
      return controller?.copy(text) ?? Promise.resolve(false);
    },

    /** Copies the Code block's lines, as the server rendered them. */
    copyCode(this: AlpineMagics & { copy: (text: string) => Promise<boolean> }): Promise<boolean> {
      return this.copy(codeText(this.$root));
    },
  };
}

/** Options for `apuiKbd`. */
export interface KbdAlpineOptions {
  /** The keys as given to the component (`mod`, `shift`, `k`). */
  keys?: unknown[];
  /** Replacement text alternatives for symbol keys. */
  labels?: KbdLabels;
}

/** The `apuiKbd` component: the keys for this platform, by index. */
export function kbdComponent(options: KbdAlpineOptions = {}) {
  return {
    keys: kbdKeys(options.keys, false, options.labels) as KbdKey[],

    init(this: { keys: KbdKey[] }) {
      if (isApplePlatform()) this.keys = kbdKeys(options.keys, true, options.labels);
    },
  };
}
