/**
 * The form text wave (#53) in a real browser (Chromium): Textarea, Password,
 * Pin, Range, Toggle, Fieldset, Form and ValidationSummary. These cover what
 * a stylesheet read can miss: native state driving the look, RTL and the
 * private custom properties the stacks set inline.
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

const rect = (page: Page, selector: string) =>
  page.$eval(selector, (element) => {
    const { x, width } = element.getBoundingClientRect();
    return { x, width };
  });

const toggle = (input = '', root = '') => `
  <div class="apui-toggle" data-size="md" data-color="primary" ${root}>
    <span data-scope="toggle" data-part="track">
      <input type="checkbox" role="switch" data-scope="toggle" data-part="control" id="t" ${input} />
      <span data-scope="toggle" data-part="thumb"></span>
    </span>
    <label data-scope="toggle" data-part="label" for="t">Dark mode</label>
  </div>`;

describe('Toggle', () => {
  it('moves the thumb to the end and fills the track when the native control is checked', async () => {
    const page = await open(`<div style="width:300px">${toggle()}</div>`);
    const off = await rect(page, '[data-part="thumb"]');
    const offBackground = await style(page, '[data-part="track"]', 'background-color');
    await page.click('[data-part="control"]');
    await page.waitForTimeout(250);
    const on = await rect(page, '[data-part="thumb"]');
    expect(on.x).toBeGreaterThan(off.x);
    expect(await style(page, '[data-part="track"]', 'background-color')).not.toBe(offBackground);
    await page.close();
  });

  it('mirrors the thumb under RTL', async () => {
    const page = await open(`<div dir="rtl" style="width:300px">${toggle('checked')}</div>`);
    await page.waitForTimeout(250);
    const track = await rect(page, '[data-part="track"]');
    const thumb = await rect(page, '[data-part="thumb"]');
    // On sits at the logical end: the left edge under RTL.
    expect(thumb.x - track.x).toBeLessThan(track.width / 2);
    await page.close();
  });

  it('uses the sunken track when disabled, even when on', async () => {
    const page = await open(toggle('checked disabled', 'data-disabled'));
    const sunken = await page.evaluate(() => {
      const el = document.createElement('span');
      el.style.color = 'var(--apui-surface-sunken)';
      document.body.append(el);
      return getComputedStyle(el).color;
    });
    expect(await style(page, '[data-part="track"]', 'background-color')).toBe(sunken);
    await page.close();
  });
});

const range = (attributes: string, dir = 'ltr') => `
  <div dir="${dir}" style="width:400px">
    <div class="apui-range" data-size="md" data-color="primary" data-show-value="focus" style="--apui-_from:0%;--apui-_to:25%" ${attributes}>
      <div data-scope="range" data-part="track">
        <div data-scope="range" data-part="fill"></div>
        <input type="range" data-scope="range" data-part="control" data-thumb="end" min="0" max="100" value="25" aria-label="Radius" />
        <span data-scope="range" data-part="thumb" data-thumb="end" aria-hidden="true"><span data-scope="range" data-part="bubble">25</span></span>
      </div>
    </div>
  </div>`;

describe('Range', () => {
  it('fills from the start in LTR and from the right in RTL', async () => {
    const ltr = await open(range(''));
    const ltrTrack = await rect(ltr, '[data-part="track"]');
    const ltrFill = await rect(ltr, '[data-part="fill"]');
    expect(Math.round(ltrFill.x)).toBe(Math.round(ltrTrack.x));
    expect(Math.round(ltrFill.width)).toBe(Math.round(ltrTrack.width / 4));
    await ltr.close();

    const rtl = await open(range('', 'rtl'));
    const rtlTrack = await rect(rtl, '[data-part="track"]');
    const rtlFill = await rect(rtl, '[data-part="fill"]');
    expect(Math.round(rtlFill.x + rtlFill.width)).toBe(Math.round(rtlTrack.x + rtlTrack.width));
    await rtl.close();
  });

  it('lines the native thumb up with the drawn one', async () => {
    const page = await open(range(''));
    const thumb = await rect(page, '[data-part="thumb"]');
    const control = await rect(page, '[data-part="control"]');
    const track = await rect(page, '[data-part="track"]');
    // The input is half a thumb wider at each end, so its thumb centre at 25%
    // is the drawn thumb's centre.
    expect(Math.round(control.width)).toBe(Math.round(track.width + thumb.width));
    expect(Math.round(thumb.x + thumb.width / 2)).toBe(Math.round(track.x + track.width / 4));
    await page.close();
  });

  it('shows the bubble only while focused when showValue is focus', async () => {
    const page = await open(range(''));
    expect(await style(page, '[data-part="bubble"]', 'display')).toBe('none');
    await page.focus('[data-part="control"]');
    await page.keyboard.press('ArrowRight');
    expect(await style(page, '[data-part="bubble"]', 'display')).toBe('block');
    await page.close();
  });
});

describe('Password', () => {
  it('shows one reveal glyph for the pressed state', async () => {
    const page = await open(`
      <div class="apui-password" data-size="md">
        <div data-scope="password" data-part="box">
          <input type="password" data-scope="password" data-part="control" aria-label="Password" />
          <button type="button" data-scope="password" data-part="reveal" aria-pressed="false" aria-label="Show password">
            <svg data-icon="eye" viewBox="0 0 24 24"></svg><svg data-icon="eye-off" viewBox="0 0 24 24"></svg>
          </button>
        </div>
      </div>`);
    const display = (icon: string) => style(page, `svg[data-icon="${icon}"]`, 'display');
    expect(await display('eye')).not.toBe('none');
    expect(await display('eye-off')).toBe('none');
    await page.$eval('[data-part="reveal"]', (button) =>
      button.setAttribute('aria-pressed', 'true'),
    );
    expect(await display('eye')).toBe('none');
    expect(await display('eye-off')).not.toBe('none');
    await page.close();
  });

  it('colors as many segments as the level', async () => {
    const page = await open(`
      <div class="apui-password">
        <div data-scope="password" data-part="strength" data-level="2" aria-hidden="true">
          <span data-scope="password" data-part="segment"></span><span data-scope="password" data-part="segment"></span><span data-scope="password" data-part="segment"></span><span data-scope="password" data-part="segment"></span>
        </div>
      </div>`);
    const colors = await page.$$eval('[data-part="segment"]', (segments) =>
      segments.map((segment) => getComputedStyle(segment).backgroundColor),
    );
    expect(colors[0]).toBe(colors[1]);
    expect(colors[1]).not.toBe(colors[2]);
    expect(colors[2]).toBe(colors[3]);
    await page.close();
  });
});

describe('Pin', () => {
  it('lays the control over every cell and rings the active cell on focus', async () => {
    const page = await open(`
      <div class="apui-pin" data-size="md">
        <div data-scope="pin" data-part="cells">
          <input data-scope="pin" data-part="control" autocomplete="one-time-code" maxlength="4" aria-label="Code" />
          <span data-scope="pin" data-part="cell" aria-hidden="true" data-active></span>
          <span data-scope="pin" data-part="cell" aria-hidden="true"></span>
          <span data-scope="pin" data-part="separator" aria-hidden="true"></span>
          <span data-scope="pin" data-part="cell" aria-hidden="true"></span>
          <span data-scope="pin" data-part="cell" aria-hidden="true"></span>
        </div>
      </div>`);
    const cells = await rect(page, '[data-part="cells"]');
    const control = await rect(page, '[data-part="control"]');
    expect(control).toEqual(cells);
    expect(await style(page, '[data-part="cell"][data-active]', 'box-shadow')).toBe('none');
    await page.focus('[data-part="control"]');
    expect(await style(page, '[data-part="cell"][data-active]', 'box-shadow')).not.toBe('none');
    await page.close();
  });
});

describe('Fieldset', () => {
  it('drops the panel chrome for plain and keeps one edge for divided', async () => {
    const page = await open(`
      <fieldset class="apui-fieldset" data-variant="plain" id="plain"><legend data-scope="fieldset" data-part="legend"><span data-scope="fieldset" data-part="title">A</span></legend></fieldset>
      <fieldset class="apui-fieldset" data-variant="divided" id="divided"><legend data-scope="fieldset" data-part="legend"><span data-scope="fieldset" data-part="title">B</span></legend></fieldset>`);
    expect(await style(page, '#plain', 'border-block-start-width')).toBe('0px');
    expect(await style(page, '#divided', 'border-block-start-width')).toBe('0px');
    expect(await style(page, '#divided', 'border-block-end-width')).not.toBe('0px');
    await page.close();
  });
});

describe('ValidationSummary', () => {
  it('switches to the warning surface with data-color', async () => {
    const page = await open(`
      <div class="apui-validation-summary" data-color="error" id="e"></div>
      <div class="apui-validation-summary" data-color="warning" id="w"></div>`);
    expect(await style(page, '#e', 'background-color')).not.toBe(
      await style(page, '#w', 'background-color'),
    );
    await page.close();
  });
});

describe('Reduced motion', () => {
  it('drops the transitions on the Textarea and Password box, the reveal button and the Pin cells', async () => {
    const page = await browser.newPage();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setContent(`<!doctype html><html data-theme="light"><head><style>${apui}</style></head><body>
      <div class="apui-textarea"><div data-scope="textarea" data-part="box" id="ta"></div></div>
      <div class="apui-password"><div data-scope="password" data-part="box" id="pw"><button data-scope="password" data-part="reveal" id="rv"></button></div></div>
      <div class="apui-pin"><div data-scope="pin" data-part="cells"><span data-scope="pin" data-part="cell" id="cell"></span></div></div>
    </body></html>`);
    for (const id of ['ta', 'pw', 'rv', 'cell']) {
      expect(await style(page, `#${id}`, 'transition-duration')).toBe('0s');
    }
    await page.close();
  });
});
