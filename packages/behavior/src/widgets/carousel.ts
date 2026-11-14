/**
 * Carousel (#61, ImageSlider) on Zag's carousel machine: a scroll-snapping
 * track of slides (`role=group`, `aria-roledescription=slide`) in a
 * `role=region` root, previous and next triggers, indicators whose arrow keys
 * follow the text direction (Zag maps ArrowLeft and ArrowRight through
 * `dir`), optional autoplay with a pause trigger, and a progress text.
 *
 * ImageSlider is the first component on it; Carousel (#65) is the second,
 * with `perView` slides per view (the next one peeks, in CSS). Each renames the machine's `carousel` scope to its own through
 * `rescope()`, so the parity gate finds the parts by the component's scope
 * (D-025). The parts keep Zag's names (D-019): the spec's dots are the
 * `indicatorGroup` and its `indicator`s, the counter is `progressText`, and
 * the arrows are `prevTrigger` and `nextTrigger`.
 *
 * Zag marks the current indicator with `data-current` only; the definition
 * adds `aria-current="true"` so assistive technology hears which slide is
 * shown, as the spec draws it. Slides and indicators are named per index
 * (`ids.item(index)`), so the adapters map authored ids per index.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/carousel';

import type { Normalize, WidgetDefinition } from '../core/widget';
import type { Direction } from '../positioning';
import { rescope } from './dropdown-menu';
import { tabsDirection } from './tabs';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type CarouselProps = zag.Props;
/**
 * Zag's carousel api. `isPlaying` is the autoplay trigger's state, the user's
 * choice: it stays true while the pointer or focus on the carousel holds
 * rotation.
 */
export type CarouselApi = zag.Api;

/** Zag's scope for the carousel's parts. */
export const CAROUSEL_SCOPE = 'carousel';

/** The `data-scope` ImageSlider's parts carry. */
export const IMAGE_SLIDER_SCOPE = 'image-slider';

/** The built-in strings. `{index}` and `{count}` are 1-based numbers. */
export const CAROUSEL_LABELS = {
  /** The previous trigger's name. */
  previous: 'Previous slide',
  /** The next trigger's name. */
  next: 'Next slide',
  /** An indicator's name: `{index}` is the slide it shows. */
  indicator: 'Go to slide {index}',
  /** A slide's name: `{index}` of `{count}`. */
  slide: '{index} of {count}',
  /** The progress text (the spec's counter). */
  progress: '{index} / {count}',
  /** The autoplay trigger while paused. */
  play: 'Start slide rotation',
  /** The autoplay trigger while playing. */
  pause: 'Stop slide rotation',
} as const;

export type CarouselLabels = Partial<Record<keyof typeof CAROUSEL_LABELS, string>>;

/** How much of the next slide peeks when several are in view: 0.15 of one. */
export const CAROUSEL_PEEK = 0.15;

/**
 * The machine's `slidesPerPage` for `perView` whole slides: above one, the
 * next slide peeks by `CAROUSEL_PEEK` of a slide at the inline end.
 */
export function carouselSlidesPerPage(perView = 1): number {
  const view = Math.max(1, Math.floor(perView));
  return view > 1 ? view + CAROUSEL_PEEK : 1;
}

/**
 * How many positions (pages) a carousel has: one per slide that can sit at
 * the start of the view, moving one slide at a time. It is what the machine
 * measures once mounted (the last position is the end of the track, short of
 * a full step because of the peek) and, through `carouselMachine`, its snap
 * points before it measures, so a server render draws the same dots, counter
 * and next trigger as the mounted carousel.
 */
export function carouselPageCount(slideCount: number, perView = 1): number {
  const count = Math.max(0, Math.floor(slideCount));
  const view = Math.max(1, Math.floor(perView));
  return count <= view ? 1 : count - view + 1;
}

/**
 * Whether the person asked for reduced motion. Autoplay then starts paused:
 * the pause trigger still shows, and a press on it starts rotation.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Replaces `{index}` and `{count}` in a label. */
export function formatCarouselLabel(template: string, index: number, count: number): string {
  return template.replace(/\{index\}/g, String(index)).replace(/\{count\}/g, String(count));
}

