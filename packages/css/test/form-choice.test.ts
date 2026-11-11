/**
 * Form-choice components (#53) in a real browser (Chromium): RadioGroup,
 * CheckboxGroup, Rating, ColorPicker and File states that read native
 * pseudo-classes, which a single stylesheet read can miss.
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

const radioItem = (value: string, extra = '') => `
  <label data-scope="radio-group" data-part="item" id="i-${value}">
    <span data-scope="radio-group" data-part="box">
      <input type="radio" name="plan" value="${value}" data-scope="radio-group" data-part="control" ${extra} />
      <span data-scope="radio-group" data-part="indicator" aria-hidden="true"></span>
    </span>
    <span data-scope="radio-group" data-part="item-text">${value}</span>
  </label>`;

const radioGroup = (variant = 'default', orientation = 'vertical') => `
  <fieldset class="apui-radio-group" data-variant="${variant}" data-orientation="${orientation}">
    <legend data-scope="radio-group" data-part="label">Plan</legend>
    <div data-scope="radio-group" data-part="items">${radioItem('a')}${radioItem('b')}${radioItem('c')}</div>
  </fieldset>`;

describe('RadioGroup', () => {
  it('shows the dot from the native checked state, before any re-render', async () => {
    const page = await open(radioGroup());
    expect(await style(page, '#i-b [data-part="indicator"]', 'opacity')).toBe('0');
    await page.click('#i-b [data-part="control"]');
    expect(await style(page, '#i-b [data-part="indicator"]', 'opacity')).toBe('1');
    expect(await style(page, '#i-a [data-part="indicator"]', 'opacity')).toBe('0');
    await page.close();
  });

  it('lays horizontal options in a row and cards in a grid', async () => {
    const row = await open(radioGroup('default', 'horizontal'));
    expect(await style(row, '[data-part="items"]', 'display')).toBe('flex');
    await row.close();
    const cards = await open(radioGroup('cards'));
    expect(await style(cards, '[data-part="items"]', 'display')).toBe('grid');
    await cards.click('#i-a [data-part="item-text"]');
    expect(await cards.$eval('#i-a input', (input) => (input as HTMLInputElement).checked)).toBe(
      true,
    );
    expect(await style(cards, '#i-a', 'border-top-style')).toBe('solid');
    await cards.close();
  });

  it('joins segmented items and hides the circle', async () => {
    const page = await open(radioGroup('segmented', 'horizontal'));
    expect(await style(page, '[data-part="items"]', 'display')).toBe('flex');
    expect(await style(page, '[data-part="items"]', 'justify-self')).toBe('start');
    expect(await style(page, '#i-b [data-part="indicator"]', 'display')).toBe('none');
    expect(await style(page, '#i-b', 'margin-left')).toBe('-1px');
    await page.click('#i-b');
    expect(await page.$eval('#i-b input', (input) => (input as HTMLInputElement).checked)).toBe(
      true,
    );
    await page.close();
  });

  it('mutes the legend of a disabled group, radio and checkbox alike', async () => {
    const page = await open(`
      <fieldset class="apui-radio-group" data-disabled><legend data-scope="radio-group" data-part="label" id="r">Plan</legend></fieldset>
      <fieldset class="apui-checkbox-group" data-disabled><legend data-scope="checkbox-group" data-part="label" id="c">Topics</legend></fieldset>
      <fieldset class="apui-radio-group"><legend data-scope="radio-group" data-part="label" id="e">Plan</legend></fieldset>
      <span id="disabled" style="color: var(--apui-text-disabled)"></span>`);
    const disabled = await style(page, '#disabled', 'color');
    expect(await style(page, '#r', 'color')).toBe(disabled);
    expect(await style(page, '#c', 'color')).toBe(disabled);
    expect(await style(page, '#e', 'color')).not.toBe(disabled);
    await page.close();
  });

  it('moves between options with the arrow keys, following RTL', async () => {
    const page = await open(radioGroup('default', 'horizontal'), 'data-theme="light" dir="rtl"');
    await page.click('#i-a [data-part="control"]');
    await page.keyboard.press('ArrowLeft');
    expect(await page.$eval('#i-b input', (input) => (input as HTMLInputElement).checked)).toBe(
      true,
    );
    await page.close();
  });
});

describe('CheckboxGroup', () => {
  const item = (id: string) => `
    <div class="apui-checkbox" id="${id}">
      <span data-scope="checkbox" data-part="box">
        <input type="checkbox" data-scope="checkbox" data-part="control" id="${id}-c" />
        <span data-scope="checkbox" data-part="indicator" aria-hidden="true"></span>
      </span>
      <label data-scope="checkbox" data-part="label" for="${id}-c">Label</label>
      <p data-scope="checkbox" data-part="description">Description</p>
    </div>`;

  it('makes a card clickable anywhere and highlights it while checked', async () => {
    const page = await open(`
      <fieldset class="apui-checkbox-group" data-variant="cards" data-columns="2">
        <legend data-scope="checkbox-group" data-part="label">Channels</legend>
        <div data-scope="checkbox-group" data-part="items">${item('a')}${item('b')}</div>
      </fieldset>`);
    expect(await style(page, '[data-part="items"]', 'grid-template-columns')).toMatch(/px \d/);
    await page.click('#a [data-part="description"]', { force: true });
    expect(await page.$eval('#a-c', (input) => (input as HTMLInputElement).checked)).toBe(true);
    expect(await style(page, '#a', 'box-shadow')).not.toBe('none');
    expect(await style(page, '#b', 'box-shadow')).toBe('none');
    await page.close();
  });
});

describe('Rating', () => {
  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) => `
      <label data-scope="rating" data-part="item" id="s${n}">
        <input type="radio" name="r" value="${n}" data-scope="rating" data-part="control" ${n === 3 ? 'checked' : ''} />
        <span data-scope="rating" data-part="star"><svg viewBox="0 0 24 24"></svg><span data-scope="rating" data-part="half"><svg viewBox="0 0 24 24"></svg></span></span>
      </label>`,
    )
    .join('');

  it('fills the checked star and those before it', async () => {
    const page = await open(`<div class="apui-rating" role="radiogroup">${stars}</div>`);
    const fill = (n: number) => style(page, `#s${n} [data-part="star"] > svg`, 'fill');
    expect(await fill(1)).not.toBe('none');
    expect(await fill(3)).not.toBe('none');
    expect(await fill(4)).toBe('none');
    await page.click('#s5 input');
    expect(await fill(5)).not.toBe('none');
    await page.close();
  });

  it('shows the half part only on the half star, from the start side', async () => {
    const page = await open(`
      <div class="apui-rating" data-readonly role="img" aria-label="3.5 out of 5">
        <span data-scope="rating" data-part="star" data-filled id="f"><svg viewBox="0 0 24 24"></svg><span data-scope="rating" data-part="half"><svg viewBox="0 0 24 24"></svg></span></span>
        <span data-scope="rating" data-part="star" data-half id="h"><svg viewBox="0 0 24 24"></svg><span data-scope="rating" data-part="half"><svg viewBox="0 0 24 24"></svg></span></span>
      </div>`);
    expect(await style(page, '#f [data-part="half"]', 'display')).toBe('none');
    expect(await style(page, '#h [data-part="half"]', 'display')).toBe('block');
    expect(await style(page, '#h [data-part="half"]', 'left')).toBe('0px');
    await page.close();
  });
});

describe('ColorPicker', () => {
  const picker = (open = true) => `
    <div class="apui-color-picker" data-scope="color-picker" data-part="root" data-size="md" data-format="hex">
      <div data-scope="color-picker" data-part="box">
        <button type="button" data-scope="color-picker" data-part="trigger"><span data-scope="color-picker" data-part="swatch" style="background: #1f74bf"></span></button>
        <input type="text" data-scope="color-picker" data-part="control" value="#1f74bf" />
      </div>
      <div data-scope="color-picker" data-part="positioner">
        <div data-scope="color-picker" data-part="content" data-state="${open ? 'open' : 'closed'}" ${open ? '' : 'hidden'}>
          <div data-scope="color-picker" data-part="area"><div data-scope="color-picker" data-part="area-background"></div></div>
          <div data-scope="color-picker" data-part="channel-slider" data-channel="alpha">
            <div data-scope="color-picker" data-part="transparency-grid"></div>
            <div data-scope="color-picker" data-part="channel-slider-track"></div>
          </div>
          <div data-scope="color-picker" data-part="row">
            <select data-scope="color-picker" data-part="format-select"><option>HEX</option></select>
            <button type="button" data-scope="color-picker" data-part="eye-dropper-trigger" hidden></button>
          </div>
          <div data-scope="color-picker" data-part="swatch-group">
            ${Array.from({ length: 8 }, (_, i) => `<button type="button" data-scope="color-picker" data-part="swatch-trigger" aria-pressed="${i === 0}" id="s${i}"></button>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  it('lays out the field and the popover panel', async () => {
    const page = await open(picker());
    expect(await style(page, '[data-part="box"]', 'display')).toBe('flex');
    expect(await style(page, '[data-part="trigger"]', 'background-image')).toContain(
      'conic-gradient',
    );
    expect(await style(page, '[data-part="control"]', 'text-transform')).toBe('uppercase');
    expect(await style(page, '[data-part="content"]', 'width')).toBe('296px');
    expect(await style(page, '[data-part="area"]', 'height')).toBe('150px');
    expect(await style(page, '[data-part="channel-slider-track"]', 'height')).toBe('12px');
    expect(await style(page, '[data-part="eye-dropper-trigger"]', 'display')).toBe('none');
    expect(
      await style(page, '[data-part="swatch-group"]', 'grid-template-columns').then(
        (v) => v.split(' ').length,
      ),
    ).toBe(8);
    expect(await style(page, '#s0', 'box-shadow')).not.toBe('none');
    expect(await style(page, '#s1', 'box-shadow')).toBe('none');
    await page.close();
  });

  it('keeps a closed popover hidden', async () => {
    const page = await open(picker(false));
    expect(await style(page, '[data-part="content"]', 'display')).toBe('none');
    await page.close();
  });
});

describe('File', () => {
  it('covers the drop zone with the native input and styles the drag state', async () => {
    const page = await open(`
      <div class="apui-file" data-variant="dropzone">
        <div data-scope="file" data-part="dropzone">
          <input type="file" data-scope="file" data-part="control" />
          <p data-scope="file" data-part="title">Drop files here or browse</p>
        </div>
      </div>`);
    const zone = await page.$eval('[data-part="dropzone"]', (el) => el.getBoundingClientRect());
    const input = await page.$eval('[data-part="control"]', (el) => el.getBoundingClientRect());
    // Inside the dashed border.
    expect(zone.width - input.width).toBeLessThanOrEqual(4);
    expect(zone.height - input.height).toBeLessThanOrEqual(4);
    expect(await style(page, '[data-part="dropzone"]', 'border-top-style')).toBe('dashed');
    await page.$eval('[data-part="dropzone"]', (el) => el.setAttribute('data-state', 'drag'));
    expect(await style(page, '[data-part="dropzone"]', 'border-top-style')).toBe('solid');
    await page.close();
  });
});
