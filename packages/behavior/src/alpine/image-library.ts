/**
 * The `apuiImageLibrary` Alpine component (#61): ImageLibrary's client state,
 * Livewire only (D-003). It isn't a Zag machine: the grid is a listbox with a
 * roving tabindex, so it lives here with the form helpers (D-028).
 *
 *   <div x-data="apuiImageLibrary({ multiple: true, model: 'files', library: 'library' })">
 *     <input x-model="query" aria-label="Search files">
 *     <div x-apui-grid role="listbox" aria-multiselectable="true" aria-label="Media" x-on:keydown="keydown($event)">
 *       <div id="lib-asset-1" role="option" data-id="1" data-key="0" data-name="lobby.jpg" data-src="lobby.jpg"
 *            x-bind="option('1', 'lobby.jpg')">…</div>
 *     </div>
 *     <aside x-bind:hidden="! active"><img x-bind:src="field('src')" x-bind:alt="field('alt')"></aside>
 *   </div>
 *
 * The server renders the options, with their data in `data-*` attributes, so
 * a Livewire morph (an upload, a removal) updates them in place; the
 * component re-reads them after every change. Selection is a list of ids and
 * dispatches `selection-change`; Insert dispatches `insert`. With `model` and
 * `library` it drives the WithMediaSync trait: uploads through the file
 * inputs, `removeMedia()`, `refreshMediaSources()`, `refreshMediaOrder()`
 * (with SortableJS on the page) and crop (with Cropper.js on the page), and
 * alt text edits set `<library>.<key>.alt`.
 *
 * Keys: the arrows move through the options (ArrowLeft and ArrowRight follow
 * the text direction; Up and Down move a row in the grid), Home and End,
 * Space selects, Ctrl/Cmd+A selects every option shown, Escape clears.
 */
import { directionOf } from '../positioning';

interface Wire {
  set(name: string, value: unknown): Promise<unknown> | void;
  upload(
    name: string,
    file: Blob,
    finish: () => void,
    error: () => void,
    progress: (event: { detail: { progress: number } }) => void,
  ): void;
  [method: string]: unknown;
}

interface Magics {
  $el: HTMLElement;
  $root: HTMLElement;
  $wire?: Wire;
  $watch(property: string, callback: (value: unknown) => void): void;
  $nextTick(callback: () => void): void;
  $dispatch(name: string, detail?: unknown): void;
  $refs: Record<string, HTMLElement | undefined>;
}

export interface ImageLibraryAlpineOptions {
  /** `grid` or `list`. */
  view?: 'grid' | 'list';
  /** Many assets can be selected. Default true. */
  multiple?: boolean;
  /** The uploads property (`wire:model`), for WithMediaSync. */
  model?: string | null;
  /** The library collection (`wire:library`), for WithMediaSync. */
  library?: string | null;
  /** Cropper.js options for the crop dialog. */
  crop?: Record<string, unknown>;
  /** Translated strings: `selected` and `selectedOne` with `{count}`, and `confirmRemove`. */
  texts?: { selected?: string; selectedOne?: string; confirmRemove?: string };
}

interface State {
  view: 'grid' | 'list';
  query: string;
  selected: string[];
  active: string | null;
  focused: string | null;
  revision: number;
  progress: number;
  busy: boolean;
  dragging: boolean;
  cropping: string | null;
}

/** The component's methods, as `this` sees them. */
interface Methods {
  readonly shown: number;
  readonly countText: string;
  readonly allSelected: boolean;
  readonly someSelected: boolean;
  readonly canCrop: boolean;
  options(visibleOnly?: boolean): HTMLElement[];
  matches(name: string): boolean;
  isSelected(id: string): boolean;
  isTabStop(id: string): boolean;
  field(name: string): string;
  setSelection(ids: string[]): void;
  toggle(id: string): void;
  toggleAll(): void;
  clear(): void;
  focusOption(id: string | undefined): void;
  keydown(event: KeyboardEvent): void;
  call(method: string, ...args: unknown[]): Promise<unknown>;
  remove(): void;
  insert(): void;
  replace(): void;
  saveAlt(value: string): void;
  uploading(progress: number): void;
  uploaded(): void;
  cropCancel(): void;
}

