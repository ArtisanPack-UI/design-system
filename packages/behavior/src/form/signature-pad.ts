/**
 * The Signature pad (#53), shared by every stack: drawing with pointer
 * events, undo and clear, a typed name or an uploaded image rendered to the
 * same PNG data URL, so `value` has one shape whichever mode produced it.
 * Ported from the `forms` package's React and Vue signature pads (D-003).
 *
 * Not a Zag machine: a signature has no states to coordinate, only a canvas,
 * so this is a plain class the Alpine component, the React hook and the Vue
 * composable all drive.
 */
import { definedLabels } from './labels';

/** How a signature is given. */
export type SignatureMode = 'draw' | 'type' | 'upload';

/** Every mode, in the order the mode switch lists them. */
export const SIGNATURE_MODES: readonly SignatureMode[] = ['draw', 'type', 'upload'];

/** The prefix every signature value starts with. */
export const SIGNATURE_DATA_URL_PREFIX = 'data:image/png;base64,';

/** The built-in strings. Livewire passes them through `__()`; React and Vue take `translations`. */
export const SIGNATURE_TRANSLATIONS = {
  modes: 'Signature method',
  draw: 'Draw',
  type: 'Type',
  upload: 'Upload',
  pad: 'Signature pad. Draw with a mouse, finger or stylus, or choose Type.',
  typed: 'Type your full name',
  uploadTrigger: 'Choose an image',
  undo: 'Undo stroke',
  clear: 'Clear',
  placeholder: 'Sign above the line',
  cleared: 'Signature cleared.',
};

/** The Signature's strings, each optional when passed in. */
export type SignatureTranslations = typeof SIGNATURE_TRANSLATIONS;

/** The built-in strings with the caller's overrides. */
export function signatureTranslations(
  overrides: Partial<SignatureTranslations> | null | undefined,
): SignatureTranslations {
  return { ...SIGNATURE_TRANSLATIONS, ...definedLabels(overrides) };
}

/**
 * The modes to offer, in their standard order. Unknown names are dropped and
 * `type` is always offered: it's the keyboard-accessible path.
 */
export function signatureModes(modes?: readonly string[] | null): SignatureMode[] {
  const wanted = new Set(modes && modes.length ? modes : SIGNATURE_MODES);
  wanted.add('type');
  return SIGNATURE_MODES.filter((mode) => wanted.has(mode));
}

/** The starting mode: `mode` when it's offered, else the first offered one. */
export function initialSignatureMode(
  mode: string | null | undefined,
  modes: readonly SignatureMode[],
): SignatureMode {
  return modes.includes(mode as SignatureMode) ? (mode as SignatureMode) : modes[0]!;
}

/** Whether a value is a signature: a PNG data URL. */
export function isSignatureValue(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(SIGNATURE_DATA_URL_PREFIX);
}

/** A point in a stroke, as a fraction of the pad's width and height, so strokes survive a resize. */
interface Point {
  x: number;
  y: number;
}

export interface SignaturePadOptions {
  /** Called with the PNG data URL (or `''` once empty) after every change the pad makes. */
  onChange?: (value: string) => void;
  /** The ink color. Defaults to the canvas's computed `color`, which the CSS sets from `penColor`. */
  color?: () => string;
  /** The stroke width in CSS pixels. */
  lineWidth?: number;
}

/** Device pixels per CSS pixel, capped at 2 for crisp lines without huge PNGs. */
const pixelRatio = () =>
  Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1, 2);

/**
 * A drawing surface on a canvas. Strokes are kept as data, so undo redraws
 * the rest and a resize redraws everything at the new size. A loaded image
 * (a saved value or an upload) sits under the strokes.
 */
export class SignaturePad {
  private strokes: Point[][] = [];

  private current: Point[] | null = null;

  private image: CanvasImageSource | null = null;

  private width = 0;

  private height = 0;

  private disabled = false;

  /** Bumped by every change, so an image that finishes loading late never overwrites newer state. */
  private generation = 0;

  private observer: ResizeObserver | null = null;

