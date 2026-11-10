import { PNG } from 'pngjs';

import { compareImages } from '../src/diff';

function png(width: number, height: number, fill: (x: number, y: number) => number[]): Buffer {
  const image = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b] = fill(x, y);
      image.data[i] = r!;
      image.data[i + 1] = g!;
      image.data[i + 2] = b!;
      image.data[i + 3] = 255;
    }
  }
  return PNG.sync.write(image);
}

const white = () => [255, 255, 255];

describe('compareImages', () => {
  it('matches identical images', () => {
    const result = compareImages(png(10, 10, white), png(10, 10, white));
    expect(result).toMatchObject({ match: true, diffPixels: 0, ratio: 0 });
  });

  it('counts differing pixels and draws a diff', () => {
    const dot = png(10, 10, (x, y) => (x < 2 && y < 2 ? [0, 0, 0] : [255, 255, 255]));
    const result = compareImages(png(10, 10, white), dot);
    expect(result.match).toBe(false);
    expect(result.diffPixels).toBe(4);
    expect(PNG.sync.read(result.diff).width).toBe(10);
  });

  it('allows a share of pixels with maxDiffRatio', () => {
    const dot = png(10, 10, (x, y) => (x === 0 && y === 0 ? [0, 0, 0] : [255, 255, 255]));
    expect(compareImages(png(10, 10, white), dot, { maxDiffRatio: 0.01 }).match).toBe(true);
  });

  it('never matches images of different sizes', () => {
    const result = compareImages(png(10, 10, white), png(10, 12, white));
    expect(result.match).toBe(false);
    expect(result.sizeMismatch).toEqual({ a: [10, 10], b: [10, 12] });
  });
});
