/**
 * Tabs, Menu and Navbar CSS (#56) in Chromium: the selected tab, the
 * current menu item and link, the sub-menu chevron in both directions, and
 * glass on the Navbar.
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

async function open(body: string, htmlAttributes = 'data-theme="light"'): Promise<Page> {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html ${htmlAttributes}><head><style>${apui}</style></head><body>${body}</body></html>`,
  );
  return page;
}

const style = (page: Page, selector: string, property: string) =>
  page.$eval(
    selector,
    (element, prop) => getComputedStyle(element).getPropertyValue(prop).trim(),
    property,
  );

/** A token's computed color, through a probe element. */
const token = (page: Page, name: string, property = 'background-color') =>
  page.evaluate(
    ([n, p]) => {
      const probe = document.createElement('div');
      probe.style.setProperty(p!, `var(${n})`);
      document.body.append(probe);
      const value = getComputedStyle(probe).getPropertyValue(p!);
      probe.remove();
      return value.trim();
    },
    [name, property],
  );

const tabs = (attrs = '') => `
  <div class="apui-tabs" data-scope="tabs" data-part="root" data-variant="segmented" data-size="md" data-orientation="horizontal" ${attrs}>
    <div data-scope="tabs" data-part="list" role="tablist">
      <button data-scope="tabs" data-part="trigger" role="tab" id="on" aria-selected="true">Overview<span data-scope="tabs" data-part="count" id="on-count">4</span></button>
      <button data-scope="tabs" data-part="trigger" role="tab" id="off" aria-selected="false">History<span data-scope="tabs" data-part="count" id="off-count">2</span></button>
      <button data-scope="tabs" data-part="trigger" role="tab" id="dis" aria-selected="false" disabled aria-disabled="true">Archived</button>
    </div>
    <div data-scope="tabs" data-part="content" role="tabpanel" id="panel">Panel</div>
  </div>`;

