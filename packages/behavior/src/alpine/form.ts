/**
 * Alpine components for the form editors (#53): `apuiSignature`,
 * `apuiRichTextEditor` and `apuiCodeEditor`. They aren't Zag machines, so
 * they drive the shared helpers in `../form` directly and the Blade views
 * bind their parts with plain Alpine directives (`x-on`, `x-bind`, `x-ref`).
 *
 * `value` is plain Alpine state, so `$wire.entangle()` binds it to a
 * Livewire property, which is what `wire:model` on the Blade components
 * compiles to. The CodeEditor's control is a native textarea, so
 * `wire:model` binds it without Alpine (D-018).
 */
import {
  codeEditorKeydown,
  gutterLines,
  positionLabel,
  type CodeEditorTranslations,
  codeEditorTranslations,
} from '../form/code-editor';
import {
  countLabel,
  type RichTextCommand,
  type RichTextOutput,
  RichTextSurface,
  richTextFromHtml,
  richTextToHtml,
  type RichTextTranslations,
  richTextTranslations,
  safeImageUrl,
  safeLinkUrl,
} from '../form/rich-text';
import { rovingKeydown, syncRovingTabIndex } from '../form/roving';
import {
  initialSignatureMode,
  readSignatureImage,
  renderTypedSignature,
  type SignatureMode,
  signatureModes,
  SignaturePad,
  type SignatureTranslations,
  signatureTranslations,
} from '../form/signature-pad';

/** The magics the components use. */
interface Magics {
  $el: HTMLElement;
  $refs: Record<string, HTMLElement | undefined>;
  $watch(property: string, callback: (value: unknown) => void): void;
  $nextTick(callback: () => void): void;
}

/** Dispatches a bubbling custom event, as the vocabulary names Livewire and Alpine events. */
function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

// ---------------------------------------------------------------------------
// Signature

export interface SignatureOptions {
  /** Initial or entangled value: a PNG data URL, or `''`. */
  value?: string | null;
  mode?: SignatureMode;
  modes?: SignatureMode[];
  disabled?: boolean;
  translations?: Partial<SignatureTranslations>;
}

/**
 * `apuiSignature`: the pad (`x-ref="ink"`, a canvas), the typed name
 * (`x-ref="typed"`) and the upload input drive one `value`. Switching modes
 * starts over.
 */
export function signatureComponent(options: SignatureOptions = {}) {
  let pad: SignaturePad | undefined;
  let emitted: string | null = null;
  const modes = signatureModes(options.modes);
  const t = signatureTranslations(options.translations);

  return {
    value: options.value ?? '',
    mode: initialSignatureMode(options.mode, modes),
    typed: '',
    empty: !options.value,
    canUndo: false,
    announcement: '',

    init(this: Magics & SignatureState) {
      const canvas = this.$refs.ink as HTMLCanvasElement | undefined;
      if (canvas) {
        pad = new SignaturePad(canvas, {
          onChange: (value) => this.commit(value),
        });
        pad.setDisabled(Boolean(options.disabled));
        if (this.value) void pad.load(String(this.value));
      }
      this.$watch('value', (value) => {
        const next = typeof value === 'string' ? value : '';
        if (next === emitted) return;
        emitted = null;
        this.typed = '';
        this.empty = next === '';
        this.canUndo = false;
        if (pad) void pad.load(next);
      });
    },

    destroy() {
      pad?.destroy();
      pad = undefined;
    },

    commit(this: Magics & SignatureState, value: string) {
      emitted = value;
      this.value = value;
      this.empty = value === '';
      this.canUndo = pad?.canUndo() ?? false;
      dispatch(this.$el, 'value-change', { value });
    },

    setMode(this: Magics & SignatureState, mode: SignatureMode) {
      if (mode === this.mode || !modes.includes(mode) || options.disabled) return;
      this.mode = mode;
      this.typed = '';
      pad?.clear(true);
      if (this.value !== '') this.commit('');
      this.$nextTick(() => {
        pad?.resize();
        if (mode === 'type') this.$refs.typed?.focus();
      });
    },

    type(this: Magics & SignatureState) {
      const input = this.$refs.typed;
      const style = input ? getComputedStyle(input) : null;
      this.commit(
        renderTypedSignature(this.typed, {
          font: style?.font || '40px cursive',
          color: style?.color || '#000',
        }),
      );
    },

    async upload(this: Magics & SignatureState, event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      input.value = '';
      if (!file || !pad) return;
      try {
        pad.setImage(await readSignatureImage(file));
      } catch {
        // Not an image: nothing changes.
      }
    },

    undo(this: Magics & SignatureState) {
      pad?.undo();
    },

    clear(this: Magics & SignatureState) {
      this.typed = '';
      pad?.clear(true);
      if (this.value !== '') this.commit('');
      this.announcement = '';
      this.$nextTick(() => {
        this.announcement = t.cleared;
      });
    },
  };
}

