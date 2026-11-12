/**
 * `useLightbox` and `useCarousel` for React (#61): ImageGallery's lightbox
 * and ImageSlider's carousel, on the same definitions as `apuiLightbox` and
 * `apuiCarousel`, so the parts, ARIA and keys match the Alpine adapter.
 */
import type { Api as ZagCarouselApi } from '@zag-js/carousel';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import { mergeProps, normalizeProps, type PropTypes, useMachine } from '@zag-js/react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useId, useMemo, useState } from 'react';

import type { Normalize } from '../core/widget';
import { directionOf } from '../positioning';
import {
  carouselDefinition,
  type CarouselOptions,
  CAROUSEL_LABELS,
  CAROUSEL_SCOPE,
  formatCarouselLabel,
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

/** Zag's React `normalizeProps`, typed as the definitions' `connect()` takes it. */
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
export function useLightbox(options: LightboxOptions): LightboxApi {
  const fallback = useId();
  const id = options.id ?? fallback;
  const scope = options.scope ?? IMAGE_GALLERY_SCOPE;
  const count = Math.max(0, options.count);
  const dir = useDirection(options.dir, id, options.ids);
  const definition = useMemo(() => lightboxDefinition(scope), [scope]);
  const [ownIndex, setOwnIndex] = useState(() => clampIndex(options.defaultIndex ?? 0, count));
  const controlledIndex = options.index !== undefined && options.index !== null;
  const index = clampIndex(controlledIndex ? options.index : ownIndex, count);

  const service = useMachine(definition.machine, toLightboxProps({ ...options, dir }, id));
  const dialog = definition.connect(service, normalize) as unknown as ZagDialogApi<PropTypes>;

  const go = (next: number) => {
    const target = clampIndex(next, count);
    if (target === index) return;
    if (!controlledIndex) setOwnIndex(target);
    options.onIndexChange?.({ index: target });
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
        onKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
          if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
          const step = lightboxKey(event.key, directionOf(event.currentTarget));
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
}

/** The carousel's API with React props for each part, plus the thumbs and the progress text. */
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
export function useCarousel(options: CarouselOptions): CarouselApi {
  const fallback = useId();
  const id = options.id ?? fallback;
  const scope = options.scope ?? CAROUSEL_SCOPE;
  const dir = useDirection(options.dir, id, options.ids);
  const definition = useMemo(() => carouselDefinition(scope), [scope]);
  const service = useMachine(definition.machine, toCarouselProps({ ...options, dir }, id));
  const api = definition.connect(service, normalize) as unknown as ZagCarouselApi<PropTypes>;
  const count = Math.max(0, options.slideCount);
  const template = options.labels?.progress || CAROUSEL_LABELS.progress;
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
}
