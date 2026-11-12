/**
 * Accordion and Collapse (#58) through the Alpine adapter, and the React and
 * Vue hooks: the spec's part names over Zag's, ARIA and authored ids, single
 * and multiple accordions, the arrow keys, bound state both ways, the change
 * events, the read-more clamp, and morph survival.
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import { close, data, launch, morph, open, setData, settle } from './browser';

const ITEMS: [string, string, boolean][] = [
  ['live', 'How long does a listing stay live?', false],
  ['owners', 'Can co-owners edit a listing?', false],
  ['files', 'Which file types can I upload?', true],
  ['fees', 'Are there any fees?', false],
];

/** The accordion as a server renders it: ids per part, no machine attributes. */
const accordionMarkup = (options = "value: ['live']") => `
<div id="faq" x-data="apuiAccordion({ ${options} })" x-apui:root class="apui-accordion">
${ITEMS.map(
  ([value, title, disabled]) => `
  <div id="item-${value}" x-apui:item="{ value: '${value}', disabled: ${disabled} }">
    <h3 data-scope="accordion" data-part="title">
      <button id="trigger-${value}" x-apui:item-trigger="{ value: '${value}', disabled: ${disabled} }">${title}<span x-apui:item-indicator="{ value: '${value}' }"></span></button>
    </h3>
    <div id="content-${value}" x-apui:item-content="{ value: '${value}' }">${title} answer</div>
  </div>`,
).join('')}
</div>`;

const collapseMarkup = (options = 'open: false') => `
<div id="more" x-data="apuiCollapse({ ${options} })" x-apui:root class="apui-collapse">
  <button id="more-trigger" x-apui:trigger>Advanced settings<span id="more-icon" x-apui:indicator></span></button>
  <div id="more-content" x-apui:content>Custom URL and search visibility.</div>
</div>`;

const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const expanded = (page: Page) =>
  page.$$eval('[aria-expanded="true"]', (els) => els.map((el) => el.id));
const visiblePanels = (page: Page) =>
  page.$$eval('[data-part="content"]:not([hidden])', (els) => els.map((el) => el.id));

async function record(page: Page, selector: string, name: string) {
  await page.evaluate(
    ([sel, event]) => {
      const w = window as unknown as { events: unknown[] };
      w.events = [];
      document
        .querySelector(sel!)!
        .addEventListener(event!, (e) => w.events.push((e as CustomEvent).detail));
    },
    [selector, name],
  );
}

const recorded = (page: Page) =>
  page.evaluate(() => (window as unknown as { events: unknown[] }).events);

afterAll(close);

