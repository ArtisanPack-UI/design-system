/**
 * Pixel diffs for the visual gate (#39): a stack against the baseline, and
 * stacks against each other.
 */
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/** The default per-pixel color tolerance. */
export const DEFAULT_THRESHOLD = 0.02;

export interface DiffOptions {
  /**
   * Per-pixel color tolerance, 0 to 1. Default 0.02: pixelmatch's own 0.1
   * misses a hover color change outright, while anti-aliasing is excluded
   * separately, so a tight threshold doesn't make the gate flaky.
   */
  threshold?: number;
  /** The share of pixels allowed to differ, 0 to 1. Default 0. */
  maxDiffRatio?: number;
}

export interface DiffResult {
  /** Whether the images match within the options. */
  match: boolean;
  /** Pixels that differ. Every pixel when the sizes differ. */
  diffPixels: number;
  ratio: number;
  /** Set when the two images have different dimensions. */
  sizeMismatch?: { a: [number, number]; b: [number, number] };
  /** The diff image: changed pixels in red over a faded copy of `a`. */
  diff: Buffer;
}

/** Copies `png` onto a canvas of `width` × `height`, filling the rest with transparency. */
function pad(png: PNG, width: number, height: number): PNG {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height });
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);
  return out;
}

/** Compares two PNGs. Images of different sizes are padded, compared and never match. */
export function compareImages(a: Buffer, b: Buffer, options: DiffOptions = {}): DiffResult {
  const { threshold = DEFAULT_THRESHOLD, maxDiffRatio = 0 } = options;
  const first = PNG.sync.read(a);
  const second = PNG.sync.read(b);
  const width = Math.max(first.width, second.width);
  const height = Math.max(first.height, second.height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    pad(first, width, height).data,
    pad(second, width, height).data,
    diff.data,
    width,
    height,
    { threshold },
  );
  const sameSize = first.width === second.width && first.height === second.height;
  const ratio = diffPixels / (width * height);
  return {
    match: sameSize && ratio <= maxDiffRatio,
    diffPixels,
    ratio,
    ...(sameSize
      ? {}
      : {
          sizeMismatch: {
            a: [first.width, first.height] as [number, number],
            b: [second.width, second.height] as [number, number],
          },
        }),
    diff: PNG.sync.write(diff),
  };
}
