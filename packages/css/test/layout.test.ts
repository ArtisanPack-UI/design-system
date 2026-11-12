/**
 * Accordion, Collapse, AppShell, PageHeader, Divider, Grid and Stack (#58)
 * in a real browser (Chromium): variants, states, RTL, and the layout the
 * primitives compute from their data attributes.
 */
import { chromium, type Browser, type Page } from 'playwright';

import { bundle } from '../build.mjs';

const apui = bundle();
let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
});

async function open(body: string, htmlAttributes = 'data-theme="light"', width = 1024) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${apui}</style></head><body style="margin:0">${body}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

const rect = (page: Page, selector: string) =>
  page.$eval(selector, (element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  });

const chevron = '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>';

const accordion = (variant = 'default') => `
  <div class="apui-accordion" data-scope="accordion" data-part="root" data-variant="${variant}">
    <div data-scope="accordion" data-part="item" id="i1" data-state="open">
      <h3 data-scope="accordion" data-part="title"><button id="t1" data-scope="accordion" data-part="trigger" type="button" aria-expanded="true">One<span id="c1" data-scope="accordion" data-part="chevron" aria-hidden="true">${chevron}</span></button></h3>
      <div id="p1" data-scope="accordion" data-part="content" role="region">Answer</div>
    </div>
    <div data-scope="accordion" data-part="item" id="i2" data-state="closed">
      <h3 data-scope="accordion" data-part="title"><button id="t2" data-scope="accordion" data-part="trigger" type="button" aria-expanded="false" disabled>Two<span id="c2" data-scope="accordion" data-part="chevron" aria-hidden="true">${chevron}</span></button></h3>
      <div data-scope="accordion" data-part="content" role="region" hidden>Answer</div>
    </div>
  </div>`;

describe('Accordion', () => {
  it('draws one container with an edge between items, and turns the open chevron', async () => {
    const page = await open(accordion());
    expect(await style(page, '.apui-accordion', 'border-top-width')).toBe('1px');
    expect(await style(page, '#i2', 'border-top-width')).toBe('1px');
    expect(await style(page, '#i1', 'border-top-width')).toBe('0px');
    expect(await style(page, '#c1', 'rotate')).toBe('180deg');
    expect(await style(page, '#c2', 'rotate')).toBe('none');
    expect(await style(page, '#t1', 'text-align')).toBe('start');
    await page.close();
  });

  it('separates items into their own containers, and drops the container when flush', async () => {
    const separated = await open(accordion('separated'));
    expect(await style(separated, '.apui-accordion', 'border-top-width')).toBe('0px');
    expect(await style(separated, '#i1', 'border-top-width')).toBe('1px');
    expect(await style(separated, '.apui-accordion', 'row-gap')).toBe('8px');
    await separated.close();
    const flush = await open(accordion('flush'));
    expect(await style(flush, '.apui-accordion', 'border-top-width')).toBe('0px');
    expect(await style(flush, '#t1', 'padding-inline-start')).toBe('0px');
    expect(await style(flush, '#p1', 'padding-inline-start')).toBe('0px');
    await flush.close();
  });

  it('dims disabled triggers and insets the focus ring', async () => {
    const page = await open(accordion());
    expect(await style(page, '#t2', 'cursor')).toBe('not-allowed');
    expect(await style(page, '#t2', 'color')).not.toBe(await style(page, '#t1', 'color'));
    await page.focus('#t1');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    expect(await style(page, '#t1', 'box-shadow')).toContain('inset');
    await page.close();
  });
});

