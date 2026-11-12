/** What the ImageGallery lightbox and ImageSlider carousel fixtures (React, Vue) share with the Alpine tests. */

/** Three tiny images: colored SVG data URLs, so nothing loads over the network. */
const svg = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="30"><rect width="40" height="30" fill="${fill}"/></svg>`,
  )}`;

export const IMAGES = [
  { src: svg('#f6d9a8'), alt: 'Lobby', caption: 'The lobby' },
  { src: svg('#cfe3e0'), alt: 'Roof', caption: 'The roof terrace' },
  { src: svg('#1d2b44'), alt: 'Street', caption: 'The street at night' },
];

export const LIGHTBOX_IDS = {
  backdrop: 'g-backdrop',
  positioner: 'g-positioner',
  content: 'g-content',
  title: 'g-title',
  closeTrigger: 'g-close',
};

export const CAROUSEL_IDS = {
  root: 'c',
  itemGroup: 'c-group',
  prevTrigger: 'c-prev',
  nextTrigger: 'c-next',
  indicatorGroup: 'c-indicators',
  item: (index: number) => `c-item-${index}`,
  indicator: (index: number) => `c-indicator-${index}`,
};

/** Styles that give the carousel's slides a size, so the machine can snap to them. */
export const IMAGES_CSS = `
#c-group { width: 300px; }
#c-group img { display: block; width: 300px; height: 100px; }
`;

export interface ImagesFixtureApi {
  mount(): void;
  /** Sets the parent's lightbox index, as a parent re-rendering with a new prop does. */
  setIndex(index: number): void;
  events: [string, unknown][];
}

export function installImages(api: Pick<ImagesFixtureApi, 'mount' | 'setIndex'>): ImagesFixtureApi {
  const fixture: ImagesFixtureApi = { ...api, events: [] };
  (window as unknown as { imagesFixture: ImagesFixtureApi }).imagesFixture = fixture;
  return fixture;
}
