/**
 * The lightbox only renders image sources that are relative or use an
 * allowed scheme, so a `javascript:` src can't reach the download link.
 */
import { safeMediaSrc } from '../src/alpine/images';

describe('safeMediaSrc', () => {
  it('keeps relative, http(s), blob and data:image sources', () => {
    for (const src of [
      '/a.jpg',
      'a.jpg',
      '//cdn/a.jpg',
      'https://x/a.jpg',
      'blob:https://x/1',
      'data:image/png;base64,AA',
    ]) {
      expect(safeMediaSrc(src)).toBe(src);
    }
  });

  it('drops script and other schemes, even disguised', () => {
    for (const src of [
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      'java\tscript:alert(1)',
      ' javascript:x',
      'data:text/html,x',
      'vbscript:x',
    ]) {
      expect(safeMediaSrc(src)).toBe('');
    }
    expect(safeMediaSrc(undefined)).toBe('');
  });
});