/** The `apuiSignature` state and methods its methods call through `this`. */
interface SignatureState {
  value: string;
  mode: SignatureMode;
  typed: string;
  empty: boolean;
  canUndo: boolean;
  announcement: string;
  commit(value: string): void;
}

// ---------------------------------------------------------------------------
// RichTextEditor

/** The parts of TinyMCE's editor API the component uses. */
interface TinyEditor {
  on(events: string, callback: () => void): void;
  execCommand(command: string, ui?: boolean, value?: unknown): boolean;
  queryCommandState(command: string): boolean;
  formatter: { match(name: string): boolean };
  selection: { getNode(): Element };
  dom: { getParent(node: Element, selector: string): Element | null };
  getContent(): string;
  setContent(html: string): void;
  remove(): void;
}

interface TinyMce {
  init(config: Record<string, unknown>): Promise<TinyEditor[]>;
}

export interface RichTextEditorOptions {
  /** Initial or entangled value, in the output format. */
  value?: string | null;
  output?: RichTextOutput;
  /** `tinymce` runs TinyMCE when the page has loaded it, else the built-in engine (`native`). */
  engine?: 'tinymce' | 'native';
  maxLength?: number | null;
  disabled?: boolean;
  readonly?: boolean;
  translations?: Partial<RichTextTranslations>;
  /** Extra TinyMCE settings. */
  config?: Record<string, unknown>;
  /** Where TinyMCE posts image uploads; the response is `{ location }`. */
  uploadUrl?: string | null;
  /** Sent with each upload. */
  uploadFields?: Record<string, string>;
}

const TINYMCE_COMMANDS: Record<RichTextCommand, [string, unknown?]> = {
  bold: ['Bold'],
  italic: ['Italic'],
  underline: ['Underline'],
  strike: ['Strikethrough'],
  heading2: ['mceToggleFormat', 'h2'],
  heading3: ['mceToggleFormat', 'h3'],
  bulletList: ['InsertUnorderedList'],
  orderedList: ['InsertOrderedList'],
  quote: ['mceBlockQuote'],
  code: ['mceToggleFormat', 'code'],
  link: ['mceLink'],
  image: ['mceImage'],
  undo: ['Undo'],
  redo: ['Redo'],
};

const TINYMCE_FORMATS: Partial<Record<RichTextCommand, string>> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strikethrough',
  heading2: 'h2',
  heading3: 'h3',
  quote: 'blockquote',
  code: 'code',
};

function csrfToken(): string {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
  const config = (window as unknown as { livewireScriptConfig?: { csrf?: string } })
    .livewireScriptConfig;
  return meta?.content ?? config?.csrf ?? '';
}

/**
 * `apuiRichTextEditor`: the toolbar's buttons (`data-command`) run commands
 * on the content (`x-ref="content"`) through the built-in contentEditable
 * engine, or through TinyMCE when it's loaded and `engine` is `tinymce`.
 */
