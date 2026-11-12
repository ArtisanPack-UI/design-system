/**
 * The `apuiLightbox` and `apuiCarousel` Alpine components (#61): ImageGallery's
 * lightbox and ImageSlider's carousel.
 *
 *   <div id="photos" x-data="apuiLightbox({ count: 2, images: [...] })">
 *     <button id="photos-trigger-0" x-apui:trigger="{ index: 0 }"><img src="a.jpg" alt="Lobby"></button>
 *     <button id="photos-trigger-1" x-apui:trigger="{ index: 1 }"><img src="b.jpg" alt="Roof"></button>
 *     <template x-teleport="body">
 *       <div>
 *         <div id="photos-backdrop" x-apui:backdrop></div>
 *         <div id="photos-positioner" x-apui:positioner>
 *           <div id="photos-content" x-apui:content class="apui-lightbox">
 *             <h2 id="photos-title" x-apui:title x-text="title"></h2>
 *             <button id="photos-close" x-apui:close-trigger aria-label="Close">×</button>
 *             <img id="photos-image" x-apui:image>
 *             <button id="photos-prev" x-apui:prev-trigger aria-label="Previous photo">‹</button>
 *             <button id="photos-next" x-apui:next-trigger aria-label="Next photo">›</button>
 *           </div>
 *         </div>
 *       </div>
 *     </template>
 *   </div>
 *
 * `open` and `index` are plain Alpine state, so `$wire.entangle()` binds
 * them. The dialog's parts are Zag's (backdrop, positioner, content, title,
 * description, close-trigger); the lightbox adds `trigger` (one per grid
 * item, `{ index }`), `image` (the stage image), `prev-trigger`,
 * `next-trigger`, `download` and `thumb` (`{ index }`). Arrow keys in the
 * panel follow the text direction; Home and End show the first and last.
 *
 *   <div id="tour" x-data="apuiCarousel({ scope: 'image-slider', slideCount: 3 })" x-apui:root>
 *     <div id="tour-group" x-apui:item-group>
 *       <div id="tour-item-0" x-apui:item="{ index: 0 }"><img src="a.jpg" alt="Lobby"></div>
 *       …
 *     </div>
 *     <button id="tour-prev" x-apui:prev-trigger>‹</button>
 *     <button id="tour-next" x-apui:next-trigger>›</button>
 *     <span id="tour-progress" x-apui:progress-text x-text="progressText"></span>
 *     <div id="tour-indicators" x-apui:indicator-group>
 *       <button id="tour-indicator-0" x-apui:indicator="{ index: 0 }"></button>
 *       …
 *     </div>
 *   </div>
 *
 * `index` is plain state too; a move the carousel makes dispatches
 * `index-change`. Slides and indicators are named per index, so their
 * authored ids are kept per index (rule 1 of the Livewire rules).
 */
import { mergeProps } from '@zag-js/vanilla';

import type { Attrs } from '../core/props';
import { createWidget, type Widget } from '../core/widget';
import { directionOf } from '../positioning';
import {
  type CarouselApi,
  carouselDefinition,
  type CarouselLabels,
  type CarouselProps,
  CAROUSEL_LABELS,
  CAROUSEL_SCOPE,
  carouselTranslations,
  formatCarouselLabel,
} from '../widgets/carousel';
import {
  clampIndex,
  IMAGE_GALLERY_SCOPE,
  type LightboxApi,
  lightboxCounter,
  lightboxDefinition,
  lightboxKey,
  type LightboxLabels,
  lightboxLabels,
  type LightboxProps,
  lightboxStep,
  type LightboxMove,
} from '../widgets/lightbox';

type PartArgs = Record<string, unknown> | undefined;

interface Magics {
  $el: HTMLElement;
  $id(name: string): string;
  $watch(property: string, callback: (value: unknown) => void): void;
}

/** `close-trigger` → `closeTrigger`. */
/** Schemes an image `src` may use; `data:` only for `data:image/…`. */
const MEDIA_SCHEMES = new Set(['http', 'https', 'blob']);

/**
 * The `src` when it's relative or uses an allowed scheme, otherwise `''`, so a
 * `javascript:` URL in `images` never reaches the stage or the download link.
 */