  private readonly listeners: [keyof HTMLElementEventMap, EventListener][];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: SignaturePadOptions = {},
  ) {
    this.listeners = [
      ['pointerdown', this.start.bind(this) as EventListener],
      ['pointermove', this.move.bind(this) as EventListener],
      ['pointerup', this.end.bind(this) as EventListener],
      ['pointercancel', this.end.bind(this) as EventListener],
      ['lostpointercapture', this.end.bind(this) as EventListener],
    ];
    for (const [type, listener] of this.listeners) canvas.addEventListener(type, listener);
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(canvas);
    }
    this.resize();
  }

  /** Whether there's nothing on the pad. */
  isEmpty(): boolean {
    return this.strokes.length === 0 && this.image === null;
  }

  /** Whether there's a stroke to undo. */
  canUndo(): boolean {
    return this.strokes.length > 0;
  }

  /** Stops (or resumes) drawing. */
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled) this.current = null;
  }

  /** Removes the last stroke. */
  undo(): void {
    if (!this.strokes.length) return;
    this.strokes.pop();
    this.redraw();
    this.emit();
  }

  /** Empties the pad. `silent` skips `onChange`, for changes the caller made itself. */
  clear(silent = false): void {
    this.generation++;
    this.strokes = [];
    this.current = null;
    this.image = null;
    this.redraw();
    if (!silent) this.emit();
  }

  /** The drawing as a PNG data URL, or `''` when the pad is empty. */
  toDataUrl(): string {
    if (this.isEmpty()) return '';
    try {
      return this.canvas.toDataURL('image/png');
    } catch {
      return '';
    }
  }

  /**
   * Shows a saved PNG data URL (or another image) under the strokes, without
   * reporting a change. Resolves once it's drawn.
   */
  load(src: string): Promise<void> {
    this.strokes = [];
    if (!src) {
      this.clear(true);
      return Promise.resolve();
    }
    const generation = ++this.generation;
    return loadImage(src).then(
      (image) => {
        if (generation !== this.generation) return;
        this.image = image;
        this.redraw();
      },
      () => {
        if (generation === this.generation) this.clear(true);
      },
    );
  }

  /** Shows an image under the strokes and reports the change, as an upload does. */
  setImage(image: CanvasImageSource): void {
    this.generation++;
    this.strokes = [];
    this.image = image;
    this.redraw();
    this.emit();
  }

  /** Removes the listeners and the resize observer. */
  destroy(): void {
    for (const [type, listener] of this.listeners) this.canvas.removeEventListener(type, listener);
    this.observer?.disconnect();
    this.observer = null;
  }

  /** Matches the backing store to the canvas's CSS size and redraws. */
  resize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (!width || !height || (width === this.width && height === this.height)) return;
    const ratio = pixelRatio();
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.redraw();
  }

  private context(): CanvasRenderingContext2D | null {
    return this.canvas.getContext('2d');
  }

  private ink(): string {
    const color = this.options.color?.();
    if (color) return color;
    return typeof getComputedStyle === 'function'
      ? getComputedStyle(this.canvas).color || '#000'
      : '#000';
  }

  private redraw(): void {
    const context = this.context();
    if (!context) return;
    const ratio = pixelRatio();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (this.image) drawContained(context, this.image, this.width, this.height);
    context.lineWidth = this.options.lineWidth ?? 2.25;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = this.ink();
    for (const stroke of this.strokes) this.drawStroke(context, stroke);
  }

  private drawStroke(context: CanvasRenderingContext2D, stroke: Point[]): void {
    const [first, ...rest] = stroke;
    if (!first) return;
    context.beginPath();
    context.moveTo(first.x * this.width, first.y * this.height);
    if (!rest.length) context.lineTo(first.x * this.width + 0.1, first.y * this.height + 0.1);
    for (const point of rest) context.lineTo(point.x * this.width, point.y * this.height);
    context.stroke();
  }

  private point(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: rect.width ? (event.clientX - rect.left) / rect.width : 0,
      y: rect.height ? (event.clientY - rect.top) / rect.height : 0,
    };
  }

  private start(event: PointerEvent): void {
    if (this.disabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    this.generation++;
    this.resize();
    this.canvas.setPointerCapture?.(event.pointerId);
    this.current = [this.point(event)];
    this.strokes.push(this.current);
    this.redraw();
  }

  private move(event: PointerEvent): void {
    if (!this.current) return;
    this.current.push(this.point(event));
    this.redraw();
  }

  private end(): void {
    if (!this.current) return;
    this.current = null;
    this.emit();
  }

  private emit(): void {
    this.options.onChange?.(this.toDataUrl());
  }
}

/** Draws an image scaled to fit inside the box, centered. */
function drawContained(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
): void {
  const source = image as { width?: number; height?: number };
  const iw = Number(source.width) || width;
  const ih = Number(source.height) || height;
  const scale = Math.min(width / iw, height / ih, 1);
  const w = iw * scale;
  const h = ih * scale;
  context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('[apui] the signature image did not load'));
    image.src = src;
  });
}

/** The largest image an upload is redrawn at, in pixels on each side. */
const UPLOAD_MAX_SIZE = 1200;

/**
 * Reads an uploaded image file and redraws it as a PNG, which drops metadata
 * and anything that isn't pixels. Rejects files that aren't images.
 */
export async function readSignatureImage(file: File): Promise<HTMLCanvasElement> {
  if (!file.type.startsWith('image/'))
    throw new Error('[apui] a signature upload must be an image');
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const scale = Math.min(UPLOAD_MAX_SIZE / image.width, UPLOAD_MAX_SIZE / image.height, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface TypedSignatureOptions {
  /** A CSS font shorthand, such as the typed part's computed `font`. */
  font: string;
  /** The ink color. */
  color: string;
  /** The image size in CSS pixels. */
  width?: number;
  height?: number;
}

/**
 * Renders a typed name as a PNG data URL, on the baseline the pad shows, so a
 * typed signature has the same shape of value as a drawn one. `''` for an
 * empty name, or where there's no canvas (server rendering, jsdom).
 */
export function renderTypedSignature(text: string, options: TypedSignatureOptions): string {
  const name = text.trim();
  if (!name || typeof document === 'undefined') return '';
  const width = options.width ?? 600;
  const height = options.height ?? 160;
  const ratio = pixelRatio();
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const context = canvas.getContext('2d');
  if (!context) return '';
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.font = options.font;
  context.fillStyle = options.color;
  context.textBaseline = 'alphabetic';
  // Shrink a long name until it fits between the margins.
  const margin = 24;
  const measured = context.measureText(name).width;
  const fit = measured > width - margin * 2 ? (width - margin * 2) / measured : 1;
  context.save();
  context.translate(margin, height - 46);
  context.scale(fit, fit);
  context.fillText(name, 0, 0);
  context.restore();
  try {
    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}