export function richTextEditorComponent(options: RichTextEditorOptions = {}) {
  const output = options.output ?? 'html';
  const t = richTextTranslations(options.translations);
  let surface: RichTextSurface | undefined;
  let tiny: TinyEditor | undefined;
  let emitted: string | null = null;
  let removeLimit: (() => void) | undefined;

  return {
    value: options.value ?? '',
    active: {} as Partial<Record<RichTextCommand, boolean>>,
    count: '',
    empty: !options.value,
    engine: 'native' as 'native' | 'tinymce',

    init(this: Magics & RichTextState) {
      const content = this.$refs.content;
      const toolbar = this.$refs.toolbar;
      if (toolbar) syncRovingTabIndex(toolbar, '[data-part="button"]');
      if (!content) return;
      const tinymce = (window as unknown as { tinymce?: TinyMce }).tinymce;
      this.updateCount(content.textContent ?? '');
      if (options.engine !== 'native' && tinymce && !options.disabled) {
        this.engine = 'tinymce';
        this.startTinyMce(tinymce, content);
      } else {
        this.startNative(content);
        if (!content.innerHTML.trim() && this.value) {
          surface?.setHtml(richTextToHtml(String(this.value), output));
          this.updateCount(content.textContent ?? '');
        }
      }
      this.$watch('value', (value) => {
        const next = typeof value === 'string' ? value : '';
        if (next === emitted) return;
        emitted = null;
        const html = richTextToHtml(next, output);
        if (tiny) tiny.setContent(html);
        else surface?.setHtml(html);
        this.updateCount(this.$refs.content?.textContent ?? '');
      });
    },

    destroy() {
      surface?.destroy();
      surface = undefined;
      removeLimit?.();
      removeLimit = undefined;
      tiny?.remove();
      tiny = undefined;
    },

    /** The built-in engine, with the link shortcut, the edit guard and maxLength. */
    startNative(this: Magics & RichTextState, content: HTMLElement) {
      surface = new RichTextSurface(content, {
        onChange: (html) => this.commit(html),
        onSelectionChange: () => this.refresh(),
        onLinkShortcut: () => this.run('link'),
        canEdit: () => !options.disabled && !options.readonly,
        maxLength: () => options.maxLength,
      });
    },

    startTinyMce(this: Magics & RichTextState, tinymce: TinyMce, content: HTMLElement) {
      const uploadUrl = options.uploadUrl;
      // TinyMCE edits the same element inline, so the same maxLength guard applies.
      const limit = (event: Event) => this.limit(event as InputEvent);
      content.addEventListener('beforeinput', limit);
      removeLimit = () => content.removeEventListener('beforeinput', limit);
      void tinymce
        .init({
          target: content,
          inline: true,
          menubar: false,
          toolbar: false,
          statusbar: false,
          branding: false,
          promotion: false,
          license_key: 'gpl',
          plugins: 'lists link image autolink',
          relative_urls: false,
          readonly: Boolean(options.readonly),
          automatic_uploads: Boolean(uploadUrl),
          images_upload_handler: uploadUrl
            ? (blob: { blob(): Blob; filename(): string }) => {
                const body = new FormData();
                body.append('file', blob.blob(), blob.filename());
                for (const [key, value] of Object.entries(options.uploadFields ?? {})) {
                  body.append(key, value);
                }
                return fetch(uploadUrl, {
                  method: 'POST',
                  body,
                  credentials: 'same-origin',
                  headers: { 'X-CSRF-TOKEN': csrfToken(), Accept: 'application/json' },
                })
                  .then((response) => response.json())
                  .then((json: { location?: string }) => {
                    const location = safeImageUrl(json.location);
                    if (!location) throw new Error('[apui] the upload returned no location');
                    return location;
                  });
              }
            : undefined,
          ...(options.config ?? {}),
          setup: (editor: TinyEditor) => {
            tiny = editor;
            editor.on('NodeChange', () => this.refresh());
            editor.on('input change undo redo SetContent ExecCommand', () => {
              this.commit(editor.getContent());
            });
          },
        })
        .catch(() => {
          // TinyMCE failed: keep the built-in engine instead.
          tiny = undefined;
          this.engine = 'native';
          removeLimit?.();
          removeLimit = undefined;
          this.startNative(content);
        });
    },

    commit(this: Magics & RichTextState, html: string) {
      const value = richTextFromHtml(html, output);
      this.updateCount(this.$refs.content?.textContent ?? '');
      if (value === this.value) return;
      emitted = value;
      this.value = value;
      dispatch(this.$el, 'value-change', { value });
    },

    updateCount(this: Magics & RichTextState, text: string) {
      this.count = countLabel(text, t, options.maxLength);
      this.empty = text.trim() === '' && !this.$refs.content?.querySelector('img');
    },

    limit(event: InputEvent) {
      const max = options.maxLength;
      if (!max || !event.inputType.startsWith('insert')) return;
      const target = event.currentTarget as HTMLElement;
      const selected = target.ownerDocument.getSelection()?.toString().length ?? 0;
      const adding =
        Array.from(event.data ?? event.dataTransfer?.getData('text/plain') ?? '').length || 1;
      if (Array.from(target.textContent ?? '').length - selected + adding > max) {
        event.preventDefault();
      }
    },

    refresh(this: RichTextState) {
      const next: Partial<Record<RichTextCommand, boolean>> = {};
      if (tiny) {
        const editor = tiny;
        for (const [command, format] of Object.entries(TINYMCE_FORMATS)) {
          next[command as RichTextCommand] = editor.formatter.match(format!);
        }
        next.bulletList = editor.queryCommandState('InsertUnorderedList');
        next.orderedList = editor.queryCommandState('InsertOrderedList');
        next.link = editor.dom.getParent(editor.selection.getNode(), 'a') !== null;
      } else if (surface) {
        for (const command of surface.active()) next[command] = true;
      }
      this.active = next;
    },

    run(this: Magics & RichTextState, command: RichTextCommand) {
      if (options.disabled || options.readonly) return;
      if (tiny) {
        const [name, value] = TINYMCE_COMMANDS[command];
        tiny.execCommand(name, false, value);
        this.refresh();
        return;
      }
      if (!surface) return;
      if (command === 'link') {
        const url = this.active.link ? '' : window.prompt(t.linkPrompt, 'https://');
        if (url === null) return;
        surface.run('link', safeLinkUrl(url) ?? '');
        return;
      }
      if (command === 'image') {
        const src = safeImageUrl(window.prompt(t.imagePrompt, 'https://'));
        if (!src) return;
        surface.run('image', { src, alt: window.prompt(t.imageAltPrompt, '') ?? '' });
        return;
      }
      surface.run(command);
    },

    toolbarKeydown(this: Magics & RichTextState, event: KeyboardEvent) {
      const toolbar = this.$refs.toolbar;
      if (toolbar) rovingKeydown(event, toolbar, '[data-part="button"]');
    },
  };
}