export function safeMediaSrc(src: unknown): string {
  if (typeof src !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  const compact = src.replace(/[\u0000-\u0020\u007f]/g, '').toLowerCase();
  const scheme = /^([a-z][a-z0-9+.-]*):/.exec(compact)?.[1];
  if (scheme === undefined || MEDIA_SCHEMES.has(scheme)) return src;
  return scheme === 'data' && compact.startsWith('data:image/') ? src : '';
}

const camel = (part: string) => part.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
/** `close-trigger` → `CloseTrigger`. */
const pascal = (part: string) => camel(part).replace(/^./, (c) => c.toUpperCase());

/** Dispatches a bubbling custom event, as the vocabulary names Livewire and Alpine events. */
function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** The machine's props for a part, from `api.get<Part>Props(args)`. */
function machinePart(api: object, scope: string, part: string, args: PartArgs): Attrs {
  const getter = (api as Record<string, unknown>)[`get${pascal(part)}Props`];
  if (typeof getter !== 'function') throw new Error(`[apui] ${scope} has no part "${part}"`);
  return getter(args) as Attrs;
}

/**
 * The authors' ids on the single parts, collected before the machine starts
 * (it reads `ids` only then), including parts inside `x-teleport` templates.
 * Parts in `perIndex` are named per index and are left out.
 */
function authoredIds(root: Element, perIndex: string[]): Record<string, string> {
  const ids: Record<string, string> = {};
  const collect = (el: Element) => {
    if (!el.id) return;
    for (const { name } of Array.from(el.attributes)) {
      if (!name.startsWith('x-apui:')) continue;
      const part = name.slice('x-apui:'.length);
      if (!perIndex.includes(part)) ids[camel(part)] = el.id;
    }
  };
  const visit = (scope: ParentNode) => {
    for (const el of Array.from(scope.querySelectorAll('*'))) {
      if (el instanceof HTMLTemplateElement) {
        if (el.hasAttribute('x-teleport')) visit(el.content);
        continue;
      }
      collect(el);
    }
  };
  collect(root);
  visit(root);
  return ids;
}

const indexOf = (args: PartArgs) => clampIndex(args?.index, Number.MAX_SAFE_INTEGER);

// ---------------------------------------------------------------------------
// Lightbox

/** One image the lightbox can show. */
export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface LightboxAlpineOptions {
  /** The images, in order: the stage, counter and download read them. */
  images?: LightboxImage[];
  /** Initial or entangled open state. */
  open?: boolean;
  /** Initial or entangled index: the image shown, 0-based. */
  index?: number;
  /** Traps focus, locks scroll and hides the page. Default true. */
  modal?: boolean;
  /** Built-in strings, for translation. */
  labels?: LightboxLabels;
  /** The `data-scope` its parts carry. Default `image-gallery`. */
  scope?: string;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

interface LightboxState {
  open: boolean;
  index: number;
}

/** The `apuiLightbox` Alpine component. `open` and `index` are plain state, so they can be entangled. */
export function lightboxComponent(options: LightboxAlpineOptions = {}) {
  let widget: Widget<LightboxProps, LightboxApi> | undefined;
  let root: HTMLElement | undefined;
  const images = (options.images ?? []).map((image) => ({
    ...image,
    src: safeMediaSrc(image.src),
  }));
  const count = images.length;
  const scope = options.scope ?? IMAGE_GALLERY_SCOPE;
  const labels = lightboxLabels(options.labels);

  return {
    open: options.open ?? false,
    // Raw, not clamped: a `$wire.entangle()` interceptor has to reach Alpine
    // intact. Every read clamps it.
    index: options.index ?? 0,

    /** The image shown. */
    get current(): LightboxImage | undefined {
      return images[clampIndex((this as LightboxState).index, count)];
    },

    /** The counter: `3 / 24`. */
    get counter(): string {
      return lightboxCounter(
        labels.counter,
        clampIndex((this as LightboxState).index, count),
        count,
      );
    },

    /** The bar's title: the counter, then the caption. */
    get title(): string {
      const self = this as unknown as { counter: string; current?: LightboxImage };
      const caption = self.current?.caption;
      return caption ? `${self.counter} · ${caption}` : self.counter;
    },

    init(this: Magics & LightboxState) {
      const el = this.$el;
      root = el;
      widget = createWidget(lightboxDefinition(scope), {
        id: options.id ?? this.$id('apui-lightbox'),
        ids: authoredIds(el, [
          'trigger',
          'thumb',
          'image',
          'prev-trigger',
          'next-trigger',
          'download',
        ]),
        open: Boolean(this.open),
        modal: options.modal ?? true,
        onOpenChange: ({ open }) => {
          if (this.open !== open) this.open = open;
          dispatch(el, 'open-change', { open });
        },
      });
      widget.start();
      this.$watch('open', (open: unknown) => widget?.setProps({ open: Boolean(open) }));
      // Parts that show the index (the stage image, thumbs, download) aren't
      // machine state: re-apply them when it changes.
      this.$watch('index', () => widget?.refresh());
    },

    destroy() {
      widget?.stop();
      widget = undefined;
      root = undefined;
    },

    /** Opens the lightbox on an image. */
    show(this: LightboxState & { go(index: number): void }, index: number) {
      this.go(clampIndex(index, count));
      this.open = true;
    },

    hide(this: LightboxState) {
      this.open = false;
    },

    /** Shows an image, dispatching `index-change` when it's another one. */
    go(this: LightboxState, index: number) {
      if (index === this.index) return;
      this.index = index;
      if (root) dispatch(root, 'index-change', { index });
    },

    move(this: LightboxState & { go(index: number): void }, move: LightboxMove) {
      this.go(lightboxStep(clampIndex(this.index, count), count, move));
    },

    previous(this: { move(move: LightboxMove): void }) {
      this.move('previous');
    },

    next(this: { move(move: LightboxMove): void }) {
      this.move('next');
    },

    apuiPart(
      this: LightboxState & {
        show(index: number): void;
        go(index: number): void;
        move(move: LightboxMove): void;
      },
      part: string,
      el: Element,
      args: () => PartArgs,
    ) {
      if (!widget) return () => {};
      const tag = (name: string, attrs: Attrs = {}): Attrs => ({
        'data-scope': scope,
        'data-part': name,
        ...attrs,
      });
      switch (part) {
        case 'trigger':
          return widget.bind(el, () =>
            tag('trigger', {
              type: 'button',
              'aria-haspopup': 'dialog',
              onclick: () => this.show(indexOf(args())),
            }),
          );
        case 'image':
          return widget.bind(el, () => {
            const image = images[clampIndex(this.index, count)];
            return tag('image', { src: image?.src, alt: image?.alt ?? '' });
          });
        case 'download':
          return widget.bind(el, () =>
            tag('download', {
              href: images[clampIndex(this.index, count)]?.src || undefined,
              download: '',
            }),
          );
        case 'prev-trigger':
        case 'next-trigger':
          return widget.bind(el, () =>
            tag(part, {
              type: 'button',
              disabled: count < 2 ? true : undefined,
              onclick: () => this.move(part === 'prev-trigger' ? 'previous' : 'next'),
            }),
          );
        case 'thumb':
          return widget.bind(el, () => {
            const index = indexOf(args());
            return tag('thumb', {
              type: 'button',
              'aria-current': index === clampIndex(this.index, count) ? 'true' : undefined,
              onclick: () => this.go(index),
            });
          });
        case 'content':
          return widget.bind(
            el,
            (api) =>
              mergeProps(api.getContentProps() as Attrs, {
                onkeydown: (event: KeyboardEvent) => {
                  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
                    return;
                  const move = lightboxKey(event.key, directionOf(el));
                  if (!move) return;
                  event.preventDefault();
                  this.move(move);
                },
              }) as Attrs,
          );
        default:
          return widget.bind(el, (api) => machinePart(api, scope, part, args()));
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Carousel

export interface CarouselAlpineOptions {
  /** How many slides there are. */
  slideCount: number;
  /** Initial or entangled index: the slide shown, 0-based. */
  index?: number;
  /** Wrap from the last slide to the first. Default false. */
  loop?: boolean;
  /** Advance on its own every `interval` ms, with a pause trigger. Default false. */
  autoplay?: boolean;
  /** Milliseconds between slides while autoplay runs. Default 5000. */
  interval?: number;
  /** Built-in strings, for translation. */
  labels?: CarouselLabels;
  /** The `data-scope` its parts carry. Default `carousel`. */
  scope?: string;
  /** Machine id. Defaults to an Alpine `$id`, unique on the page. */
  id?: string;
}

/** The `apuiCarousel` Alpine component. `index` is plain state, so it can be entangled with Livewire. */
export function carouselComponent(options: CarouselAlpineOptions) {
  let widget: Widget<CarouselProps, CarouselApi> | undefined;
  const scope = options.scope ?? CAROUSEL_SCOPE;
  const count = Math.max(0, options.slideCount ?? 0);
  const itemIds = new Map<number, string>();
  const indicatorIds = new Map<number, string>();
  const progress = { ...CAROUSEL_LABELS, ...(options.labels ?? {}) }.progress;

  return {
    // Raw, not clamped: a `$wire.entangle()` interceptor has to reach Alpine
    // intact. Every read clamps it.
    index: options.index ?? 0,
    /** Whether autoplay is running, for the autoplay trigger's icon. */
    playing: Boolean(options.autoplay),

    /** The progress text (the spec's counter): `2 / 12`. */
    get progressText(): string {
      return formatCarouselLabel(
        progress,
        clampIndex((this as { index: number }).index, count) + 1,
        count,
      );
    },

    init(this: Magics & { index: number; playing: boolean }) {
      const el = this.$el;
      const id = options.id ?? this.$id('apui-carousel');
      // Slides and indicators are named per index: keep their authored ids.
      for (const node of Array.from(el.querySelectorAll('[x-apui\\:item], [x-apui\\:indicator]'))) {
        const raw = node.getAttribute('x-apui:item') ?? node.getAttribute('x-apui:indicator') ?? '';
        const match = /index\s*:\s*(\d+)/.exec(raw);
        if (!match || !node.id) continue;
        (node.hasAttribute('x-apui:item') ? itemIds : indicatorIds).set(Number(match[1]), node.id);
      }
      widget = createWidget(carouselDefinition(scope), {
        id,
        ids: {
          ...authoredIds(el, ['item', 'indicator', 'thumb']),
          item: (index: number) => itemIds.get(index) ?? `carousel:${id}:item:${index}`,
          indicator: (index: number) =>
            indicatorIds.get(index) ?? `carousel:${id}:indicator:${index}`,
        },
        dir: directionOf(el),
        slideCount: count,
        slidesPerPage: 1,
        loop: options.loop ?? false,
        autoplay: options.autoplay ? { delay: options.interval ?? 5000 } : false,
        allowMouseDrag: false,
        page: clampIndex(this.index, count),
        translations: carouselTranslations(options.labels),
        onPageChange: ({ page }) => {
          if (this.index !== page) this.index = page;
          dispatch(el, 'index-change', { index: page });
        },
      });
      // The api's isPlaying is the trigger's state: a pause while the pointer
      // or focus is on the carousel isn't the user's, so it stays on.
      widget.subscribe((api) => {
        if (this.playing !== api.isPlaying) this.playing = api.isPlaying;
      });
      widget.start();
      this.$watch('index', (value: unknown) => {
        const page = clampIndex(value, count);
        if (widget && widget.api().page !== page) widget.setProps({ page });
      });
    },

    destroy() {
      widget?.stop();
      widget = undefined;
      itemIds.clear();
      indicatorIds.clear();
    },

    /** Shows a slide, as an indicator does. */
    go(this: { index: number }, index: number) {
      this.index = clampIndex(index, count);
    },

    apuiPart(this: { index: number }, part: string, el: Element, args: () => PartArgs) {
      if (!widget) return () => {};
      if (part === 'thumb') {
        return widget.bind(el, (api) => {
          const index = indexOf(args());
          return {
            'data-scope': scope,
            'data-part': 'thumb',
            type: 'button',
            'aria-current': index === api.page ? 'true' : undefined,
            onclick: () => api.scrollToIndex(index),
          };
        });
      }
      if (part === 'item' || part === 'indicator') {
        return widget.bind(el, (api) =>
          part === 'item'
            ? (api.getItemProps({ index: indexOf(args()) }) as Attrs)
            : (api.getIndicatorProps({ index: indexOf(args()) }) as Attrs),
        );
      }
      return widget.bind(el, (api) => machinePart(api, scope, part, args()));
    },
  };
}
