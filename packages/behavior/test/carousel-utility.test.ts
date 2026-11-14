/**
 * Carousel (#65) on the carousel widget ImageSlider uses (D-041): perView
 * with a peek, the page count a server render draws, the machine props, and
 * autoplay that starts paused under reduced motion in the Alpine adapter.
 * Plus Icon's directional registry (D-017).
 */
import * as zag from '@zag-js/carousel';

import {
  CAROUSEL_PEEK,
  carouselMachine,
  carouselPageCount,
  carouselSlidesPerPage,
  toCarouselProps,
} from '../src/widgets/carousel';
import {
  DIRECTIONAL_ICONS,
  isDirectionalIcon,
  registerDirectionalIcons,
  resetIcons,
} from '../src/icons';
import * as entry from '../src/index';
import { close, launch, open, settle } from './browser';

afterAll(close);

describe('carousel perView (#65)', () => {
  it('peeks the next slide above one per view', () => {
    expect(CAROUSEL_PEEK).toBe(0.15);
    expect(carouselSlidesPerPage()).toBe(1);
    expect(carouselSlidesPerPage(1)).toBe(1);
    expect(carouselSlidesPerPage(3)).toBe(3.15);
    expect(carouselSlidesPerPage(2.7)).toBe(2.15);
    expect(carouselSlidesPerPage(0)).toBe(1);
  });

  it('counts one position per slide that can start the view', () => {
    expect(carouselPageCount(4)).toBe(4);
    expect(carouselPageCount(4, 3)).toBe(2);
    expect(carouselPageCount(3, 3)).toBe(1);
    expect(carouselPageCount(2, 3)).toBe(1);
    expect(carouselPageCount(0)).toBe(1);
  });

  it('passes perView, one slide per move and the spacing to the machine', () => {
    const props = toCarouselProps({ slideCount: 4, perView: 3, spacing: '12px' }, 'c');
    expect(props.slidesPerPage).toBe(3.15);
    expect(props.slidesPerMove).toBe(1);
    expect(props.spacing).toBe('12px');
    const slider = toCarouselProps({ slideCount: 4 }, 's');
    expect(slider.slidesPerPage).toBe(1);
    expect(slider.spacing).toBe('0px');
  });

  it('starts the machine with as many snap points as carouselPageCount draws dots', () => {
    /** The machine's snap points before it measures, for `props`. */
    const snapPointsBefore = (machine: typeof carouselMachine, props: Record<string, unknown>) => {
      const all: Record<string, unknown> = {
        ...zag.machine.props!({ props, scope: {} as never }),
        ...props,
      };
      const context = machine.context!({
        prop: ((key: string) => all[key]) as never,
        bindable: ((config: () => { defaultValue: unknown }) => config()) as never,
      } as never) as unknown as Record<string, { defaultValue: unknown }>;
      return context.pageSnapPoints!.defaultValue as number[];
    };
    for (const [slideCount, perView] of [
      [5, 1],
      [5, 3],
      [4, 3],
      [3, 3],
      [2, 3],
      [12, 4],
    ] as const) {
      const props = toCarouselProps({ slideCount, perView }, 'c');
      const points = snapPointsBefore(carouselMachine, props as Record<string, unknown>);
      expect(points).toEqual(
        Array.from({ length: carouselPageCount(slideCount, perView) }, (_, i) => i),
      );
    }
    // Zag's own count leaves out the last position whenever the next slide peeks.
    const peeking = toCarouselProps({ slideCount: 5, perView: 3 }, 'c') as Record<string, unknown>;
    expect(snapPointsBefore(zag.machine as never, peeking)).toHaveLength(2);
    expect(carouselPageCount(5, 3)).toBe(3);
    // No slides, no positions; autoSize keeps Zag's own default.
    expect(snapPointsBefore(carouselMachine, { ...peeking, slideCount: 0 })).toEqual([]);
    expect(snapPointsBefore(carouselMachine, { ...peeking, autoSize: true })).toHaveLength(5);
  });

  it('is exported from the package entry', () => {
    expect(entry.carouselPageCount).toBe(carouselPageCount);
    expect(entry.carouselSlidesPerPage).toBe(carouselSlidesPerPage);
    expect(typeof entry.prefersReducedMotion).toBe('function');
    expect(entry.isDirectionalIcon).toBe(isDirectionalIcon);
  });
});