/** The `apuiRichTextEditor` state and methods its methods call through `this`. */
interface RichTextState {
  value: string;
  active: Partial<Record<RichTextCommand, boolean>>;
  count: string;
  empty: boolean;
  engine: 'native' | 'tinymce';
  commit(html: string): void;
  refresh(): void;
  updateCount(text: string): void;
  limit(event: InputEvent): void;
  run(command: RichTextCommand): void;
  startTinyMce(tinymce: TinyMce, content: HTMLElement): void;
  startNative(content: HTMLElement): void;
}

// ---------------------------------------------------------------------------
// CodeEditor

export interface CodeEditorOptions {
  tabSize?: number;
  rows?: number;
  tab?: string | null;
  translations?: Partial<CodeEditorTranslations>;
}

/**
 * `apuiCodeEditor`: the textarea (`x-ref="control"`) is the native control.
 * The component indents with Tab, keeps the gutter's line numbers and the
 * active line in step, shows the caret position, and runs the file tabs
 * (`x-ref="tabs"`) as a tablist. `tab` is plain state; the Blade view
 * dispatches `tab-change` when it changes.
 */
export function codeEditorComponent(options: CodeEditorOptions = {}) {
  const t = codeEditorTranslations(options.translations);
  const tabSize = options.tabSize ?? 2;
  const rows = options.rows ?? 12;

  return {
    tab: options.tab ?? null,
    position: positionLabel('', 0, t),

    init(this: Magics & CodeEditorState) {
      const tabs = this.$refs.tabs;
      if (tabs)
        syncRovingTabIndex(tabs, '[data-part="tab"]', tabs.querySelector('[aria-selected="true"]'));
      this.sync();
    },

    sync(this: Magics & CodeEditorState) {
      const control = this.$refs.control as HTMLTextAreaElement | undefined;
      const gutter = this.$refs.gutter;
      if (!control) return;
      const offset = control.selectionStart ?? 0;
      this.position = positionLabel(control.value, offset, t);
      if (!gutter) return;
      const count = gutterLines(control.value, rows);
      const lines: HTMLElement[] = Array.from(
        gutter.querySelectorAll<HTMLElement>('[data-part="line"]'),
      );
      for (let n = lines.length; n < count; n++) {
        const line = (lines[0]?.cloneNode(false) as HTMLElement) ?? document.createElement('span');
        line.removeAttribute('id');
        line.removeAttribute('data-severity');
        line.setAttribute('data-scope', 'code-editor');
        line.setAttribute('data-part', 'line');
        line.textContent = String(n + 1);
        gutter.append(line);
        lines.push(line);
      }
      lines.slice(count).forEach((line) => line.remove());
      const active = control.value.slice(0, offset).split('\n').length;
      lines.slice(0, count).forEach((line, i) => {
        if (i + 1 === active) line.setAttribute('data-active', '');
        else line.removeAttribute('data-active');
      });
      control.rows = count;
    },

    keydown(this: Magics & CodeEditorState, event: KeyboardEvent) {
      const control = this.$refs.control as HTMLTextAreaElement | undefined;
      if (control && codeEditorKeydown(event, control, tabSize)) this.sync();
    },

    selectTab(this: Magics & CodeEditorState, value: string) {
      if (this.tab === value) return;
      this.tab = value;
      const tabs = this.$refs.tabs;
      if (tabs) {
        syncRovingTabIndex(
          tabs,
          '[data-part="tab"]',
          tabs.querySelector(`[data-value="${CSS.escape(value)}"]`),
        );
      }
    },

    tabsKeydown(this: Magics & CodeEditorState, event: KeyboardEvent) {
      const tabs = this.$refs.tabs;
      if (!tabs) return;
      const focused = rovingKeydown(event, tabs, '[data-part="tab"]');
      const value = focused?.getAttribute('data-value');
      if (value) this.selectTab(value);
    },
  };
}

/** The `apuiCodeEditor` state and methods its methods call through `this`. */
interface CodeEditorState {
  tab: string | null;
  position: string;
  sync(): void;
  selectTab(value: string): void;
}
