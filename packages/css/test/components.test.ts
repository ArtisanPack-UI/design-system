/**
 * Component CSS in a real browser (Chromium): interactions between
 * components and states that a single stylesheet read can miss.
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

const checkbox = (state = 'unchecked', input = '') => `
  <div class="apui-checkbox" data-state="${state}">
    <span data-scope="checkbox" data-part="box">
      <input type="checkbox" data-scope="checkbox" data-part="control" id="c" ${input} />
      <span data-scope="checkbox" data-part="indicator" aria-hidden="true">
        <svg data-icon="check" viewBox="0 0 24 24"></svg><svg data-icon="minus" viewBox="0 0 24 24"></svg>
      </span>
    </span>
    <label data-scope="checkbox" data-part="label" for="c">Label</label>
  </div>`;

describe('Checkbox', () => {
  it('keeps its control over the box inside a Card body', async () => {
    const page = await open(
      `<div class="apui-card" data-surface="default"><div data-scope="card" data-part="body">${checkbox()}</div></div>`,
    );
    expect(await style(page, '[data-part="control"]', 'position')).toBe('absolute');
    await page.close();
  });

  it('shows the dash while indeterminate and the check once checked', async () => {
    const page = await open(checkbox('indeterminate'));
    const display = (icon: string) => style(page, `svg[data-icon="${icon}"]`, 'display');
    expect(await display('minus')).toBe('block');
    expect(await display('check')).toBe('none');

    // A click clears the native property and checks it; the stacks then set data-state.
    await page.click('[data-part="control"]');
    await page.$eval('.apui-checkbox', (root) => root.setAttribute('data-state', 'checked'));
    expect(await display('check')).not.toBe('none');
    expect(await display('minus')).toBe('none');
    expect(await style(page, '[data-part="indicator"]', 'opacity')).toBe('1');
    await page.close();
  });

  it('reads the native indeterminate property without data-state', async () => {
    const page = await open(checkbox());
    await page.$eval('input', (input) => {
      (input as HTMLInputElement).indeterminate = true;
    });
    expect(await style(page, 'svg[data-icon="minus"]', 'display')).toBe('block');
    expect(await style(page, '[data-part="indicator"]', 'opacity')).toBe('1');
    await page.close();
  });
});

describe('Select', () => {
  const select = (attributes = '') => `
    <div class="apui-select" data-size="md" ${attributes}>
      <div data-scope="select" data-part="box">
        <select data-scope="select" data-part="control" ${attributes ? 'disabled' : ''}>
          <option value="">Select…</option><option value="a">A</option>
        </select>
      </div>
    </div>`;

  it('mutes the placeholder, but a disabled select uses the disabled color', async () => {
    const page = await open(`${select()}<p id="muted" style="color: var(--apui-text-muted)"></p>`);
    expect(await style(page, 'select', 'color')).toBe(await style(page, '#muted', 'color'));
    await page.close();

    const disabled = await open(
      `${select('data-disabled')}<p id="off" style="color: var(--apui-text-disabled)"></p>`,
    );
    expect(await style(disabled, 'select', 'color')).toBe(await style(disabled, '#off', 'color'));
    await disabled.close();
  });
});

describe('Button', () => {
  it('ignores pointer input on a disabled link and while loading', async () => {
    const page = await open(`
      <a class="apui-button" id="link" aria-disabled="true" data-variant="solid" data-size="md">Link</a>
      <button class="apui-button" id="busy" aria-busy="true" data-variant="solid" data-size="md">Busy</button>`);
    expect(await style(page, '#link', 'pointer-events')).toBe('none');
    expect(await style(page, '#busy', 'pointer-events')).toBe('none');
    await page.close();
  });
});

describe('Button xs hit area', () => {
  it.each(['ltr', 'rtl'])('extends a 16px button to a centered 24px target (%s)', async (dir) => {
    const page = await open(
      `<button class="apui-button" data-size="xs" data-icon-only data-variant="solid" style="--apui-control-height-xs: 16px; margin: 40px"></button>`,
      `data-theme="light" dir="${dir}"`,
    );
    const hits = await page.$eval('.apui-button', (button) => {
      const box = button.getBoundingClientRect();
      const y = box.top + box.height / 2;
      const x = box.left + box.width / 2;
      const at = (px: number, py: number) => document.elementFromPoint(px, py) === button;
      return {
        start: at(box.left - 3, y),
        end: at(box.right + 3, y),
        top: at(x, box.top - 3),
        bottom: at(x, box.bottom + 3),
        outside: at(box.left - 6, y),
      };
    });
    expect(hits).toEqual({ start: true, end: true, top: true, bottom: true, outside: false });
    await page.close();
  });
});

const dialog = (attrs = '', header = '') => `
  <div data-scope="dialog" data-part="positioner" style="position: static">
    <div class="apui-dialog" data-scope="dialog" data-part="content" role="dialog" ${attrs}>
      <div data-scope="dialog" data-part="header">
        ${header}
        <h2 data-scope="dialog" data-part="title">Invite member</h2>
        <p data-scope="dialog" data-part="description">They'll get an email.</p>
        <button class="apui-button" data-scope="dialog" data-part="close-trigger">x</button>
      </div>
    </div>
  </div>`;

describe('Dialog', () => {
  it('stays hidden while the machine sets hidden, though it sets display', async () => {
    const page = await open(dialog('hidden'));
    expect(await style(page, '.apui-dialog', 'display')).toBe('none');
    await page.close();
  });

  it('sizes the panel from data-size', async () => {
    for (const [size, width] of [
      ['sm', '360px'],
      ['md', '480px'],
      ['lg', '640px'],
    ]) {
      const page = await open(dialog(`data-size="${size}"`));
      expect(await style(page, '.apui-dialog', 'width')).toBe(width);
      await page.close();
    }
  });

  it('puts the text in the middle column after an icon, and first without one', async () => {
    const icon =
      '<span data-scope="dialog" data-part="icon"><svg viewBox="0 0 24 24"></svg></span>';
    const withIcon = await open(dialog('data-color="error"', icon));
    expect(await style(withIcon, '[data-part="title"]', 'grid-column-start')).toBe('2');
    expect(await style(withIcon, '[data-part="icon"]', 'background-color')).not.toBe(
      'rgba(0, 0, 0, 0)',
    );
    await withIcon.close();
    const without = await open(dialog());
    const left = (selector: string) =>
      without.$eval(selector, (el) => Math.round(el.getBoundingClientRect().left));
    expect(await left('[data-part="title"]')).toBe(await left('[data-part="description"]'));
    await without.close();
  });
});

const menuItem = (attrs = '', text = 'Edit') => `
  <div data-scope="dropdown-menu" data-part="item" role="menuitem" ${attrs}>
    <span data-scope="dropdown-menu" data-part="item-indicator" hidden>✓</span>
    <span data-scope="dropdown-menu" data-part="item-text">${text}</span>
  </div>`;

describe('DropdownMenu', () => {
  it('keeps the check column while unchecked, so labels line up', async () => {
    const page = await open(
      `<div class="apui-dropdown-menu" data-scope="dropdown-menu" data-part="content">${menuItem()}</div>`,
    );
    expect(await style(page, '[data-part="item-indicator"]', 'visibility')).toBe('hidden');
    expect(await style(page, '[data-part="item-indicator"]', 'width')).toBe('16px');
    await page.close();
  });

  it('tints checked, danger and highlighted items', async () => {
    const page = await open(
      `<div class="apui-dropdown-menu">
        ${menuItem('id="checked" aria-checked="true"')}
        ${menuItem('id="danger" data-color="error"')}
        ${menuItem('id="plain"')}
        ${menuItem('id="highlighted" data-highlighted')}
      </div>`,
    );
    const plain = await style(page, '#plain', 'background-color');
    expect(await style(page, '#checked', 'background-color')).not.toBe(plain);
    expect(await style(page, '#highlighted', 'background-color')).not.toBe(plain);
    expect(await style(page, '#danger', 'color')).not.toBe(await style(page, '#plain', 'color'));
    await page.close();
  });
});

const toastMarkup = (attrs = '') => `
  <div class="apui-toast" data-scope="toast" data-part="root" role="status" ${attrs}>
    <span data-scope="toast" data-part="icon"><svg viewBox="0 0 24 24"></svg></span>
    <p data-scope="toast" data-part="title">Listing saved</p>
  </div>`;

describe('Toast', () => {
  it('tints the icon from data-color, muted when neutral', async () => {
    const page = await open(
      `<div id="success">${toastMarkup('data-color="success"')}</div><div id="neutral">${toastMarkup('data-color="neutral"')}</div>`,
    );
    expect(await style(page, '#success [data-part="icon"]', 'color')).not.toBe(
      await style(page, '#neutral [data-part="icon"]', 'color'),
    );
    await page.close();
  });

  it('keeps a hidden close trigger hidden, though it is a Button', async () => {
    const page = await open(
      toastMarkup().replace(
        '</div>',
        '<button class="apui-button" data-scope="toast" data-part="close-trigger" hidden>x</button></div>',
      ),
    );
    expect(await style(page, '[data-part="close-trigger"]', 'display')).toBe('none');
    await page.close();
  });

  it('uses the inverse surface and text for the inverse variant', async () => {
    const page = await open(
      `<div id="a">${toastMarkup('data-variant="default"')}</div><div id="b">${toastMarkup('data-variant="inverse"')}</div>`,
    );
    expect(await style(page, '#b .apui-toast', 'background-color')).not.toBe(
      await style(page, '#a .apui-toast', 'background-color'),
    );
    expect(await style(page, '#b [data-part="title"]', 'color')).not.toBe(
      await style(page, '#a [data-part="title"]', 'color'),
    );
    await page.close();
  });

  it('stacks toasts in the region through the properties Zag writes', async () => {
    const page = await open(
      `<div data-scope="toast" data-part="group" style="position: fixed; bottom: 0">
        ${toastMarkup('style="position: absolute; --y: 12px; --opacity: 0.5; --x: 0"')}
      </div>`,
    );
    expect(await style(page, '.apui-toast', 'opacity')).toBe('0.5');
    expect(await style(page, '.apui-toast', 'translate')).toBe('0px 12px');
    await page.close();
  });
});
