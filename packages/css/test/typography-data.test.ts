/**
 * Heading, Text, ListItem, UserMenu (#58), Avatar and Badge (#61) in a real
 * browser (Chromium): the type scale, cut text, the row's stretched control,
 * the high-contrast edge, avatar layering and the Alpine-rescoped trigger.
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

describe('Heading', () => {
  it('sizes by data-size, not by level, and never goes past 600', async () => {
    const page = await open(
      '<h1 id="a" class="apui-heading" data-level="1" data-size="5">A</h1><h3 id="b" class="apui-heading" data-level="3" data-size="1">B</h3>',
    );
    expect(await style(page, '#a', 'font-size')).toBe('16px');
    expect(await style(page, '#b', 'font-size')).toBe('34px');
    expect(Number(await style(page, '#b', 'font-weight'))).toBeLessThanOrEqual(600);
    await page.close();
  });

  it('sets the eyebrow uppercase and muted', async () => {
    const page = await open(
      '<p id="e" data-scope="heading" data-part="eyebrow">Portfolio</p><h2 id="h" class="apui-heading" data-level="2" data-size="2">T</h2>',
    );
    expect(await style(page, '#e', 'text-transform')).toBe('uppercase');
    expect(await style(page, '#e', 'color')).not.toBe(await style(page, '#h', 'color'));
    await page.close();
  });
});

describe('Text', () => {
  it('mutes lead unless a tone is set, and truncates and clamps', async () => {
    const page = await open(`
      <p id="lead" class="apui-text" data-size="lead" data-tone="default">Lead</p>
      <p id="body" class="apui-text" data-size="md" data-tone="default">Body</p>
      <p id="err" class="apui-text" data-size="lead" data-tone="error">Err</p>
      <p id="cut" class="apui-text" data-truncate>Cut</p>
      <p id="clamp" class="apui-text" data-clamp="3" style="--apui-text-clamp: 3">Clamp</p>`);
    expect(await style(page, '#lead', 'color')).not.toBe(await style(page, '#body', 'color'));
    expect(await style(page, '#err', 'color')).not.toBe(await style(page, '#lead', 'color'));
    expect(await style(page, '#cut', 'text-overflow')).toBe('ellipsis');
    expect(await style(page, '#clamp', '-webkit-line-clamp')).toBe('3');
    await page.close();
  });
});

describe('ListItem', () => {
  it('stretches the row control over the row and keeps trailing above it', async () => {
    const page = await open(`
      <ul class="apui-list" data-variant="bordered">
        <li id="row" class="apui-list-item" data-interactive>
          <a id="title" data-scope="list-item" data-part="title" href="#">Olivia</a>
          <span id="trail" data-scope="list-item" data-part="trailing"><button id="act">More</button></span>
        </li>
        <li id="two" class="apui-list-item"><span data-scope="list-item" data-part="title">B</span></li>
      </ul>`);
    const row = (await page.$('#row'))!.boundingBox();
    const hit = await page.evaluate(() => {
      const box = document.querySelector('#row')!.getBoundingClientRect();
      return document.elementFromPoint(box.left + 4, box.top + 4)?.id;
    });
    expect(await row).not.toBeNull();
    expect(hit).toBe('title');
    const action = await page.evaluate(() => {
      const box = document.querySelector('#act')!.getBoundingClientRect();
      return document.elementFromPoint(box.left + 2, box.top + 2)?.id;
    });
    expect(action).toBe('act');
    expect(await style(page, '#two', 'border-top-style')).toBe('solid');
    await page.close();
  });
});

describe('Badge', () => {
  it('gains an edge on soft badges only in high contrast', async () => {
    const markup =
      '<span id="b" class="apui-badge" data-variant="soft" data-color="success" data-size="md"><span data-scope="badge" data-part="label">Paid</span></span>';
    const light = await open(markup);
    const high = await open(markup, 'data-theme="high-contrast"');
    expect(await style(light, '#b', 'border-top-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await style(light, '#b', 'outline-width')).toBe('0px');
    expect(await style(high, '#b', 'outline-width')).toBe('1px');
    expect(await style(high, '#b', 'outline-color')).not.toBe('rgba(0, 0, 0, 0)');
    await light.close();
    await high.close();
  });

  it('sizes by data-size', async () => {
    const page = await open(
      '<span id="s" class="apui-badge" data-size="sm">a</span><span id="l" class="apui-badge" data-size="lg">b</span>',
    );
    expect(await style(page, '#s', 'height')).toBe('18px');
    expect(await style(page, '#l', 'height')).toBe('24px');
    await page.close();
  });
});

describe('Avatar', () => {
  it('stacks the image over the initials and sizes by the control heights', async () => {
    const page = await open(`
      <span id="a" class="apui-avatar" data-size="xl" data-shape="circle" data-color="primary" role="img" aria-label="Olivia">
        <span id="i" data-scope="avatar" data-part="initials">OR</span>
        <img id="img" data-scope="avatar" data-part="image" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
        <span id="s" data-scope="avatar" data-part="status" data-status="online"></span>
      </span>`);
    expect(await style(page, '#a', 'width')).toBe('52px');
    expect(await style(page, '#i', 'grid-area')).toBe(await style(page, '#img', 'grid-area'));
    expect(await style(page, '#s', 'position')).toBe('absolute');
    await page.close();
  });

  it('overlaps avatars in a group, mirrored in RTL', async () => {
    const markup =
      '<span class="apui-avatar-group"><span id="one" class="apui-avatar" data-size="md">A</span><span id="two" class="apui-avatar" data-size="md">B</span></span>';
    const page = await open(markup);
    expect(await style(page, '#two', 'margin-left')).toBe('-9px');
    const rtl = await open(markup, 'data-theme="light" dir="rtl"');
    expect(await style(rtl, '#two', 'margin-right')).toBe('-9px');
    await page.close();
    await rtl.close();
  });
});

describe('UserMenu', () => {
  it('styles the trigger whether it carries its own scope or the menu machine’s', async () => {
    const page = await open(`
      <button id="own" type="button" data-scope="user-menu" data-part="trigger"><span data-scope="user-menu" data-part="identity">A</span></button>
      <button id="zag" type="button" data-scope="dropdown-menu" data-part="trigger"><span data-scope="user-menu" data-part="identity">A</span></button>`);
    for (const id of ['#own', '#zag']) {
      expect(await style(page, id, 'min-height')).toBe('44px');
      expect(await style(page, id, 'background-color')).toBe('rgba(0, 0, 0, 0)');
    }
    await page.close();
  });
});