describe('Collapse', () => {
  const collapse = (variant: string, state: string) => `
    <div class="apui-collapse" data-scope="collapse" data-part="root" data-variant="${variant}" data-state="${state}">
      <div id="content" data-scope="collapse" data-part="content">Text<span id="fade" data-scope="collapse" data-part="fade" aria-hidden="true"></span></div>
      <button id="trigger" data-scope="collapse" data-part="trigger" type="button" aria-expanded="${state === 'open'}">Read more<span id="icon" data-scope="collapse" data-part="icon" aria-hidden="true">${chevron}</span></button>
    </div>`;

  it('fades a closed read-more and drops the fade once open', async () => {
    const closed = await open(collapse('read-more', 'closed'));
    expect(await style(closed, '#fade', 'visibility')).toBe('visible');
    expect(await style(closed, '#fade', 'position')).toBe('absolute');
    expect(await style(closed, '#icon', 'rotate')).toBe('none');
    await closed.close();
    const opened = await open(collapse('read-more', 'open'));
    expect(await style(opened, '#fade', 'visibility')).toBe('hidden');
    expect(await style(opened, '#icon', 'rotate')).toBe('180deg');
    await opened.close();
  });

  it('spaces a section region under its trigger, in the primary text color', async () => {
    const page = await open(collapse('section', 'open'));
    expect(await style(page, '#content', 'margin-top')).toBe('12px');
    expect(await style(page, '#trigger', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    await page.close();
  });
});

const shell = (attributes = '') => `
  <div class="apui-app-shell" ${attributes}>
    <a id="skip" data-scope="app-shell" data-part="skip-link" href="#main">Skip to main content</a>
    <aside id="sidebar" data-scope="app-shell" data-part="sidebar" aria-label="Sidebar">
      <div data-scope="app-shell" data-part="brand">Apexify</div>
      <nav class="apui-menu"><ul data-scope="menu" data-part="list"><li><a id="item" data-scope="menu" data-part="item" href="#"><span data-scope="menu" data-part="icon">${chevron}</span><span id="text" data-scope="menu" data-part="item-text">Dashboard</span></a></li></ul></nav>
      <div data-scope="app-shell" data-part="footer"><button id="toggle" data-scope="app-shell" data-part="collapse-trigger" type="button" aria-label="Collapse sidebar" aria-pressed="${attributes.includes('data-collapsed')}">${chevron}</button></div>
    </aside>
    <main id="main" data-scope="app-shell" data-part="main" tabindex="-1"><div data-scope="app-shell" data-part="content">Content</div></main>
  </div>`;

describe('AppShell', () => {
  it('lays out the sidebar at the inline start with the gutter around the islands', async () => {
    const page = await open(shell());
    const sidebar = await rect(page, '#sidebar');
    const main = await rect(page, '#main');
    expect(sidebar.x).toBe(12);
    expect(sidebar.width).toBe(248);
    expect(main.x).toBe(12 + 248 + 12);
    await page.close();
  });

  it('moves the sidebar to the inline end in RTL', async () => {
    const page = await open(shell(), 'data-theme="light" dir="rtl"');
    const sidebar = await rect(page, '#sidebar');
    expect(sidebar.x + sidebar.width).toBe(1024 - 12);
    await page.close();
  });

  it('collapses to icons, keeping the labels in the accessibility tree', async () => {
    const page = await open(shell('data-collapsed data-collapsible'));
    expect((await rect(page, '#sidebar')).width).toBe(64);
    expect(await style(page, '#text', 'position')).toBe('absolute');
    expect(await style(page, '#text', 'display')).not.toBe('none');
    expect(await style(page, '#toggle svg', 'rotate')).toBe('180deg');
    await page.close();
  });

  it('takes the sidebar width and gutter from custom properties', async () => {
    const page = await open(
      shell('style="--apui-sidebar-width: 300px; --apui-shell-gutter: 20px"'),
    );
    const sidebar = await rect(page, '#sidebar');
    expect(sidebar.x).toBe(20);
    expect(sidebar.width).toBe(300);
    await page.close();
  });

  it('hides the skip link until it is focused', async () => {
    const page = await open(shell());
    expect((await rect(page, '#skip')).width).toBeLessThanOrEqual(1);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('skip');
    expect((await rect(page, '#skip')).width).toBeGreaterThan(40);
    await page.close();
  });

  it('stacks the islands on a narrow viewport', async () => {
    const page = await open(shell(), 'data-theme="light"', 375);
    const sidebar = await rect(page, '#sidebar');
    const main = await rect(page, '#main');
    expect(sidebar.width).toBe(375 - 24);
    expect(main.y).toBeGreaterThan(sidebar.y + sidebar.height - 1);
    await page.close();
  });
});

describe('PageHeader', () => {
  it('sets the title in heading-xl and keeps the description to the measure', async () => {
    const page = await open(`
      <div class="apui-page-header">
        <div data-scope="page-header" data-part="row">
          <div><h1 id="title" data-scope="page-header" data-part="title">Dashboard</h1><p id="desc" data-scope="page-header" data-part="description">Income</p></div>
          <div id="actions" data-scope="page-header" data-part="actions"><button>Share</button></div>
        </div>
      </div>`);
    expect(await style(page, '#title', 'font-size')).toBe('28px');
    expect(await style(page, '#title', 'margin-top')).toBe('0px');
    expect(await style(page, '#desc', 'max-width')).not.toBe('none');
    const title = await rect(page, '#title');
    const actions = await rect(page, '#actions');
    expect(actions.x).toBeGreaterThan(title.x + title.width);
    await page.close();
  });
});

describe('Divider', () => {
  it('draws a muted rule, a strong one, and a vertical one', async () => {
    const page = await open(`
      <hr id="h" class="apui-divider" data-orientation="horizontal" data-strength="subtle">
      <hr id="s" class="apui-divider" data-orientation="horizontal" data-strength="strong">
      <div style="display:flex;height:40px"><div id="v" class="apui-divider" role="separator" aria-orientation="vertical" data-orientation="vertical" data-strength="subtle"></div></div>`);
    expect(await style(page, '#h', 'height')).toBe('1px');
    expect(await style(page, '#h', 'border-top-width')).toBe('0px');
    expect(await style(page, '#s', 'background-color')).not.toBe(
      await style(page, '#h', 'background-color'),
    );
    expect(await style(page, '#v', 'width')).toBe('1px');
    expect((await rect(page, '#v')).height).toBe(40);
    await page.close();
  });

  it('keeps its rules drawn in a parent that shrinks to fit', async () => {
    const page = await open(`
      <div style="display:inline-flex"><hr id="h" class="apui-divider" data-orientation="horizontal"></div>
      <div style="display:inline-flex"><div id="l" class="apui-divider" role="separator" data-orientation="horizontal" data-align="center"><span id="ll" data-scope="divider" data-part="label">or</span></div></div>`);
    expect((await rect(page, '#h')).width).toBe(48);
    const labelled = await rect(page, '#l');
    const label = await rect(page, '#ll');
    expect(labelled.width).toBe(label.width + 2 * (24 + 12));
    await page.close();
  });

  it('puts a label between two rules, at the start with data-align', async () => {
    const page = await open(`
      <div id="c" class="apui-divider" role="separator" data-orientation="horizontal" data-align="center"><span id="cl" data-scope="divider" data-part="label">or</span></div>
      <div id="s" class="apui-divider" role="separator" data-orientation="horizontal" data-align="start"><span id="sl" data-scope="divider" data-part="label">or</span></div>`);
    expect(await style(page, '#c', 'display')).toBe('flex');
    expect(await style(page, '#c', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    const centered = await rect(page, '#cl');
    expect(Math.abs(centered.x + centered.width / 2 - 512)).toBeLessThan(2);
    expect((await rect(page, '#sl')).x).toBe(16 + 12);
    await page.close();
  });
});

describe('Grid', () => {
  const items = (n: number) =>
    Array.from({ length: n }, (_, i) => `<div class="cell" id="g${i}">${i}</div>`).join('');

  it('lays out equal columns with the gap step', async () => {
    const page = await open(
      `<div class="apui-grid" data-columns="3" data-gap="4" style="width:332px">${items(3)}</div>`,
    );
    expect(await style(page, '.apui-grid', 'column-gap')).toBe('16px');
    const widths = await page.$$eval('.cell', (els) =>
      els.map((el) => el.getBoundingClientRect().width),
    );
    expect(widths).toEqual([100, 100, 100]);
    await page.close();
  });

  it('drops columns rather than narrowing past minItemWidth', async () => {
    const page = await open(
      `<div class="apui-grid" data-columns="4" data-gap="4" style="width:500px; --apui-grid-min-item-width: 200px">${items(4)}</div>`,
    );
    const tops = await page.$$eval('.cell', (els) => els.map((el) => el.getBoundingClientRect().y));
    expect(tops[0]).toBe(tops[1]);
    expect(tops[2]).toBeGreaterThan(tops[1]!);
    await page.close();
  });

  it('starts the columns at the inline end in RTL', async () => {
    const page = await open(
      `<div class="apui-grid" data-columns="2" data-gap="0" style="width:400px">${items(2)}</div>`,
      'data-theme="light" dir="rtl"',
    );
    const [first, second] = [await rect(page, '#g0'), await rect(page, '#g1')];
    expect(first.width).toBe(200);
    expect(first.x).toBeGreaterThan(second.x);
    await page.close();
  });
});

describe('Stack', () => {
  it('stacks in a column by default, and in a row that follows the text direction', async () => {
    const column = await open(
      '<div class="apui-stack" data-gap="2"><span>a</span><span>b</span></div>',
    );
    expect(await style(column, '.apui-stack', 'flex-direction')).toBe('column');
    expect(await style(column, '.apui-stack', 'row-gap')).toBe('8px');
    await column.close();
    const row = await open(
      '<div class="apui-stack" data-orientation="horizontal" data-gap="4" data-justify="between" data-align="center" data-wrap style="width:300px"><span id="a">a</span><span id="b">b</span></div>',
      'data-theme="light" dir="rtl"',
    );
    expect(await style(row, '.apui-stack', 'flex-direction')).toBe('row');
    expect(await style(row, '.apui-stack', 'justify-content')).toBe('space-between');
    expect(await style(row, '.apui-stack', 'align-items')).toBe('center');
    expect(await style(row, '.apui-stack', 'flex-wrap')).toBe('wrap');
    expect((await rect(row, '#a')).x).toBeGreaterThan((await rect(row, '#b')).x);
    await row.close();
  });
});