type Self = State & Magics & Methods;

/** Folds case and accents, so "Facade" finds "façade". */
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Whether a dragged item carries files. */
const hasFiles = (event: DragEvent) =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files');

/** Whether a file matches an `accept` list (`image/*`, `image/png`, `.pdf`). */
export function acceptsFile(file: { name: string; type: string }, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** The `apuiImageLibrary` Alpine component. */
export function imageLibraryComponent(options: ImageLibraryAlpineOptions = {}) {
  const multiple = options.multiple ?? true;
  const texts = options.texts ?? {};
  let observer: MutationObserver | undefined;
  let sortable: { destroy(): void } | undefined;
  let cropper: { destroy(): void; getCroppedCanvas(): HTMLCanvasElement } | undefined;
  let dragDepth = 0;

  return {
    view: options.view ?? 'grid',
    query: '',
    selected: [] as string[],
    active: null as string | null,
    focused: null as string | null,
    revision: 0,
    progress: 0,
    busy: false,
    dragging: false,
    cropping: null as string | null,

    init(this: Self) {
      const grid = this.$refs.grid;
      // Re-read the options after a morph changes them (uploads, removals).
      if (grid && typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(() => {
          this.revision++;
          const ids = this.options().map((el) => el.dataset.id ?? '');
          const kept = this.selected.filter((id) => ids.includes(id));
          if (kept.length !== this.selected.length) this.setSelection(kept);
          if (this.active && !ids.includes(this.active)) this.active = null;
        });
        observer.observe(grid, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['data-id', 'data-alt', 'data-src', 'data-name'],
        });
      }
      const Sortable = (
        window as unknown as {
          Sortable?: new (el: Element, o: object) => { destroy(): void; toArray(): string[] };
        }
      ).Sortable;
      if (grid && Sortable && options.library && this.$wire) {
        const instance = new Sortable(grid, {
          animation: 150,
          dataIdAttr: 'data-id',
          draggable: '[role="option"]',
          onEnd: () => this.call('refreshMediaOrder', instance.toArray(), options.library),
        });
        sortable = instance;
      }
    },

    destroy() {
      observer?.disconnect();
      sortable?.destroy();
      cropper?.destroy();
      observer = undefined;
      sortable = undefined;
      cropper = undefined;
    },

    /** The option elements, in order (all, or only those the search shows). */
    options(this: Self, visibleOnly = false): HTMLElement[] {
      void this.revision;
      const all = Array.from(
        this.$refs.grid?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
      );
      return visibleOnly ? all.filter((el) => this.matches(el.dataset.name ?? '')) : all;
    },

    /** Whether the search shows an asset by name. */
    matches(this: State, name: string): boolean {
      const query = fold(this.query.trim());
      return query === '' || fold(name).includes(query);
    },

    /** How many assets the search shows. */
    get shown(): number {
      return (this as unknown as Self).options(true).length;
    },

    isSelected(this: State, id: string): boolean {
      return this.selected.includes(id);
    },

    /** The option in the Tab order: the focused one, else the first shown. */
    isTabStop(this: Self, id: string): boolean {
      const shown = this.options(true).map((el) => el.dataset.id);
      const current = this.focused && shown.includes(this.focused) ? this.focused : shown[0];
      return current === id;
    },

    /** "2 selected", from the translated strings. */
    get countText(): string {
      const self = this as unknown as State;
      const count = self.selected.length;
      const template = (count === 1 ? texts.selectedOne : texts.selected) ?? '{count} selected';
      return template.replace(/\{count\}/g, String(count));
    },

    get allSelected(): boolean {
      const self = this as unknown as Self;
      const shown = self.options(true);
      return shown.length > 0 && shown.every((el) => self.selected.includes(el.dataset.id ?? ''));
    },

    get someSelected(): boolean {
      const self = this as unknown as Self;
      return self.selected.length > 0 && !self.allSelected;
    },

    /** A field of the active asset, from its option's `data-*`. */
    field(this: Self, name: string): string {
      void this.revision;
      if (!this.active) return '';
      const el = this.options().find((option) => option.dataset.id === this.active);
      return el?.dataset[name] ?? '';
    },

    setSelection(this: Self, ids: string[]) {
      this.selected = ids;
      this.$dispatch('selection-change', { value: [...ids] });
    },

    /** Selects or deselects an asset, and makes it the active one. */
    toggle(this: Self, id: string) {
      this.focused = id;
      if (multiple) {
        this.setSelection(
          this.selected.includes(id)
            ? this.selected.filter((value) => value !== id)
            : [...this.selected, id],
        );
      } else {
        this.setSelection(this.selected.includes(id) ? [] : [id]);
      }
      this.active = this.selected.includes(id) ? id : (this.selected.at(-1) ?? null);
    },

    /** Selects every asset shown, or clears them when all are. */
    toggleAll(this: Self) {
      if (!multiple) return;
      const shown = this.options(true).map((el) => el.dataset.id ?? '');
      this.setSelection(this.allSelected ? [] : [...new Set([...this.selected, ...shown])]);
    },

    clear(this: Self) {
      if (this.selected.length) this.setSelection([]);
    },

    focusOption(this: Self, id: string | undefined) {
      if (!id) return;
      this.focused = id;
      this.$nextTick(() =>
        this.options()
          .find((el) => el.dataset.id === id)
          ?.focus(),
      );
    },

    /** The listbox's keys. */
    keydown(this: Self, event: KeyboardEvent) {
      const shown = this.options(true);
      if (!shown.length) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>('[role="option"]');
      const index = Math.max(
        0,
        shown.findIndex((el) => el === target),
      );
      const id = (i: number) => shown[Math.min(Math.max(i, 0), shown.length - 1)]?.dataset.id;
      // A row in the grid: the options that share the first one's top.
      const top = shown[0]!.offsetTop;
      const columns =
        this.view === 'list' ? 1 : Math.max(1, shown.filter((el) => el.offsetTop === top).length);
      const rtl = directionOf(event.currentTarget as Element) === 'rtl';
      const mod = event.ctrlKey || event.metaKey;
      switch (event.key) {
        case 'ArrowRight':
          this.focusOption(id(index + (rtl ? -1 : 1)));
          break;
        case 'ArrowLeft':
          this.focusOption(id(index + (rtl ? 1 : -1)));
          break;
        case 'ArrowDown':
          this.focusOption(id(index + columns));
          break;
        case 'ArrowUp':
          this.focusOption(id(index - columns));
          break;
        case 'Home':
          this.focusOption(id(0));
          break;
        case 'End':
          this.focusOption(id(shown.length - 1));
          break;
        case ' ':
        case 'Enter':
          if (target?.dataset.id) this.toggle(target.dataset.id);
          break;
        case 'Escape':
          if (!this.selected.length) return;
          this.clear();
          break;
        case 'a':
        case 'A':
          if (!mod || !multiple) return;
          this.setSelection([
            ...new Set([...this.selected, ...shown.map((el) => el.dataset.id ?? '')]),
          ]);
          break;
        default:
          return;
      }
      event.preventDefault();
    },

    /** Calls a WithMediaSync method on the Livewire component, when there is one. */
    call(this: Self, method: string, ...args: unknown[]): Promise<unknown> {
      const fn = this.$wire?.[method];
      if (typeof fn !== 'function') return Promise.resolve();
      return Promise.resolve((fn as (...a: unknown[]) => unknown).apply(this.$wire, args));
    },

    /** Removes the selected assets (or the active one), after confirmation. */
    remove(this: Self) {
      const ids = this.selected.length ? [...this.selected] : this.active ? [this.active] : [];
      if (!ids.length || !options.model || !options.library) return;
      if (!window.confirm(texts.confirmRemove ?? 'Remove the selected files?')) return;
      const options_ = this.options();
      this.busy = true;
      const calls = ids.map((id) => {
        const el = options_.find((option) => option.dataset.id === id);
        return this.call('removeMedia', id, options.model, options.library, el?.dataset.src ?? '');
      });
      void Promise.all(calls).finally(() => {
        this.busy = false;
        this.setSelection([]);
        this.active = null;
      });
    },

    /** Inserts the selection (or the active asset): dispatches `insert`. */
    insert(this: Self) {
      const ids = this.selected.length ? [...this.selected] : this.active ? [this.active] : [];
      if (ids.length) this.$dispatch('insert', { value: ids });
    },

    /** Opens the file picker that replaces the active asset. */
    replace(this: Self) {
      const key = this.field('key');
      document.getElementById(`${this.$root.id}-file-${key}`)?.click();
    },

    /** Saves the active asset's alt text to `<library>.<key>.alt`. */
    saveAlt(this: Self, value: string) {
      const key = this.field('key');
      if (!options.library || key === '' || !this.$wire) return;
      void this.$wire.set(`${options.library}.${key}.alt`, value);
    },

    /** Upload progress from Livewire's upload events. */
    uploading(this: Self, progress: number) {
      this.progress = progress;
    },

    uploaded(this: Self) {
      this.progress = 0;
      if (!options.model || !options.library) return;
      this.busy = true;
      void this.call('refreshMediaSources', options.model, options.library).finally(
        () => (this.busy = false),
      );
    },

    dragEnter(this: Self, event: DragEvent) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth++;
      this.dragging = true;
    },

    dragLeave(this: Self, event: DragEvent) {
      if (!hasFiles(event)) return;
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) this.dragging = false;
    },

    /** Hands dropped files that `accept` allows to the upload input. */
    drop(this: Self, event: DragEvent) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      dragDepth = 0;
      this.dragging = false;
      const input = this.$refs.files as HTMLInputElement | undefined;
      if (!input || this.busy) return;
      const accept = input.getAttribute('accept') ?? '';
      const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
        acceptsFile(file, accept),
      );
      if (!files.length) return;
      const transfer = new DataTransfer();
      files.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },

    /** Whether Cropper.js is on the page, so Crop can show. */
    get canCrop(): boolean {
      const self = this as unknown as Self;
      return (
        Boolean(options.model && (window as unknown as { Cropper?: unknown }).Cropper) &&
        self.field('image') === 'true'
      );
    },

    /** Opens the crop dialog on the active asset. */
    crop(this: Self) {
      const Cropper = (
        window as unknown as { Cropper?: new (img: HTMLImageElement, o: object) => typeof cropper }
      ).Cropper;
      const image = document.getElementById(
        `${this.$root.id}-crop-image`,
      ) as HTMLImageElement | null;
      if (!Cropper || !image || !this.active) return;
      this.cropping = this.field('key');
      image.src = this.field('src');
      cropper?.destroy();
      cropper = new Cropper(image, options.crop ?? {});
    },

    cropCancel(this: Self) {
      cropper?.destroy();
      cropper = undefined;
      this.cropping = null;
    },

    /** Uploads the cropped image over the asset, then refreshes the library. */
    cropSave(this: Self) {
      const key = this.cropping;
      const current = cropper;
      if (key === null || !current || !options.model || !this.$wire) return this.cropCancel();
      this.progress = 1;
      current.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return;
        this.$wire!.upload(
          `${options.model}.${key}`,
          blob,
          () => this.uploaded(),
          () => (this.progress = 0),
          (event) => (this.progress = event.detail.progress),
        );
      });
      this.cropCancel();
    },
  };
}