describe('accordion (Alpine)', () => {
  it('renders the spec parts and ARIA on the authored ids, scoped accordion', async () => {
    const { page, errors } = await open(accordionMarkup());
    const parts = await page.$$eval('#faq [data-part], #faq', (els) => [
      ...new Set(
        els.map((el) => `${el.getAttribute('data-scope')}:${el.getAttribute('data-part')}`),
      ),
    ]);
    expect(parts.sort()).toEqual(
      [
        'accordion:chevron',
        'accordion:content',
        'accordion:item',
        'accordion:root',
        'accordion:title',
        'accordion:trigger',
      ].sort(),
    );
    expect(await expanded(page)).toEqual(['trigger-live']);
    expect(await visiblePanels(page)).toEqual(['content-live']);
    expect(await page.$eval('#trigger-live', (el) => el.getAttribute('aria-controls'))).toBe(
      'content-live',
    );
    expect(
      await page.$eval('#content-live', (el) => [
        el.getAttribute('role'),
        el.getAttribute('aria-labelledby'),
      ]),
    ).toEqual(['region', 'trigger-live']);
    expect(await page.$eval('#trigger-files', (el) => el.hasAttribute('disabled'))).toBe(true);
    expect(await page.$eval('#item-live', (el) => el.getAttribute('data-state'))).toBe('open');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens one item at a time, closes the open one, and reports value-change', async () => {
    const { page } = await open(accordionMarkup());
    await record(page, '#faq', 'value-change');
    await page.click('#trigger-owners');
    await settle(page);
    expect(await expanded(page)).toEqual(['trigger-owners']);
    expect(await data(page, '#faq', 'value')).toEqual(['owners']);
    await page.click('#trigger-owners');
    await settle(page);
    expect(await expanded(page)).toEqual([]);
    expect(await recorded(page)).toEqual([{ value: ['owners'] }, { value: [] }]);
    await page.close();
  });

  it('keeps the open item open when not collapsible', async () => {
    const { page } = await open(accordionMarkup("value: ['live'], collapsible: false"));
    await page.click('#trigger-live');
    await settle(page);
    expect(await expanded(page)).toEqual(['trigger-live']);
    await page.close();
  });

  it('toggles items from toggle(), as a click on their triggers does', async () => {
    const toggle = (page: Page, value: string) =>
      page.evaluate((v) => {
        const alpine = (
          window as unknown as {
            Alpine: { $data(el: Element): { toggle(value: string): void } };
          }
        ).Alpine;
        alpine.$data(document.querySelector('#faq')!).toggle(v);
      }, value);

    const single = await open(accordionMarkup());
    await toggle(single.page, 'owners');
    await settle(single.page);
    expect(await expanded(single.page)).toEqual(['trigger-owners']);
    expect(await data(single.page, '#faq', 'value')).toEqual(['owners']);
    await toggle(single.page, 'owners');
    await settle(single.page);
    expect(await expanded(single.page)).toEqual([]);
    await single.page.close();

    const fixed = await open(accordionMarkup("value: ['live'], collapsible: false"));
    await toggle(fixed.page, 'live');
    await settle(fixed.page);
    expect(await expanded(fixed.page)).toEqual(['trigger-live']);
    await toggle(fixed.page, 'fees');
    await settle(fixed.page);
    expect(await expanded(fixed.page)).toEqual(['trigger-fees']);
    await fixed.page.close();

    const several = await open(accordionMarkup("value: ['live'], multiple: true"));
    await toggle(several.page, 'fees');
    await settle(several.page);
    expect(await expanded(several.page)).toEqual(['trigger-live', 'trigger-fees']);
    await toggle(several.page, 'live');
    await settle(several.page);
    expect(await expanded(several.page)).toEqual(['trigger-fees']);
    await several.page.close();
  });

  it('opens several items with multiple', async () => {
    const { page } = await open(accordionMarkup("value: ['live'], multiple: true"));
    await page.click('#trigger-fees');
    await settle(page);
    expect(await expanded(page)).toEqual(['trigger-live', 'trigger-fees']);
    expect(await data(page, '#faq', 'value')).toEqual(['live', 'fees']);
    await page.close();
  });

  it('writes a string back to a single accordion bound to a string', async () => {
    const { page } = await open(accordionMarkup("value: 'live'"));
    expect(await expanded(page)).toEqual(['trigger-live']);
    await page.click('#trigger-owners');
    await settle(page);
    expect(await data(page, '#faq', 'value')).toBe('owners');
    await setData(page, '#faq', 'value', 'fees');
    expect(await expanded(page)).toEqual(['trigger-fees']);
    await page.close();
  });

  it('moves between triggers with ArrowDown, ArrowUp, Home and End, skipping disabled items', async () => {
    const { page } = await open(accordionMarkup());
    await page.focus('#trigger-live');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-owners');
    await page.keyboard.press('ArrowDown');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-fees');
    await page.keyboard.press('ArrowUp');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-owners');
    await page.keyboard.press('End');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-fees');
    await page.keyboard.press('Home');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-live');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await expanded(page)).toEqual([]);
    await page.close();
  });

  it('follows the bound value, and disables every item with disabled', async () => {
    const { page } = await open(accordionMarkup("value: ['live'], disabled: true"));
    expect(
      await page.$$eval('[data-part="trigger"]', (els) =>
        els.every((el) => el.hasAttribute('disabled')),
      ),
    ).toBe(true);
    await setData(page, '#faq', 'value', ['fees']);
    expect(await expanded(page)).toEqual(['trigger-fees']);
    await page.close();
  });

  it('keeps the open items and ARIA through a morph', async () => {
    const { page, errors } = await open(accordionMarkup());
    await page.click('#trigger-owners');
    await settle(page);
    await morph(page, '#faq', accordionMarkup());
    expect(await expanded(page)).toEqual(['trigger-owners']);
    expect(await visiblePanels(page)).toEqual(['content-owners']);
    expect(await page.$eval('#trigger-owners', (el) => el.getAttribute('data-part'))).toBe(
      'trigger',
    );
    expect(errors).toEqual([]);
    await page.close();
  });
});

describe('collapse (Alpine)', () => {
  it('renders the spec scope and parts on the authored ids', async () => {
    const { page, errors } = await open(collapseMarkup());
    const parts = await page.$$eval('#more [data-part], #more', (els) => [
      ...new Set(
        els.map((el) => `${el.getAttribute('data-scope')}:${el.getAttribute('data-part')}`),
      ),
    ]);
    expect(parts.sort()).toEqual(
      ['collapse:content', 'collapse:icon', 'collapse:root', 'collapse:trigger'].sort(),
    );
    expect(
      await page.$eval('#more-trigger', (el) => [
        el.getAttribute('aria-expanded'),
        el.getAttribute('aria-controls'),
      ]),
    ).toEqual(['false', 'more-content']);
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).hidden)).toBe(true);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('toggles from the trigger, binds open both ways and reports open-change', async () => {
    const { page } = await open(collapseMarkup());
    await record(page, '#more', 'open-change');
    await page.click('#more-trigger');
    await settle(page);
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).hidden)).toBe(false);
    expect(await data(page, '#more', 'open')).toBe(true);
    expect(await page.$eval('#more', (el) => el.getAttribute('data-state'))).toBe('open');
    await setData(page, '#more', 'open', false);
    expect(await page.$eval('#more-trigger', (el) => el.getAttribute('aria-expanded'))).toBe(
      'false',
    );
    expect(await recorded(page)).toEqual([{ open: true }]);
    await page.close();
  });

  it('clamps a closed read-more instead of hiding it', async () => {
    const { page } = await open(collapseMarkup("open: false, variant: 'read-more'"));
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).hidden)).toBe(false);
    expect(
      await page.$eval('#more-content', (el) => (el as HTMLElement).style.maxHeight),
    ).toContain('--apui-collapse-clamp-height');
    // Only max-height clamps: one short line isn't padded to the clamp.
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).style.minHeight)).toBe('');
    expect(
      await page.$eval('#more-content', (el) => el.getBoundingClientRect().height),
    ).toBeLessThan(64);
    await page.click('#more-trigger');
    await settle(page);
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).style.maxHeight)).toBe('');
    await page.close();
  });

  it('keeps its state through a morph', async () => {
    const { page, errors } = await open(collapseMarkup());
    await page.click('#more-trigger');
    await settle(page);
    await morph(page, '#more', collapseMarkup());
    expect(await page.$eval('#more-trigger', (el) => el.getAttribute('aria-expanded'))).toBe(
      'true',
    );
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).hidden)).toBe(false);
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
      join(__dirname, `fixtures/disclosure-${stack}.${stack === 'react' ? 'tsx' : 'ts'}`),
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

