/**
 * Drawer, Popover and Tooltip (#58, #59) through the Alpine adapter, and the
 * React and Vue hooks: scope and ARIA on the authored ids, focus moving in and
 * back, Escape and outside clicks, placements that follow the text direction,
 * a hoverable tooltip, bound open state and morph survival.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, data, launch, morph, open, setData, settle } from './browser';

const drawerMarkup = (opened = false) => `
<div id="drawer" x-data="apuiDrawer({ open: ${opened} })">
  <button id="d-trigger" x-apui:trigger>Filters</button>
  <div id="d-backdrop" x-apui:backdrop></div>
  <div id="d-positioner" x-apui:positioner>
    <aside id="d-content" class="apui-drawer" x-apui:content>
      <h2 id="d-title" x-apui:title>Filters</h2>
      <input id="d-field" />
      <button id="d-close" x-apui:close-trigger>Close</button>
    </aside>
  </div>
</div>
<button id="outside">Outside</button>`;

const popoverMarkup = (placement = 'bottom') => `
<div style="padding: 160px">
  <div id="popover" x-data="apuiPopover({ placement: '${placement}' })" style="display: contents">
    <button id="p-trigger" x-apui:trigger>Share</button>
    <div id="p-positioner" x-apui:positioner>
      <div id="p-content" class="apui-popover" x-apui:content>
        <span id="p-arrow" x-apui:arrow></span>
        <h3 id="p-title" x-apui:title>Share report</h3>
        <button id="p-copy">Copy</button>
      </div>
    </div>
  </div>
  <button id="outside">Outside</button>
</div>`;

const tooltipMarkup = (options = "placement: 'top', delay: 100") => `
<div style="padding: 160px">
  <button id="before">Before</button>
  <span id="tooltip" x-data="apuiTooltip({ ${options} })" style="display: contents">
    <button id="t-trigger" x-apui:trigger aria-label="Archive">A</button>
    <div id="t-positioner" x-apui:positioner>
      <div id="t-content" class="apui-tooltip" x-apui:content>
        <span id="t-arrow" x-apui:arrow></span>Archive
      </div>
    </div>
  </span>
</div>`;

const shown = (page: Page, id: string) => page.$eval(`#${id}`, (el) => !el.hasAttribute('hidden'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const attr = (page: Page, selector: string, name: string) =>
  page.$eval(selector, (el, n) => el.getAttribute(n), name);
const wait = (page: Page, ms: number) => page.waitForTimeout(ms);

afterAll(close);

describe('drawer (Alpine)', () => {
  it('renders dialog parts scoped drawer on the authored ids', async () => {
    const { page, errors } = await open(drawerMarkup());
    expect(await shown(page, 'd-content')).toBe(false);
    const scopes = await page.$$eval('#drawer [data-part]', (els) => [
      ...new Set(els.map((el) => el.getAttribute('data-scope'))),
    ]);
    expect(scopes).toEqual(['drawer']);
    expect(await attr(page, '#d-trigger', 'aria-controls')).toBe('d-content');
    expect(await attr(page, '#d-trigger', 'aria-haspopup')).toBe('dialog');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens modal, traps focus, closes on Escape and returns focus to the trigger', async () => {
    const { page } = await open(drawerMarkup());
    const events: unknown[] = [];
    await page.exposeFunction('record', (detail: unknown) => events.push(detail));
    await page.evaluate(() =>
      document
        .querySelector('#drawer')!
        .addEventListener('open-change', (e) =>
          (window as unknown as { record(d: unknown): void }).record((e as CustomEvent).detail),
        ),
    );
    await page.click('#d-trigger');
    await settle(page);
    expect(await shown(page, 'd-content')).toBe(true);
    expect(await attr(page, '#d-content', 'role')).toBe('dialog');
    expect(await attr(page, '#d-content', 'aria-modal')).toBe('true');
    expect(await attr(page, '#d-content', 'aria-labelledby')).toBe('d-title');
    expect(
      await page.evaluate(() =>
        document.querySelector('#d-content')!.contains(document.activeElement),
      ),
    ).toBe(true);
    expect(await attr(page, '#outside', 'aria-hidden')).toBe('true');
    expect(await data(page, '#drawer', 'open')).toBe(true);
    await page.keyboard.press('Escape');
    await settle(page);
    await settle(page);
    expect(await shown(page, 'd-content')).toBe(false);
    expect(await focusedId(page)).toBe('d-trigger');
    expect(await data(page, '#drawer', 'open')).toBe(false);
    expect(events).toEqual([{ open: true }, { open: false }]);
    await page.close();
  });

  it('follows bound state and stays open through a morph', async () => {
    const { page, errors } = await open(drawerMarkup());
    await setData(page, '#drawer', 'open', true);
    expect(await shown(page, 'd-content')).toBe(true);
    await morph(page, '#drawer', drawerMarkup().split('<button id="outside">')[0]!);
    expect(await shown(page, 'd-content')).toBe(true);
    expect(await attr(page, '#d-content', 'aria-modal')).toBe('true');
    expect(await attr(page, '#d-content', 'data-scope')).toBe('drawer');
    await page.click('#d-close');
    await settle(page);
    expect(await shown(page, 'd-content')).toBe(false);
    expect(errors).toEqual([]);
    await page.close();
  });
});

describe('popover (Alpine)', () => {
  it('opens a labelled, non-modal dialog, moves focus in and closes on Escape', async () => {
    const { page, errors } = await open(popoverMarkup());
    expect(await shown(page, 'p-content')).toBe(false);
    expect(await attr(page, '#p-trigger', 'aria-haspopup')).toBe('dialog');
    expect(await attr(page, '#p-trigger', 'aria-expanded')).toBe('false');
    await page.click('#p-trigger');
    await settle(page);
    await settle(page);
    expect(await shown(page, 'p-content')).toBe(true);
    expect(await attr(page, '#p-trigger', 'aria-expanded')).toBe('true');
    expect(await attr(page, '#p-content', 'role')).toBe('dialog');
    expect(await attr(page, '#p-content', 'aria-modal')).toBe(null);
    expect(await attr(page, '#p-content', 'aria-labelledby')).toBe('p-title');
    expect(await attr(page, '#p-content', 'data-placement')).toBe('bottom');
    expect(await attr(page, '#p-content', 'data-side')).toBe('bottom');
    expect(await focusedId(page)).toBe('p-copy');
    expect(await attr(page, '#outside', 'aria-hidden')).toBe(null);
    await page.keyboard.press('Escape');
    await settle(page);
    await settle(page);
    expect(await shown(page, 'p-content')).toBe(false);
    expect(await focusedId(page)).toBe('p-trigger');
    expect(await data(page, '#popover', 'open')).toBe(false);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('closes on an outside click, and opens from bound state', async () => {
    const { page } = await open(popoverMarkup());
    await setData(page, '#popover', 'open', true);
    await settle(page);
    expect(await shown(page, 'p-content')).toBe(true);
    await page.click('#outside');
    await settle(page);
    expect(await shown(page, 'p-content')).toBe(false);
    expect(await data(page, '#popover', 'open')).toBe(false);
    await page.close();
  });

  it('puts end on the left in RTL and start on the right', async () => {
    for (const [placement, side] of [
      ['end', 'left'],
      ['start', 'right'],
    ] as const) {
      const { page } = await open(popoverMarkup(placement), { dir: 'rtl' });
      await page.click('#p-trigger');
      await settle(page);
      await settle(page);
      expect(await attr(page, '#p-content', 'data-placement')).toBe(placement);
      expect(await attr(page, '#p-content', 'data-side')).toBe(side);
      const [trigger, panel] = await Promise.all(
        ['#p-trigger', '#p-content'].map((s) =>
          page.$eval(s, (el) => el.getBoundingClientRect().toJSON() as DOMRect),
        ),
      );
      if (side === 'left') expect(panel!.right).toBeLessThanOrEqual(trigger!.left);
      else expect(panel!.left).toBeGreaterThanOrEqual(trigger!.right);
      await page.close();
    }
  });
});

describe('tooltip (Alpine)', () => {
  it('shows at once on keyboard focus, describes the trigger, and closes on Escape', async () => {
    const { page, errors } = await open(tooltipMarkup());
    expect(await shown(page, 't-content')).toBe(false);
    await page.focus('#before');
    await page.keyboard.press('Tab');
    await settle(page);
    expect(await focusedId(page)).toBe('t-trigger');
    expect(await shown(page, 't-content')).toBe(true);
    expect(await attr(page, '#t-content', 'role')).toBe('tooltip');
    expect(await attr(page, '#t-trigger', 'aria-describedby')).toBe('t-content');
    expect(await attr(page, '#t-content', 'data-placement')).toBe('top');
    expect(await attr(page, '#t-content', 'data-side')).toBe('top');
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await shown(page, 't-content')).toBe(false);
    expect(await attr(page, '#t-trigger', 'aria-describedby')).toBe(null);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('shows on hover after the delay and stays open while the pointer is on it', async () => {
    const { page } = await open(tooltipMarkup());
    await page.hover('#t-trigger');
    await wait(page, 30);
    expect(await shown(page, 't-content')).toBe(false);
    await wait(page, 200);
    expect(await shown(page, 't-content')).toBe(true);
    await page.hover('#t-content');
    await wait(page, 300);
    expect(await shown(page, 't-content')).toBe(true);
    await page.mouse.move(0, 0);
    await wait(page, 300);
    expect(await shown(page, 't-content')).toBe(false);
    await page.close();
  });

  it('shows a forced tooltip until open changes, and writes back when bound', async () => {
    const forced = await open(tooltipMarkup("placement: 'bottom', open: true"));
    await settle(forced.page);
    expect(await shown(forced.page, 't-content')).toBe(true);
    await forced.page.keyboard.press('Escape');
    await settle(forced.page);
    expect(await shown(forced.page, 't-content')).toBe(true);
    await setData(forced.page, '#tooltip', 'open', false);
    await settle(forced.page);
    expect(await shown(forced.page, 't-content')).toBe(false);
    await forced.page.close();

    const bound = await open(tooltipMarkup('open: true, bound: true'));
    await settle(bound.page);
    await bound.page.keyboard.press('Escape');
    await settle(bound.page);
    expect(await shown(bound.page, 't-content')).toBe(false);
    expect(await data(bound.page, '#tooltip', 'open')).toBe(false);
    await bound.page.close();
  });

  it('binds an entangled open state, as $wire.entangle() passes it', async () => {
    // $wire.entangle() hands x-data an Alpine interceptor object, not a
    // boolean: Alpine swaps it for the real value before init() runs.
    const { page, errors } = await open(
      tooltipMarkup(
        "placement: 'bottom', open: Alpine.interceptor((initial) => initial)(false), bound: true",
      ),
    );
    await settle(page);
    expect(await shown(page, 't-content')).toBe(false);
    expect(await data(page, '#tooltip', 'open')).toBe(false);
    await setData(page, '#tooltip', 'open', true);
    await settle(page);
    expect(await shown(page, 't-content')).toBe(true);
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await shown(page, 't-content')).toBe(false);
    expect(await data(page, '#tooltip', 'open')).toBe(false);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('puts end on the left in RTL', async () => {
    const { page } = await open(tooltipMarkup("placement: 'end', open: true"), { dir: 'rtl' });
    await settle(page);
    expect(await attr(page, '#t-content', 'data-side')).toBe('left');
    await page.close();
  });

  it('keeps its parts through a morph', async () => {
    const { page, errors } = await open(tooltipMarkup());
    const html = tooltipMarkup().match(/<span id="tooltip"[\s\S]*<\/span>\n/)![0];
    await morph(page, '#tooltip', html);
    await page.focus('#before');
    await page.keyboard.press('Tab');
    await settle(page);
    expect(await shown(page, 't-content')).toBe(true);
    expect(await attr(page, '#t-trigger', 'data-scope')).toBe('tooltip');
    expect(errors).toEqual([]);
    await page.close();
  });
});

// ---------------------------------------------------------------------------
// React and Vue

type Stack = 'react' | 'vue';
const scripts = new Map<Stack, string>();

async function fixture(stack: Stack): Promise<string> {
  const cached = scripts.get(stack);
  if (cached) return cached;
  const result = await build({
    entryPoints: [
      join(__dirname, `fixtures/overlays-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`),
    ],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    jsx: 'automatic',
    write: false,
    define: {
      'process.env.NODE_ENV': '"development"',
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  });
  scripts.set(stack, result.outputFiles[0]!.text);
  return scripts.get(stack)!;
}

async function mountStack(stack: Stack, options: object, dir = 'ltr') {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  await page.setContent(
    `<!doctype html><html dir="${dir}"><head><style>[hidden]{display:none!important}</style></head><body><button id="before">Before</button><div id="root"></div><script>${await fixture(stack)}</script></body></html>`,
  );
  await page.evaluate(
    (o) =>
      (window as unknown as { overlaysFixture: { mount(o: object): void } }).overlaysFixture.mount(
        o,
      ),
    options,
  );
  await settle(page);
  return { page, errors };
}

describe.each(['react', 'vue'] as const)('overlays (%s)', (stack) => {
  it('renders the same scopes, ARIA and ids as Alpine', async () => {
    const { page, errors } = await mountStack(stack, { mode: 'uncontrolled' });
    expect(await attr(page, '#d-content', 'data-scope')).toBe('drawer');
    expect(await attr(page, '#d-trigger', 'aria-controls')).toBe('d-content');
    expect(await attr(page, '#p-trigger', 'aria-haspopup')).toBe('dialog');
    expect(await attr(page, '#p-content', 'data-placement')).toBe('bottom');
    expect(await attr(page, '#t-content', 'role')).toBe('tooltip');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens and closes the drawer, returning focus, when uncontrolled', async () => {
    const { page } = await mountStack(stack, { mode: 'uncontrolled' });
    await page.click('#d-trigger');
    await settle(page);
    expect(await shown(page, 'd-content')).toBe(true);
    expect(await attr(page, '#d-content', 'aria-modal')).toBe('true');
    await page.keyboard.press('Escape');
    await settle(page);
    await settle(page);
    expect(await shown(page, 'd-content')).toBe(false);
    expect(await focusedId(page)).toBe('d-trigger');
    await page.close();
  });

  it('follows the parent for the popover and reports open-change when controlled', async () => {
    const { page } = await mountStack(stack, { mode: 'controlled' });
    await page.click('#p-trigger');
    await settle(page);
    await settle(page);
    expect(await shown(page, 'p-content')).toBe(true);
    expect(await focusedId(page)).toBe('p-copy');
    await page.evaluate(() =>
      (
        window as unknown as { overlaysFixture: { set(w: string, o: boolean): void } }
      ).overlaysFixture.set('popover', false),
    );
    await settle(page);
    expect(await shown(page, 'p-content')).toBe(false);
    const events = await page.evaluate(
      () =>
        (window as unknown as { overlaysFixture: { events: unknown[] } }).overlaysFixture.events,
    );
    expect(events).toContainEqual(['popover:open-change', true]);
    await page.close();
  });

  it('shows the tooltip on keyboard focus with aria-describedby, mirrored in RTL', async () => {
    const { page } = await mountStack(stack, { mode: 'uncontrolled', placement: 'end' }, 'rtl');
    await page.focus('#p-trigger');
    await page.keyboard.press('Tab');
    await settle(page);
    expect(await focusedId(page)).toBe('t-trigger');
    expect(await shown(page, 't-content')).toBe(true);
    expect(await attr(page, '#t-trigger', 'aria-describedby')).toBe('t-content');
    expect(await attr(page, '#t-content', 'data-side')).toBe('left');
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await shown(page, 't-content')).toBe(false);
    await page.close();
  });
});
