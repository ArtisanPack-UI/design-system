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