async function mountStack(stack: Stack, options: object) {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  await page.setContent(
    `<!doctype html><html><head><style>[hidden]{display:none!important}</style></head><body><div id="root"></div><script>${await fixture(stack)}</script></body></html>`,
  );
  await page.evaluate(
    (o) =>
      (
        window as unknown as { disclosureFixture: { mount(o: object): void } }
      ).disclosureFixture.mount(o),
    options,
  );
  await settle(page);
  return { page, errors };
}

const shown = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { disclosureFixture: { value?: unknown } }).disclosureFixture.value,
  );
const setParent = (page: Page, value: unknown) =>
  page.evaluate(
    (v) =>
      (window as unknown as { disclosureFixture: { set(v: unknown): void } }).disclosureFixture.set(
        v,
      ),
    value,
  );

describe.each(['react', 'vue'] as const)('accordion and collapse (%s)', (stack) => {
  it('renders the same parts, ARIA and ids as Alpine', async () => {
    const { page, errors } = await mountStack(stack, {
      widget: 'accordion',
      mode: 'controlled',
      initial: ['live'],
    });
    expect(await expanded(page)).toEqual(['trigger-live']);
    expect(await visiblePanels(page)).toEqual(['content-live']);
    expect(
      await page.$eval('#trigger-live', (el) => [
        el.getAttribute('data-part'),
        el.getAttribute('aria-controls'),
      ]),
    ).toEqual(['trigger', 'content-live']);
    expect(await page.$$eval('[data-part="chevron"]', (els) => els.length)).toBe(4);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens one item at a time when controlled, and follows the parent', async () => {
    const { page } = await mountStack(stack, {
      widget: 'accordion',
      mode: 'controlled',
      initial: ['live'],
    });
    await page.click('#trigger-owners');
    await settle(page);
    expect(await shown(page)).toEqual(['owners']);
    expect(await expanded(page)).toEqual(['trigger-owners']);
    await setParent(page, ['fees']);
    await settle(page);
    expect(await expanded(page)).toEqual(['trigger-fees']);
    await page.focus('#trigger-fees');
    await page.keyboard.press('Home');
    await settle(page);
    expect(await focusedId(page)).toBe('trigger-live');
    await page.close();
  });

  it('keeps several items open when uncontrolled with multiple', async () => {
    const { page } = await mountStack(stack, {
      widget: 'accordion',
      mode: 'uncontrolled',
      multiple: true,
      initial: ['live'],
    });
    await page.click('#trigger-fees');
    await settle(page);
    expect(await expanded(page)).toEqual(['trigger-live', 'trigger-fees']);
    await page.close();
  });

  it('toggles a collapse, scoped collapse with an icon part', async () => {
    const { page, errors } = await mountStack(stack, { widget: 'collapse', mode: 'controlled' });
    expect(
      await page.$eval('#more-trigger', (el) => [
        el.getAttribute('data-scope'),
        el.getAttribute('aria-expanded'),
      ]),
    ).toEqual(['collapse', 'false']);
    expect(
      await page.$$eval('[data-scope="collapse"][data-part="icon"]', (els) => els.length),
    ).toBe(1);
    await page.click('#more-trigger');
    await settle(page);
    expect(await shown(page)).toBe(true);
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).hidden)).toBe(false);
    await setParent(page, false);
    await settle(page);
    expect(await page.$eval('#more-trigger', (el) => el.getAttribute('aria-expanded'))).toBe(
      'false',
    );
    expect(errors).toEqual([]);
    await page.close();
  });

  it('clamps a closed read-more instead of hiding it', async () => {
    const { page } = await mountStack(stack, {
      widget: 'collapse',
      mode: 'uncontrolled',
      variant: 'read-more',
    });
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).hidden)).toBe(false);
    expect(
      await page.$eval('#more-content', (el) => (el as HTMLElement).style.maxHeight),
    ).toContain('--apui-collapse-clamp-height');
    expect(await page.$eval('#more-content', (el) => (el as HTMLElement).style.minHeight)).toBe('');
    await page.close();
  });
});
