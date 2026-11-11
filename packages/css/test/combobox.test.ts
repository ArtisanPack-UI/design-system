/**
 * Combobox (#54) and its Tags mode in Chromium: the field anatomy it shares
 * with Input (field.css), chips, the listbox and its states.
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

const combobox = (root = '', chips = '') => `
  <div class="apui-combobox" data-scope="combobox" data-part="root" data-size="md" ${root} style="inline-size: 320px">
    <label data-scope="combobox" data-part="label" for="c">Tags</label>
    <div data-scope="combobox" data-part="box">
      ${chips}
      <input id="c" data-scope="combobox" data-part="control" placeholder="Add a tag…" />
      <button type="button" data-scope="combobox" data-part="trigger" tabindex="-1" aria-label="Show options"><svg viewBox="0 0 24 24"></svg></button>
    </div>
    <p data-scope="combobox" data-part="hint">Press Enter to add.</p>
    <div data-scope="combobox" data-part="positioner">
      <div data-scope="combobox" data-part="content" role="listbox" data-state="open">
        <div data-scope="combobox" data-part="item" role="option" data-state="unchecked" id="one">
          <span data-scope="combobox" data-part="item-indicator" hidden><svg viewBox="0 0 24 24"></svg></span>
          <span data-scope="combobox" data-part="item-text"><mark data-scope="combobox" data-part="mark">Ga</mark>rden<span data-scope="combobox" data-part="item-description">Outdoor</span></span>
        </div>
        <div data-scope="combobox" data-part="item" role="option" hidden id="gone">Gone</div>
        <div data-scope="combobox" data-part="item" role="option" data-create id="create"><span data-scope="combobox" data-part="item-text">Create “Ga”</span></div>
      </div>
    </div>
  </div>`;

const chip = (label: string, color = '') =>
  `<span data-scope="combobox" data-part="chip" ${color ? `data-color="${color}"` : ''}>${label}<button type="button" data-scope="combobox" data-part="chip-remove" aria-label="Remove ${label}"><svg viewBox="0 0 24 24"></svg></button></span>`;

describe('Combobox', () => {
  it('shares the field anatomy: the box takes the border and the control height', async () => {
    const page = await open(combobox());
    expect(await style(page, '[data-part="box"]', 'block-size')).toBe('36px');
    expect(await style(page, '[data-part="box"]', 'border-top-style')).toBe('solid');
    expect(await style(page, '[data-part="control"]', 'border-top-style')).toBe('none');
    expect(await style(page, '[data-part="label"]', 'font-weight')).toBe('500');
    await page.close();
  });

  it('grows the box to wrap chips with multiple', async () => {
    const chips = ['Downtown', 'Pet friendly', 'Rooftop', 'Under $300k', 'Garden'].map((label) =>
      chip(label, 'success'),
    );
    const page = await open(combobox('data-multiple', chips.join('')));
    const height = await page.$eval('[data-part="box"]', (el) => el.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(36);
    expect(await style(page, '[data-part="chip"]', 'block-size')).toBe('24px');
    expect(await style(page, '[data-part="chip"]', 'background-color')).toBe(
      await page.evaluate(() => {
        const probe = document.createElement('i');
        probe.style.color = 'var(--apui-color-success-soft)';
        document.body.append(probe);
        return getComputedStyle(probe).color;
      }),
    );
    await page.close();
  });

  it('marks matches with weight and an underline, not color', async () => {
    const page = await open(combobox());
    expect(await style(page, 'mark', 'font-weight')).toBe('600');
    expect(await style(page, 'mark', 'text-decoration-line')).toBe('underline');
    expect(await style(page, 'mark', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await style(page, 'mark', 'color')).toBe(await style(page, '#one', 'color'));
    await page.close();
  });

  it('hides hidden items but keeps the unchosen check column', async () => {
    const page = await open(combobox());
    expect(await style(page, '#gone', 'display')).toBe('none');
    expect(await style(page, '[data-part="item-indicator"]', 'display')).not.toBe('none');
    expect(await style(page, '[data-part="item-indicator"]', 'visibility')).toBe('hidden');
    expect(await style(page, '[data-part="item-description"]', 'display')).toBe('block');
    await page.close();
  });

  it('sets the create option apart in the primary text color', async () => {
    const page = await open(combobox());
    expect(await style(page, '#create', 'margin-top')).toBe('9px');
    expect(await style(page, '#create', 'color')).not.toBe(await style(page, '#one', 'color'));
    await page.close();
  });

  it('shows the ring on the box while the input has keyboard focus', async () => {
    const page = await open(combobox());
    await page.focus('#c');
    await page.keyboard.press('Shift');
    expect(await style(page, '[data-part="box"]', 'box-shadow')).not.toBe('none');
    await page.close();
  });

  it('mirrors chip padding in RTL', async () => {
    const page = await open(
      combobox('data-multiple', chip('Downtown')),
      'data-theme="light" dir="rtl"',
    );
    expect(await style(page, '[data-part="chip"]', 'padding-right')).toBe('8px');
    expect(await style(page, '[data-part="chip"]', 'padding-left')).toBe('4px');
    await page.close();
  });
});
