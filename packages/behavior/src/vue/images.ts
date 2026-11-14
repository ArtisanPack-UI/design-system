/**
 * `useLightbox` and `useCarousel` for Vue (#61): ImageGallery's lightbox and
 * ImageSlider's carousel, on the same definitions as `apuiLightbox` and
 * `apuiCarousel`, so the parts, ARIA and keys match the Alpine adapter.
 * Options are a plain object, a ref or a getter, so they can follow props.
 */
import type { Api as ZagCarouselApi } from '@zag-js/carousel';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import { mergeProps, normalizeProps, type PropTypes, useMachine } from '@zag-js/vue';
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  useId,
} from 'vue';

import type { Normalize } from '../core/widget';
import { directionOf } from '../positioning';
import {
  carouselDefinition,
  type CarouselOptions,
  CAROUSEL_LABELS,
  CAROUSEL_SCOPE,
  formatCarouselLabel,
  prefersReducedMotion,
  toCarouselProps,
} from '../widgets/carousel';
import {
  clampIndex,
  IMAGE_GALLERY_SCOPE,
  lightboxDefinition,
  lightboxKey,
  type LightboxMove,
  type LightboxOptions,
  lightboxStep,
  toLightboxProps,
} from '../widgets/lightbox';
import { useDirection } from './direction';

/** Zag's Vue `normalizeProps`, typed as the definitions' `connect()` takes it. */
const normalize = normalizeProps as unknown as Normalize;

type Props = Record<string, unknown>;

/** The lightbox's API: the dialog's parts, plus the index and the parts that show it. */
export type LightboxApi = Omit<ZagDialogApi<PropTypes>, 'getTriggerProps'> & {
  /** The image shown, 0-based. */
  index: number;
  /** How many images there are. */
  count: number;
  /** Opens the lightbox on an image. */
  show(index: number): void;
  /** Shows an image. */
  go(index: number): void;
  /** Steps through the images: previous and next wrap. */
  move(move: LightboxMove): void;
  /** A grid item's button, which opens the lightbox on its image. */
  getTriggerProps(props: { index: number }): Props;
  /** The stage image's part attributes (set `src` and `alt` from the image shown). */
  getImageProps(): Props;
  getPrevTriggerProps(): Props;
  getNextTriggerProps(): Props;
  /** A thumbnail button: `aria-current` on the one shown. */
  getThumbProps(props: { index: number }): Props;
  /** The download link's part attributes (set `href` to the image shown). */
  getDownloadProps(): Props;
};

/**
 * The lightbox: a dialog that traps focus, locks scroll and returns focus to
 * the item that opened it, with arrow keys that follow the text direction,
 * Home and End.
 */
