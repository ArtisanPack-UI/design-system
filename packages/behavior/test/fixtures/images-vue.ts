/**
 * ImageGallery's lightbox and ImageSlider's carousel through the Vue adapter
 * (#61), with the same ids as the Alpine tests. Render functions, so no SFC
 * compiler is needed.
 */
import { type App, createApp, defineComponent, Fragment, h, ref } from 'vue';

import { lightboxCounter, useCarousel, useLightbox } from '../../src/vue';
import { CAROUSEL_IDS, IMAGES, LIGHTBOX_IDS, installImages } from './images-shared';

const open = ref(false);
const index = ref(0);
const fixture = installImages({ mount, setIndex: (next) => (index.value = next) });
let app: App | undefined;

const Gallery = defineComponent(() => {
  const lightbox = useLightbox(() => ({
    count: IMAGES.length,
    open: open.value,
    index: index.value,
    ids: LIGHTBOX_IDS,
    onOpenChange: ({ open: next }) => {
      fixture.events.push(['open-change', { open: next }]);
      open.value = next;
    },
    onIndexChange: (details) => {
      fixture.events.push(['index-change', details]);
      index.value = details.index;
    },
  }));
  return () => {
    const api = lightbox.value;
    const current = IMAGES[api.index]!;
    return h('div', { id: 'g' }, [
      ...IMAGES.map((image, i) =>
        h('button', { key: i, id: `g-trigger-${i}`, ...api.getTriggerProps({ index: i }) }, [
          h('img', { src: image.src, alt: image.alt }),
        ]),
      ),
      h('div', api.getBackdropProps()),
      h('div', api.getPositionerProps(), [
        h('div', api.getContentProps(), [
          h(
            'h2',
            api.getTitleProps(),
            `${lightboxCounter('{index} / {count}', api.index, api.count)} · ${current.caption}`,
          ),
          h('button', { ...api.getCloseTriggerProps(), 'aria-label': 'Close' }, '×'),
          h('img', { id: 'g-image', ...api.getImageProps(), src: current.src, alt: current.alt }),
          h(
            'button',
            { id: 'g-prev', ...api.getPrevTriggerProps(), 'aria-label': 'Previous photo' },
            '‹',
          ),
          h(
            'button',
            { id: 'g-next', ...api.getNextTriggerProps(), 'aria-label': 'Next photo' },
            '›',
          ),
          ...IMAGES.map((image, i) =>
            h('button', { key: `t${i}`, id: `g-thumb-${i}`, ...api.getThumbProps({ index: i }) }, [
              h('img', { src: image.src, alt: image.alt }),
            ]),
          ),
        ]),
      ]),
    ]);
  };
});

const Slider = defineComponent(() => {
  const carousel = useCarousel(() => ({
    slideCount: IMAGES.length,
    scope: 'image-slider',
    ids: CAROUSEL_IDS,
    labels: { previous: 'Previous photo', next: 'Next photo', indicator: 'Photo {index}' },
    onIndexChange: (details) => fixture.events.push(['index-change', details]),
  }));
  return () => {
    const api = carousel.value;
    return h('div', { ...api.getRootProps(), 'aria-label': 'Tour' }, [
      h(
        'div',
        api.getItemGroupProps(),
        IMAGES.map((image, i) =>
          h('div', { key: i, ...api.getItemProps({ index: i }) }, [
            h('img', { src: image.src, alt: image.alt }),
          ]),
        ),
      ),
      h('button', api.getPrevTriggerProps(), '‹'),
      h('button', api.getNextTriggerProps(), '›'),
      h('span', { id: 'c-progress', ...api.getProgressTextProps() }, api.progressText),
      h(
        'div',
        api.getIndicatorGroupProps(),
        IMAGES.map((_, i) => h('button', { key: i, ...api.getIndicatorProps({ index: i }) })),
      ),
      ...IMAGES.map((image, i) =>
        h('button', { key: `t${i}`, id: `c-thumb-${i}`, ...api.getThumbProps({ index: i }) }, [
          h('img', { src: image.src, alt: image.alt }),
        ]),
      ),
    ]);
  };
});

function mount() {
  app?.unmount();
  open.value = false;
  index.value = 0;
  fixture.events = [];
  app = createApp(() => h(Fragment, [h(Gallery), h(Slider)]));
  app.mount('#root');
}
