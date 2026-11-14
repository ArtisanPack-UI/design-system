/**
 * Lightbox (#61, ImageGallery): Zag's dialog machine, scoped to the
 * component that opens it, plus the index of the image it shows. The dialog
 * traps focus, locks scroll, hides the page behind it, closes on Escape and
 * returns focus to the thumbnail that opened it (D-019); the lightbox adds
 * arrow keys that follow the text direction, Home and End, and a counter.
 *
 * There's no machine for the index: it's one number, kept by each adapter
 * (Alpine state, React state, a Vue ref) and stepped by `lightboxStep()`.
 * Every grid item opens the same dialog, so items aren't Zag's `trigger`
 * part (one id); they're buttons that call `show(index)`.
 */
import type { Machine } from '@zag-js/core';
import * as zag from '@zag-js/dialog';

import type { WidgetDefinition } from '../core/widget';
import type { Direction } from '../positioning';
import { rescope } from './dropdown-menu';

type Schema = zag.Machine extends Machine<infer S> ? S : never;

export type LightboxProps = zag.Props;
export type LightboxApi = zag.Api;

/** The `data-scope` ImageGallery's parts carry, its lightbox's included. */
export const IMAGE_GALLERY_SCOPE = 'image-gallery';

/** The dialog definition with its parts scoped `scope` (default `image-gallery`). */
export function lightboxDefinition(
  scope: string = IMAGE_GALLERY_SCOPE,
): WidgetDefinition<Schema, LightboxApi> {
  return {
    scope,
    machine: zag.machine as Machine<Schema>,
    connect: (service, normalize) =>
      zag.connect(service as never, rescope(normalize, 'dialog', scope)),
  };
}

/** ImageGallery's lightbox. */
export const lightbox: WidgetDefinition<Schema, LightboxApi> = lightboxDefinition();

/** The built-in strings. `{index}` and `{count}` are 1-based numbers. */
export const LIGHTBOX_LABELS = {
  /** The close button's name. */
  close: 'Close',
  /** The previous button's name. */
  previous: 'Previous photo',
  /** The next button's name. */
  next: 'Next photo',
  /** The download link's name. */
  download: 'Download',
  /** The counter in the bar, before the caption. */
  counter: '{index} / {count}',
  /** The thumbnail strip's name. */
  thumbs: 'Photos',
} as const;

export type LightboxLabels = Partial<Record<keyof typeof LIGHTBOX_LABELS, string>>;

/** `LIGHTBOX_LABELS` with `labels` over them, ignoring empty ones. */
export function lightboxLabels(
  labels: LightboxLabels = {},
): Record<keyof typeof LIGHTBOX_LABELS, string> {
  const own = Object.fromEntries(
    Object.entries(labels).filter(([, value]) => typeof value === 'string' && value !== ''),
  );
  return { ...LIGHTBOX_LABELS, ...own };
}

/** The counter text: `{index}` of `{count}`, 1-based. */
export function lightboxCounter(template: string, index: number, count: number): string {
  return template.replace(/\{index\}/g, String(index + 1)).replace(/\{count\}/g, String(count));
}

/** A move in the lightbox. */
export type LightboxMove = 'previous' | 'next' | 'first' | 'last';

/**
 * The move a key makes, or undefined. ArrowLeft and ArrowRight follow the
 * text direction, so in RTL ArrowLeft shows the next image (D-004).
 */
export function lightboxKey(key: string, dir: Direction = 'ltr'): LightboxMove | undefined {
  switch (key) {
    case 'ArrowRight':
      return dir === 'rtl' ? 'previous' : 'next';
    case 'ArrowLeft':
      return dir === 'rtl' ? 'next' : 'previous';
    case 'Home':
      return 'first';
    case 'End':
      return 'last';
    default:
      return undefined;
  }
}

/** The index after `move` among `count` images. Previous and next wrap. */
export function lightboxStep(index: number, count: number, move: LightboxMove): number {
  if (count <= 0) return 0;
  switch (move) {
    case 'first':
      return 0;
    case 'last':
      return count - 1;
    case 'next':
      return (index + 1) % count;
    case 'previous':
      return (index - 1 + count) % count;
  }
}

/** An index within `count` images: 0 when out of range or not a number. */
export function clampIndex(index: unknown, count: number): number {
  const value = typeof index === 'number' ? index : Number(index);
  if (!Number.isInteger(value) || value < 0 || count <= 0) return 0;
  return Math.min(value, count - 1);
}

/** Options for `useLightbox` in React and Vue. */
export interface LightboxOptions {
  /** How many images there are. */
  count: number;
  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the lightbox opens or closes itself (an item, Escape, the backdrop, Close). */
  onOpenChange?: (details: { open: boolean }) => void;
  /** Controlled index: the image shown, 0-based. Pair it with `onIndexChange`. */
  index?: number;
  /** Initial index when uncontrolled. */
  defaultIndex?: number;
  /** Called when the lightbox shows another image. */
  onIndexChange?: (details: { index: number }) => void;
  /** Traps focus, locks scroll and hides the page. Default true. */
  modal?: boolean;
  /** The `data-scope` its parts carry. Default `image-gallery`. */
  scope?: string;
  /** Machine id. Defaults to one unique on the page. */
  id?: string;
  /** Authored ids for the dialog's parts. */
  ids?: zag.ElementIds;
  /** Text direction. Defaults to the direction measured around the parts. */
  dir?: Direction;
}

/** The dialog machine's props for `options`. */
export function toLightboxProps(
  options: Pick<LightboxOptions, 'open' | 'defaultOpen' | 'onOpenChange' | 'modal' | 'ids' | 'dir'>,
  id: string,
): Partial<LightboxProps> {
  return {
    id,
    ids: options.ids,
    dir: options.dir,
    open: options.open,
    defaultOpen: options.defaultOpen,
    modal: options.modal ?? true,
    onOpenChange: ({ open }) => options.onOpenChange?.({ open }),
  };
}