/** Zag's translations for `labels`, falling back to `CAROUSEL_LABELS`. */
export function carouselTranslations(labels: CarouselLabels = {}): zag.IntlTranslations {
  const text = { ...CAROUSEL_LABELS, ...definedOnly(labels) };
  return {
    prevTrigger: text.previous,
    nextTrigger: text.next,
    indicator: (index) => formatCarouselLabel(text.indicator, index + 1, 0),
    item: (index, count) => formatCarouselLabel(text.slide, index + 1, count),
    progressText: ({ page, totalPages }) => formatCarouselLabel(text.progress, page, totalPages),
    autoplayStart: text.play,
    autoplayStop: text.pause,
  };
}

const definedOnly = (labels: CarouselLabels) =>
  Object.fromEntries(
    Object.entries(labels).filter(([, value]) => typeof value === 'string' && value !== ''),
  ) as CarouselLabels;

/** Per machine: whether the pointer or focus paused autoplay, so leaving resumes it. */
const pausedByVisit = new WeakMap<object, { hover: boolean; focus: boolean; resume: boolean }>();

/**
 * Adds `aria-current` to the current indicator (Zag marks it with
 * `data-current` only), and pauses autoplay while the pointer or focus is on
 * the carousel, resuming when both leave, as the APG carousel pattern asks.
 *
 * That pause is not the user's choice, so it doesn't change the autoplay
 * trigger (WCAG 2.2.2): `isPlaying`, the trigger's name and `data-pressed`
 * keep reporting rotation as on, and one click on the trigger stops it for
 * good. A click while it's off starts it at once.
 */
function withCarouselExtras(
  api: zag.Api,
  normalize: Normalize,
  service: object,
  translations: zag.IntlTranslations | undefined,
): CarouselApi {
  let visit = pausedByVisit.get(service);
  if (!visit) {
    visit = { hover: false, focus: false, resume: false };
    pausedByVisit.set(service, visit);
  }
  const state = visit;
  const enter = (kind: 'hover' | 'focus') => {
    state[kind] = true;
    if (api.isPlaying) {
      state.resume = true;
      api.pause();
    }
  };
  const leave = (kind: 'hover' | 'focus') => {
    state[kind] = false;
    if (state.resume && !state.hover && !state.focus) {
      state.resume = false;
      api.play();
    }
  };
  /** The user's choice: on unless they stopped it, whatever a visit holds. */
  const rotating = api.isPlaying || state.resume;
  return {
    ...api,
    isPlaying: rotating,
    getRootProps() {
      const attrs = api.getRootProps() as Record<string, unknown>;
      return normalize.element({
        ...attrs,
        onPointerEnter: () => enter('hover'),
        onPointerLeave: () => leave('hover'),
        onFocus: () => enter('focus'),
        onBlur: (event: { currentTarget: unknown; relatedTarget: unknown }) => {
          const root = event.currentTarget as Element | null;
          if (root && event.relatedTarget instanceof Node && root.contains(event.relatedTarget))
            return;
          leave('focus');
        },
      });
    },
    getAutoplayTriggerProps() {
      const {
        onClick: _onClick,
        onclick: _onclick,
        ...attrs
      } = api.getAutoplayTriggerProps() as Record<string, unknown>;
      // A click on the trigger is a choice: leaving doesn't resume or undo it.
      return normalize.button({
        ...attrs,
        // Held by a visit, Zag reads it as paused: name it as rotating.
        ...(state.resume
          ? {
              'data-pressed': '',
              'aria-label': translations?.autoplayStop ?? CAROUSEL_LABELS.pause,
            }
          : {}),
        onClick: (event: { defaultPrevented: boolean }) => {
          if (event.defaultPrevented) return;
          const held = state.resume;
          state.resume = false;
          if (!rotating) api.play();
          else if (!held) api.pause();
          else {
            // Already paused by the visit: a round trip through the machine
            // re-renders the trigger, now off, in every adapter.
            api.play();
            api.pause();
          }
        },
      });
    },
    getIndicatorProps(props: zag.IndicatorProps) {
      const attrs = api.getIndicatorProps(props) as Record<string, unknown>;
      const current = attrs['data-current'] !== undefined && attrs['data-current'] !== false;
      return normalize.button({ ...attrs, 'aria-current': current ? 'true' : undefined });
    },
  };
}

/**
 * Zag's carousel machine, with its snap points before it measures (one per
 * slide index) counted by `carouselPageCount`. Zag counts the slide indexes
 * whose page fits whole, `slidesPerPage` with the peek included, so with
 * `perView` above one it has a position fewer than the track measures to
 * once mounted (the last slide sits at the end with the peek gone). Only the
 * default changes: mounting, a resize or a slide change still measures.
 */