export function useLightbox(options: MaybeRefOrGetter<LightboxOptions>): ComputedRef<LightboxApi> {
  const fallback = useId();
  const initial = toValue(options);
  const ownIndex = ref(clampIndex(initial.defaultIndex ?? 0, Math.max(0, initial.count)));
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: current.ids };
  });
  const definition = lightboxDefinition(initial.scope ?? IMAGE_GALLERY_SCOPE);
  const props = computed(() => {
    const current = toValue(options);
    return toLightboxProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(definition.machine, props);

  return computed(() => {
    const current = toValue(options);
    const scope = current.scope ?? IMAGE_GALLERY_SCOPE;
    const count = Math.max(0, current.count);
    const controlled = current.index !== undefined && current.index !== null;
    const index = clampIndex(controlled ? current.index : ownIndex.value, count);
    const dialog = definition.connect(service, normalize) as unknown as ZagDialogApi<PropTypes>;

    const go = (next: number) => {
      const target = clampIndex(next, count);
      if (target === index) return;
      if (!controlled) ownIndex.value = target;
      current.onIndexChange?.({ index: target });
    };
    const move = (step: LightboxMove) => go(lightboxStep(index, count, step));
    const show = (next: number) => {
      go(next);
      dialog.setOpen(true);
    };
    const tag = (part: string, attrs: Props = {}): Props => ({
      'data-scope': scope,
      'data-part': part,
      ...attrs,
    });

    return {
      ...dialog,
      index,
      count,
      show,
      go,
      move,
      getContentProps: () =>
        mergeProps(dialog.getContentProps(), {
          onKeydown(event: KeyboardEvent) {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
            const step = lightboxKey(event.key, directionOf(event.currentTarget as Element));
            if (!step) return;
            event.preventDefault();
            move(step);
          },
        }) as ReturnType<ZagDialogApi<PropTypes>['getContentProps']>,
      getTriggerProps: ({ index: item }) =>
        tag('trigger', { type: 'button', 'aria-haspopup': 'dialog', onClick: () => show(item) }),
      getImageProps: () => tag('image'),
      getPrevTriggerProps: () =>
        tag('prev-trigger', {
          type: 'button',
          disabled: count < 2 ? true : undefined,
          onClick: () => move('previous'),
        }),
      getNextTriggerProps: () =>
        tag('next-trigger', {
          type: 'button',
          disabled: count < 2 ? true : undefined,
          onClick: () => move('next'),
        }),
      getThumbProps: ({ index: item }) =>
        tag('thumb', {
          type: 'button',
          'aria-current': item === index ? 'true' : undefined,
          onClick: () => go(item),
        }),
      getDownloadProps: () => tag('download', { download: '' }),
    };
  });
}

/** The carousel's API with Vue props for each part, plus the thumbs and the progress text. */
export type CarouselApi = ZagCarouselApi<PropTypes> & {
  /** The slide shown, 0-based. */
  index: number;
  /** The progress text (the spec's counter): `2 / 12`. */
  progressText: string;
  /** A thumbnail button that shows its slide: `aria-current` on the one shown. */
  getThumbProps(props: { index: number }): Props;
};

/**
 * The carousel: a scroll-snapping track of slides with previous and next
 * triggers and indicators whose arrow keys follow the text direction.
 * Slides are `getItemProps({ index })`, indicators `getIndicatorProps({ index })`.
 */
export function useCarousel(options: MaybeRefOrGetter<CarouselOptions>): ComputedRef<CarouselApi> {
  const fallback = useId();
  const measured = useDirection(() => {
    const current = toValue(options);
    return { id: current.id ?? fallback, ids: current.ids };
  });
  const definition = carouselDefinition(toValue(options).scope ?? CAROUSEL_SCOPE);
  const props = computed(() => {
    const current = toValue(options);
    return toCarouselProps(
      { ...current, dir: current.dir ?? measured.value },
      current.id ?? fallback,
    );
  });
  const service = useMachine(definition.machine, props);
  // Reduced motion: autoplay starts paused; the trigger still starts it.
  let pauseTimer: ReturnType<typeof setTimeout> | undefined;
  onMounted(() => {
    if (!toValue(options).autoplay || !prefersReducedMotion()) return;
    // Pause once the machine has started, unless it unmounts first.
    pauseTimer = setTimeout(() => {
      pauseTimer = undefined;
      (definition.connect(service, normalize) as unknown as ZagCarouselApi<PropTypes>).pause();
    }, 0);
  });
  onBeforeUnmount(() => clearTimeout(pauseTimer));
  return computed(() => {
    const current = toValue(options);
    const scope = current.scope ?? CAROUSEL_SCOPE;
    const api = definition.connect(service, normalize) as unknown as ZagCarouselApi<PropTypes>;
    const count = Math.max(0, current.slideCount);
    const template = current.labels?.progress || CAROUSEL_LABELS.progress;
    return {
      ...api,
      index: api.page,
      progressText: formatCarouselLabel(template, api.page + 1, count),
      getThumbProps: ({ index }) => ({
        'data-scope': scope,
        'data-part': 'thumb',
        type: 'button',
        'aria-current': index === api.page ? 'true' : undefined,
        onClick: () => api.scrollToIndex(index),
      }),
    };
  });
}
