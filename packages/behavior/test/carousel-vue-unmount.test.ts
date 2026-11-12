// @vitest-environment happy-dom
/**
 * Vue's useCarousel under reduced motion: the deferred pause after mount is
 * cleared when the component unmounts first, so it never reaches a stopped
 * machine (#65 review).
 */
import { createApp, defineComponent, h } from 'vue';

import { useCarousel } from '../src/vue';

describe('useCarousel (vue) reduced motion', () => {
  let reduced = true;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: reduced && query.includes('reduce'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  /** Mounts a carousel with autoplay and unmounts it at once: the timers left pending. */
  const pendingAfterUnmount = (reducedMotion: boolean) => {
    reduced = reducedMotion;
    vi.clearAllTimers();
    const Host = defineComponent({
      setup() {
        const api = useCarousel({ slideCount: 3, autoplay: true, id: 'c' });
        return () => h('div', api.value.getRootProps());
      },
    });
    const el = document.createElement('div');
    document.body.append(el);
    const app = createApp(Host);
    app.mount(el);
    app.unmount();
    el.remove();
    return vi.getTimerCount();
  };

  it('clears the deferred pause when it unmounts before the pause runs', () => {
    // Reduced motion adds only the deferred pause, and unmounting clears it.
    // The first mount leaves a one-off timer of its own: warm up first.
    pendingAfterUnmount(false);
    const motion = pendingAfterUnmount(false);
    expect(pendingAfterUnmount(true)).toBe(motion);
    expect(() => vi.runAllTimers()).not.toThrow();
  });
});