describe('Tabs', () => {
  it('raises the selected segmented tab and tints its count', async () => {
    const page = await open(tabs());
    expect(await style(page, '#on', 'background-color')).toBe(
      await token(page, '--apui-surface-raised'),
    );
    expect(await style(page, '[data-part="list"]', 'background-color')).toBe(
      await token(page, '--apui-surface-sunken'),
    );
    expect(await style(page, '#on-count', 'background-color')).toBe(
      await token(page, '--apui-color-primary-soft'),
    );
    expect(await style(page, '#off-count', 'background-color')).toBe(
      await token(page, '--apui-color-neutral-soft'),
    );
    expect(await style(page, '#dis', 'color')).toBe(
      await token(page, '--apui-text-disabled', 'color'),
    );
    await page.close();
  });

  it('draws the underline edge on the selected tab, below it', async () => {
    const page = await open(tabs().replace('data-variant="segmented"', 'data-variant="underline"'));
    expect(await style(page, '[data-part="list"]', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await style(page, '#on', 'box-shadow')).toMatch(/inset/);
    expect(await style(page, '#off', 'box-shadow')).toBe('none');
    await page.close();
  });

  it('stacks a vertical tablist beside its panel', async () => {
    const page = await open(
      tabs().replace('data-orientation="horizontal"', 'data-orientation="vertical"'),
    );
    expect(await style(page, '.apui-tabs', 'flex-direction')).toBe('row');
    expect(await style(page, '[data-part="list"]', 'flex-direction')).toBe('column');
    await page.close();
  });

  it('shows a ring on the focused tab', async () => {
    const page = await open(tabs());
    await page.focus('#off');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    expect(await style(page, '#off', 'box-shadow')).not.toBe('none');
    await page.close();
  });
});

describe('Tabs focus ring', () => {
  const underline = (orientation = 'horizontal') =>
    tabs()
      .replace('data-variant="segmented"', 'data-variant="underline"')
      .replace('data-orientation="horizontal"', `data-orientation="${orientation}"`)
      .replace('id="on"', 'id="on" tabindex="0"')
      .replace(/id="(off|dis)"/g, 'id="$1" tabindex="-1"');

  it('keeps the underline under the ring on the focused selected tab', async () => {
    const page = await open(`<button id="before">x</button>${underline()}`);
    await page.focus('#before');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('on');
    const shadow = await style(page, '#on', 'box-shadow');
    // Two inset shadows: the selected edge and the ring.
    expect(shadow.match(/inset/g)).toHaveLength(2);
    await page.close();
  });

  it('shows the ring on a focused selected vertical underline tab', async () => {
    const page = await open(`<button id="before">x</button>${underline('vertical')}`);
    await page.focus('#before');
    await page.keyboard.press('Tab');
    expect(await style(page, '#on', 'box-shadow')).not.toBe('none');
    await page.close();
  });

  it('keeps a Highlight outline on a focused selected underline tab in forced colors', async () => {
    const page = await open(`<button id="before">x</button>${underline()}`);
    await page.emulateMedia({ forcedColors: 'active' });
    await page.focus('#before');
    await page.keyboard.press('Tab');
    expect(await style(page, '#on', 'outline-style')).toBe('solid');
    expect(await style(page, '#on', 'outline-width')).toBe('2px');
    await page.close();
  });

  it('fits the segmented ring inside the scrolling track, so it is not clipped', async () => {
    const page = await open(tabs());
    const [list, trigger, offset, width] = await page.evaluate(() => {
      const t = document.querySelector('#off')!;
      const l = document.querySelector('[data-part="list"]')!;
      const cs = getComputedStyle(t);
      return [
        l.getBoundingClientRect().toJSON(),
        t.getBoundingClientRect().toJSON(),
        parseFloat(cs.getPropertyValue('--apui-focus-ring-offset')),
        parseFloat(cs.getPropertyValue('--apui-focus-ring-width')),
      ] as const;
    });
    const reach = offset + width;
    expect(trigger.top - reach).toBeGreaterThanOrEqual(list.top);
    expect(trigger.bottom + reach).toBeLessThanOrEqual(list.bottom);
    await page.close();
  });
});

const menu = `
  <nav class="apui-menu" aria-label="Main">
    <ul data-scope="menu" data-part="list">
      <li><a data-scope="menu" data-part="item" id="plain" href="#"><span data-scope="menu" data-part="item-text">Dashboard</span></a></li>
      <li>
        <button data-scope="menu" data-part="item" id="toggle" aria-expanded="true" aria-controls="sub">
          <span data-scope="menu" data-part="item-text">Properties</span>
          <span data-scope="menu" data-part="chevron" aria-hidden="true" data-mirror><svg id="chevron" viewBox="0 0 24 24"></svg></span>
        </button>
        <ul data-scope="menu" data-part="sub" id="sub">
          <li><a data-scope="menu" data-part="item" id="current" href="#" aria-current="page"><span data-scope="menu" data-part="item-text">Lakeview</span></a></li>
        </ul>
      </li>
      <li data-scope="menu" data-part="title" id="title">Settings</li>
      <li data-scope="menu" data-part="separator" aria-hidden="true" id="separator"></li>
      <li><a data-scope="menu" data-part="item" id="disabled" aria-disabled="true"><span data-scope="menu" data-part="item-text">Billing</span></a></li>
    </ul>
  </nav>`;

describe('Menu', () => {
  it('marks the current item with the selected surface', async () => {
    const page = await open(menu);
    expect(await style(page, '#current', 'background-color')).toBe(
      await token(page, '--apui-selected-bg'),
    );
    expect(await style(page, '#plain', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await style(page, '#disabled', 'color')).toBe(
      await token(page, '--apui-text-disabled', 'color'),
    );
    await page.close();
  });

  it('makes sub-menu items smaller and indents them', async () => {
    const page = await open(menu);
    expect(await style(page, '#current', 'height')).toBe(
      await token(page, '--apui-control-height-sm', 'height'),
    );
    expect(await style(page, '#plain', 'height')).toBe(
      await token(page, '--apui-control-height-md', 'height'),
    );
    expect(await style(page, '#sub', 'padding-inline-start')).toBe('20px');
    expect(await style(page, '#title', 'text-transform')).toBe('uppercase');
    expect(await style(page, '#separator', 'height')).toBe('1px');
    await page.close();
  });

  it.each([
    ['ltr', '90deg', 'none'],
    ['rtl', '-90deg', '-1 1'],
  ])('turns the open chevron down (%s)', async (dir, rotate, scale) => {
    const page = await open(menu, `data-theme="light" dir="${dir}"`);
    expect(await style(page, '#chevron', 'rotate')).toBe(rotate);
    expect(await style(page, '#chevron', 'scale')).toBe(scale);
    await page.close();
  });
});

const navbar = (attrs = '') => `
  <header class="apui-navbar" data-layout="bar" data-surface="default" ${attrs}>
    <div data-scope="navbar" data-part="brand">Horizon</div>
    <nav data-scope="navbar" data-part="links" aria-label="Main">
      <a data-scope="navbar" data-part="link" href="#" id="current" aria-current="page">Properties</a>
      <a data-scope="navbar" data-part="link" href="#" id="other">Analytics</a>
    </nav>
    <div data-scope="navbar" data-part="actions" id="actions"><button>Sign in</button></div>
  </header>`;

describe('Navbar', () => {
  it('marks the current link and pushes the actions to the end', async () => {
    const page = await open(`<div style="inline-size: 900px">${navbar()}</div>`);
    expect(await style(page, '#current', 'background-color')).toBe(
      await token(page, '--apui-surface-sunken'),
    );
    expect(await style(page, '#other', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    const [end, bar] = await Promise.all(
      ['#actions', '.apui-navbar'].map((sel) =>
        page.$eval(sel, (el) => el.getBoundingClientRect().right),
      ),
    );
    expect(Math.round(bar! - end!)).toBe(16);
    await page.close();
  });

  it('sticks only with data-sticky, and rounds an island', async () => {
    const page = await open(navbar('data-sticky'));
    expect(await style(page, '.apui-navbar', 'position')).toBe('sticky');
    await page.close();
    const island = await open(navbar('data-layout="island"').replace('data-layout="bar" ', ''));
    expect(await style(island, '.apui-navbar', 'position')).toBe('static');
    expect(await style(island, '.apui-navbar', 'border-start-start-radius')).toBe('14px');
    await island.close();
  });

  it('uses the glass surface', async () => {
    const page = await open(navbar().replace('data-surface="default"', 'data-surface="glass"'));
    expect(await style(page, '.apui-navbar', 'backdrop-filter')).toMatch(/blur/);
    await page.close();
  });

  it('scrolls the links rather than wrapping them on a narrow bar', async () => {
    const page = await open(`<div style="inline-size: 240px">${navbar()}</div>`);
    expect(await style(page, '[data-part="links"]', 'overflow-x')).toBe('auto');
    expect(await style(page, '#other', 'white-space')).toBe('nowrap');
    const height = await page.$eval('.apui-navbar', (el) => el.getBoundingClientRect().height);
    expect(height).toBe(56);
    await page.close();
  });
});
