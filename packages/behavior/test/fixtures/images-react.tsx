/**
 * ImageGallery's lightbox and ImageSlider's carousel through the React
 * adapter (#61), with the same ids as the Alpine tests.
 * `window.imagesFixture.mount()`.
 */
import { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { lightboxCounter, useCarousel, useLightbox } from '../../src/react';
import { CAROUSEL_IDS, IMAGES, LIGHTBOX_IDS, installImages } from './images-shared';

const parent: { setIndex?: (index: number) => void } = {};
const fixture = installImages({ mount, setIndex: (index) => parent.setIndex?.(index) });
let root: Root | undefined;

function Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  parent.setIndex = setIndex;
  const lightbox = useLightbox({
    count: IMAGES.length,
    open,
    index,
    ids: LIGHTBOX_IDS,
    onOpenChange: ({ open: next }) => {
      fixture.events.push(['open-change', { open: next }]);
      setOpen(next);
    },
    onIndexChange: (details) => {
      fixture.events.push(['index-change', details]);
      setIndex(details.index);
    },
  });
  const current = IMAGES[lightbox.index]!;
  return (
    <div id="g">
      {IMAGES.map((image, i) => (
        <button key={i} id={`g-trigger-${i}`} {...lightbox.getTriggerProps({ index: i })}>
          <img src={image.src} alt={image.alt} />
        </button>
      ))}
      <div {...lightbox.getBackdropProps()} />
      <div {...lightbox.getPositionerProps()}>
        <div {...lightbox.getContentProps()}>
          <h2 {...lightbox.getTitleProps()}>
            {`${lightboxCounter('{index} / {count}', lightbox.index, lightbox.count)} · ${current.caption}`}
          </h2>
          <button {...lightbox.getCloseTriggerProps()} aria-label="Close">
            ×
          </button>
          <img id="g-image" {...lightbox.getImageProps()} src={current.src} alt={current.alt} />
          <button id="g-prev" {...lightbox.getPrevTriggerProps()} aria-label="Previous photo">
            ‹
          </button>
          <button id="g-next" {...lightbox.getNextTriggerProps()} aria-label="Next photo">
            ›
          </button>
          {IMAGES.map((image, i) => (
            <button key={i} id={`g-thumb-${i}`} {...lightbox.getThumbProps({ index: i })}>
              <img src={image.src} alt={image.alt} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slider() {
  const carousel = useCarousel({
    slideCount: IMAGES.length,
    scope: 'image-slider',
    ids: CAROUSEL_IDS,
    labels: { previous: 'Previous photo', next: 'Next photo', indicator: 'Photo {index}' },
    onIndexChange: (details) => fixture.events.push(['index-change', details]),
  });
  return (
    <div {...carousel.getRootProps()} aria-label="Tour">
      <div {...carousel.getItemGroupProps()}>
        {IMAGES.map((image, i) => (
          <div key={i} {...carousel.getItemProps({ index: i })}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
      <button {...carousel.getPrevTriggerProps()}>‹</button>
      <button {...carousel.getNextTriggerProps()}>›</button>
      <span id="c-progress" {...carousel.getProgressTextProps()}>
        {carousel.progressText}
      </span>
      <div {...carousel.getIndicatorGroupProps()}>
        {IMAGES.map((_, i) => (
          <button key={i} {...carousel.getIndicatorProps({ index: i })} />
        ))}
      </div>
      {IMAGES.map((image, i) => (
        <button key={i} id={`c-thumb-${i}`} {...carousel.getThumbProps({ index: i })}>
          <img src={image.src} alt={image.alt} />
        </button>
      ))}
    </div>
  );
}

function mount() {
  root?.unmount();
  fixture.events = [];
  root = createRoot(document.getElementById('root')!);
  root.render(
    <>
      <Gallery />
      <Slider />
    </>,
  );
}