describe('directional icons (D-017, #65)', () => {
  afterEach(() => resetIcons());

  it('mirrors the inline-axis arrows and chevrons only', () => {
    expect([...DIRECTIONAL_ICONS]).toEqual([
      'arrow-left',
      'arrow-right',
      'chevron-left',
      'chevron-right',
    ]);
    expect(isDirectionalIcon('chevron-right')).toBe(true);
    expect(isDirectionalIcon('trending-up')).toBe(false);
    expect(isDirectionalIcon(undefined)).toBe(false);
  });

  it('takes an app’s own directional names until reset', () => {
    registerDirectionalIcons(['send']);
    expect(isDirectionalIcon('send')).toBe(true);
    resetIcons();
    expect(isDirectionalIcon('send')).toBe(false);
  });
});

const carouselMarkup = (autoplay: boolean) => `
<style>#k-group { width: 300px; } #k-group > div { height: 60px; }</style>
<div id="k" aria-label="Notes" x-data="apuiCarousel({ scope: 'carousel', slideCount: 4, perView: 3, spacing: '12px', autoplay: ${autoplay}, labels: { play: 'Play', pause: 'Pause' } })" x-apui:root>
  <div id="k-group" x-apui:item-group>
    ${[0, 1, 2, 3].map((i) => `<div id="k-item-${i}" x-apui:item="{ index: ${i} }">${i}</div>`).join('')}
  </div>
  <button id="k-play" x-apui:autoplay-trigger></button>
</div>`;

describe('apuiCarousel with perView and reduced motion (#65)', () => {
  it('measures carouselPageCount positions once mounted, the last one at the end of the track', async () => {
    await launch();
    const { page, errors } = await open(`
<style>#m-group { width: 300px; } #m-group > div { height: 60px; }</style>
<div id="m" aria-label="Notes" x-data="apuiCarousel({ scope: 'carousel', slideCount: 5, perView: 3, spacing: '12px' })" x-apui:root>
  <div id="m-group" x-apui:item-group>
    ${[0, 1, 2, 3, 4].map((i) => `<div x-apui:item="{ index: ${i} }">${i}</div>`).join('')}
  </div>
  <button id="m-next" x-apui:next-trigger></button>
</div>`);
    await settle(page);
    const steps: boolean[] = [];
    for (let i = 0; i < 4; i++) {
      steps.push(await page.$eval('#m-next', (el) => (el as HTMLButtonElement).disabled));
      if (steps.at(-1)) break;
      await page.click('#m-next');
      await settle(page);
    }
    // Two moves reach the last of carouselPageCount(5, 3) = 3 positions.
    expect(steps).toEqual([false, false, true]);
    expect(steps.length).toBe(carouselPageCount(5, 3));
    expect(errors).toEqual([]);
    await page.close();
  });

  it('lays out perView slides with a peek, scoped carousel', async () => {
    await launch();
    const { page, errors } = await open(carouselMarkup(false));
    await settle(page);
    expect(await page.$eval('#k', (el) => el.getAttribute('data-scope'))).toBe('carousel');
    expect(
      await page.$eval('#k', (el) =>
        (el as HTMLElement).style.getPropertyValue('--slides-per-page'),
      ),
    ).toBe('3.15');
    expect(
      await page.$eval('#k', (el) => (el as HTMLElement).style.getPropertyValue('--slide-spacing')),
    ).toBe('12px');
    expect(await page.$eval('#k-item-1', (el) => el.getAttribute('aria-label'))).toBe('2 of 4');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('starts autoplay paused under reduced motion, and the trigger starts it', async () => {
    const { page } = await open(carouselMarkup(true));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Mount it again, now that the person prefers reduced motion.
    await page.evaluate(() => {
      const alpine = (
        window as unknown as {
          Alpine: { destroyTree(el: Element): void; initTree(el: Element): void };
        }
      ).Alpine;
      const el = document.querySelector('#k')!;
      alpine.destroyTree(el);
      alpine.initTree(el);
    });
    await settle(page);
    await page.waitForFunction(
      () => document.querySelector('#k-play')?.getAttribute('aria-label') === 'Play',
    );
    await page.click('#k-play');
    await page.waitForFunction(
      () => document.querySelector('#k-play')?.getAttribute('aria-label') === 'Pause',
    );
    await page.close();
  });

  it('autoplays without reduced motion', async () => {
    const { page } = await open(carouselMarkup(true));
    await settle(page);
    expect(await page.$eval('#k-play', (el) => el.getAttribute('aria-label'))).toBe('Pause');
    await page.close();
  });
});