export const carouselMachine = {
  ...zag.machine,
  context(params) {
    const context = zag.machine.context!(params);
    const { prop, bindable } = params;
    if (prop('autoSize') || prop('slidesPerMove') !== 1) return context;
    const slideCount = Math.max(0, Math.floor(prop('slideCount') ?? 0));
    const pages = slideCount > 0 ? carouselPageCount(slideCount, prop('slidesPerPage')) : 0;
    return {
      ...context,
      pageSnapPoints: bindable(() => ({
        defaultValue: Array.from({ length: pages }, (_, index) => index),
      })),
    };
  },
} as Machine<Schema>;

/** The carousel's definition, its parts carrying `scope`. */
export function carouselDefinition(
  scope: string = CAROUSEL_SCOPE,
): WidgetDefinition<Schema, CarouselApi> {
  return {
    scope,
    machine: carouselMachine,
    connect: (service, normalize) => {
      const scoped =
        scope === CAROUSEL_SCOPE ? normalize : rescope(normalize, CAROUSEL_SCOPE, scope);
      return withCarouselExtras(
        zag.connect(service as never, scoped),
        scoped,
        // The machine's refs: one object per machine, where the service is
        // rebuilt on every read in the vanilla adapter.
        ((service as { refs?: object }).refs ?? service) as object,
        (service as { prop?(key: 'translations'): zag.IntlTranslations | undefined }).prop?.(
          'translations',
        ),
      );
    },
  };
}

/** ImageSlider's carousel: Zag's machine with its parts scoped `image-slider`. */
export const imageSlider: WidgetDefinition<Schema, CarouselApi> =
  carouselDefinition(IMAGE_SLIDER_SCOPE);

/** Part ids for a carousel: single parts by id, slides and indicators per index. */
export interface CarouselIds {
  root?: string;
  itemGroup?: string;
  prevTrigger?: string;
  nextTrigger?: string;
  indicatorGroup?: string;
  item?: (index: number) => string;
  indicator?: (index: number) => string;
}

/** Options for `useCarousel` in React and Vue. */
export interface CarouselOptions {
  /** How many slides there are. Required by the machine. */
  slideCount: number;
  /** Slides per view, a whole number. Default 1. Above one the next slide peeks; each move shows one more. */
  perView?: number;
  /** The gap between slides, a CSS length. Default `0px`. */
  spacing?: string;
  /** Controlled index: the slide shown, 0-based. Pair it with `onIndexChange`. */
  index?: number;
  /** Initial index when uncontrolled. */
  defaultIndex?: number;
  /** Called when the carousel moves to another slide. */
  onIndexChange?: (details: { index: number }) => void;
  /** Wrap from the last slide to the first. Default false. */
  loop?: boolean;
  /** Advance on its own every `interval` ms, with a pause trigger. Default false. */
  autoplay?: boolean;
  /** Milliseconds between slides while autoplay runs. Default 5000. */
  interval?: number;
  /** Names the region (`aria-label`). */
  label?: string;
  /** Built-in strings, for translation. */
  labels?: CarouselLabels;
  /** The `data-scope` its parts carry. Default `carousel`. */
  scope?: string;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  ids?: CarouselIds;
  /** Text direction. Defaults to the direction measured around the parts. */
  dir?: Direction;
}

/** The carousel machine's props for `options`. */
export function toCarouselProps(options: CarouselOptions, id: string): Partial<CarouselProps> {
  const controlled = options.index !== undefined && options.index !== null;
  return {
    id,
    ids: options.ids,
    // Before mount, `<html dir>`: the measured direction replaces it after.
    dir: tabsDirection(options.dir),
    slideCount: Math.max(0, options.slideCount),
    slidesPerPage: carouselSlidesPerPage(options.perView),
    slidesPerMove: 1,
    spacing: options.spacing ?? '0px',
    loop: options.loop ?? false,
    autoplay: options.autoplay ? { delay: options.interval ?? 5000 } : false,
    allowMouseDrag: false,
    ...(controlled ? { page: options.index } : { defaultPage: options.defaultIndex ?? 0 }),
    translations: carouselTranslations(options.labels),
    onPageChange: ({ page }) => options.onIndexChange?.({ index: page }),
  };
}
