/**
 * ColorPicker through the Alpine adapter (#53): the area and sliders with
 * their keyboard (RTL included) and aria-valuetext, typing the value,
 * switching the format, swatches, the eyedropper's support check, values
 * bound to Alpine data and a server morph. Plus the OKLCH math and the
 * text parser and formatter, which run anywhere.
 */
import type { Page } from 'playwright';

import { close, data, morph, open, setData, settle } from './browser';
import { formatRgba, oklchToRgb, parseColorText, rgbToOklch } from '../src/widgets/color-picker';

afterAll(close);

const markup = (options: string, { swatches = true, alpha = true } = {}) => `
<div id="cp" x-data="apuiColorPicker(${options})" x-apui:root>
  <label id="cp-label" x-apui:label>Brand color</label>
  <div id="cp-box" x-apui:box>
    <button id="cp-trigger" type="button" x-apui:trigger><span x-apui:swatch="{ current: true }"></span></button>
    <input id="cp-input" x-apui:control />
  </div>
  <div id="cp-positioner" x-apui:positioner>
    <div id="cp-content" x-apui:content>
      <div id="cp-area" x-apui:area style="position: relative; width: 200px; height: 100px">
        <div x-apui:area-background style="position: absolute; inset: 0"></div>
        <div id="cp-area-thumb" x-apui:area-thumb style="width: 10px; height: 10px"></div>
      </div>
      <div x-apui:channel-slider="{ channel: 'hue' }">
        <div id="cp-hue-track" x-apui:channel-slider-track="{ channel: 'hue' }" style="position: relative; width: 200px; height: 10px">
          <div id="cp-hue-thumb" x-apui:channel-slider-thumb="{ channel: 'hue' }" style="width: 10px; height: 10px"></div>
        </div>
      </div>
      ${
        alpha
          ? `<div x-apui:channel-slider="{ channel: 'alpha' }">
        <div id="cp-alpha-track" x-apui:channel-slider-track="{ channel: 'alpha' }" style="position: relative; width: 200px; height: 10px">
          <div id="cp-alpha-thumb" x-apui:channel-slider-thumb="{ channel: 'alpha' }" style="width: 10px; height: 10px"></div>
        </div>
      </div>`
          : ''
      }
      <div x-apui:row>
        <select id="cp-format" x-apui:format-select>
          <option value="hex">HEX</option><option value="rgb">RGB</option><option value="hsl">HSL</option><option value="oklch">OKLCH</option>
        </select>
        <button id="cp-eyedropper" type="button" x-apui:eye-dropper-trigger>Pick</button>
      </div>
      ${
        swatches
          ? `<div id="cp-swatches" x-apui:swatch-group>
        <button id="cp-swatch-teal" type="button" x-apui:swatch-trigger="{ value: '#0b9488' }"><span x-apui:swatch="{ value: '#0b9488' }"></span></button>
        <button id="cp-swatch-red" type="button" x-apui:swatch-trigger="{ value: '#c92f33' }"><span x-apui:swatch="{ value: '#c92f33' }"></span></button>
      </div>`
          : ''
      }
    </div>
  </div>
</div>`;

const value = (page: Page) => data<string>(page, '#cp', 'value');
const inputText = (page: Page) => page.$eval('#cp-input', (el) => (el as HTMLInputElement).value);
const attr = (page: Page, selector: string, name: string) =>
  page.$eval(selector, (el, n) => el.getAttribute(n), name);

async function openPicker(page: Page) {
  await page.click('#cp-trigger');
  await settle(page);
}

describe('color math', () => {
  it('converts sRGB to OKLCH and back', () => {
    const blue = rgbToOklch({ r: 31, g: 116, b: 191, a: 1 });
    expect(blue.l).toBeCloseTo(0.552, 2);
    expect(blue.c).toBeCloseTo(0.137, 2);
    expect(blue.h).toBeCloseTo(250.6, 0);
    expect(oklchToRgb(blue)).toEqual({ r: 31, g: 116, b: 191, a: 1 });
    expect(rgbToOklch({ r: 255, g: 255, b: 255, a: 1 }).l).toBeCloseTo(1, 3);
    expect(rgbToOklch({ r: 0, g: 0, b: 0, a: 1 }).l).toBeCloseTo(0, 3);
    expect(rgbToOklch({ r: 128, g: 128, b: 128, a: 1 }).c).toBeLessThan(1e-3);
  });

  it('clips OKLCH outside the sRGB gamut', () => {
    const rgb = oklchToRgb({ l: 0.7, c: 0.4, h: 145, a: 1 });
    for (const channel of [rgb.r, rgb.g, rgb.b]) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(255);
    }
    expect(oklchToRgb({ l: 2, c: 0, h: 0, a: 3 })).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });

  it('formats every text format, with alpha only below 1', () => {
    const blue = { r: 31, g: 116, b: 191, a: 1 };
    expect(formatRgba(blue, 'hex')).toBe('#1f74bf');
    expect(formatRgba({ ...blue, a: 0.8 }, 'hex')).toBe('#1f74bfcc');
    expect(formatRgba(blue, 'rgb')).toBe('rgb(31 116 191)');
    expect(formatRgba({ ...blue, a: 0.5 }, 'rgb')).toBe('rgb(31 116 191 / 0.5)');
    expect(formatRgba(blue, 'hsl')).toBe('hsl(208 72% 44%)');
    expect(formatRgba(blue, 'oklch')).toBe('oklch(0.549 0.14 250.2)');
    expect(formatRgba({ ...blue, a: 0.25 }, 'oklch')).toBe('oklch(0.549 0.14 250.2 / 0.25)');
  });

  it('parses every text format, and rejects text that is not a color', () => {
    expect(parseColorText('#1F74BF')).toEqual({ r: 31, g: 116, b: 191, a: 1 });
    expect(parseColorText('1f74bf')).toEqual({ r: 31, g: 116, b: 191, a: 1 });
    expect(parseColorText('#abc')).toEqual({ r: 170, g: 187, b: 204, a: 1 });
    expect(parseColorText('#1f74bf80')!.a).toBeCloseTo(0.502, 3);
    expect(parseColorText('rgb(31, 116, 191)')).toEqual({ r: 31, g: 116, b: 191, a: 1 });
    expect(parseColorText('rgba(31 116 191 / 50%)')).toEqual({ r: 31, g: 116, b: 191, a: 0.5 });
    expect(parseColorText('hsl(208 72% 44%)')).toEqual({ r: 31, g: 118, b: 193, a: 1 });
    expect(parseColorText('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColorText('oklch(0.549 0.14 250.2)')).toEqual({ r: 31, g: 116, b: 191, a: 1 });
    expect(parseColorText('oklch(54.9% 0.14 250.2 / 0.25)')).toEqual({
      r: 31,
      g: 116,
      b: 191,
      a: 0.25,
    });
    for (const bad of ['', 'blue', '#12', 'rgb(1 2)', 'oklch(a b c)', '#zz1234']) {
      expect(parseColorText(bad)).toBeUndefined();
    }
  });
});

describe('color picker (Alpine)', () => {
  it('wires the field, the trigger and the popover', async () => {
    const { page, errors } = await open(markup("{ value: '#1f74bf' }"));
    expect(await inputText(page)).toBe('#1f74bf');
    expect(await attr(page, '#cp-box', 'data-part')).toBe('box');
    expect(await attr(page, '#cp-input', 'data-part')).toBe('control');
    expect(await attr(page, '#cp-trigger', 'aria-label')).toBe('Choose a color');
    expect(await attr(page, '#cp-trigger', 'aria-expanded')).toBe('false');
    expect(await page.$eval('#cp-content', (el) => el.hasAttribute('hidden'))).toBe(true);
    await openPicker(page);
    expect(await attr(page, '#cp-trigger', 'aria-expanded')).toBe('true');
    expect(await attr(page, '#cp-content', 'role')).toBe('dialog');
    expect(await data(page, '#cp', 'open')).toBe(true);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('moves the area and sliders from the keyboard, with aria-valuetext', async () => {
    const { page } = await open(markup("{ value: '#1f74bf' }"));
    await openPicker(page);
    expect(await attr(page, '#cp-area-thumb', 'role')).toBe('slider');
    expect(await attr(page, '#cp-area-thumb', 'aria-label')).toBe('Saturation and brightness');
    expect(await attr(page, '#cp-area-thumb', 'aria-valuetext')).toMatch(/^\d+%, \d+%$/);
    const before = await value(page);
    await page.focus('#cp-area-thumb');
    await page.keyboard.press('ArrowUp');
    await settle(page);
    expect(await value(page)).not.toBe(before);

    expect(await attr(page, '#cp-hue-thumb', 'aria-label')).toBe('Hue');
    const hue = Number(await attr(page, '#cp-hue-thumb', 'aria-valuenow'));
    await page.focus('#cp-hue-thumb');
    await page.keyboard.press('ArrowRight');
    await settle(page);
    expect(Number(await attr(page, '#cp-hue-thumb', 'aria-valuenow'))).toBeGreaterThan(hue);
    expect(await attr(page, '#cp-hue-thumb', 'aria-valuetext')).toMatch(/^\d+°$/);

    expect(await attr(page, '#cp-alpha-thumb', 'aria-label')).toBe('Opacity');
    expect(await attr(page, '#cp-alpha-thumb', 'aria-valuetext')).toBe('100%');
    await page.focus('#cp-alpha-thumb');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    expect(await attr(page, '#cp-alpha-thumb', 'aria-valuetext')).toBe('99%');
    expect(await value(page)).toMatch(/^#[0-9a-f]{8}$/);
    await page.close();
  });

  it('follows the text direction with ArrowLeft and ArrowRight under RTL', async () => {
    const { page } = await open(markup("{ value: '#1f74bf' }"), { dir: 'rtl' });
    await openPicker(page);
    const hue = Number(await attr(page, '#cp-hue-thumb', 'aria-valuenow'));
    await page.focus('#cp-hue-thumb');
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    // ArrowLeft points toward the end of an RTL slider: the value grows.
    expect(Number(await attr(page, '#cp-hue-thumb', 'aria-valuenow'))).toBeGreaterThan(hue);
    const thumb = await page.$eval('#cp-hue-thumb', (el) => (el as HTMLElement).style.left);
    expect(thumb).not.toBe('');
    await page.close();
  });

  it('sets the value from typed text on Enter, and restores bad text', async () => {
    const { page } = await open(markup("{ value: '#1f74bf' }"));
    await page.fill('#cp-input', 'rgb(201 47 51)');
    await page.press('#cp-input', 'Enter');
    await settle(page);
    expect(await value(page)).toBe('#c92f33');
    expect(await inputText(page)).toBe('#c92f33');
    await page.fill('#cp-input', 'not a color');
    await page.press('#cp-input', 'Tab');
    await settle(page);
    expect(await inputText(page)).toBe('#c92f33');
    expect(await value(page)).toBe('#c92f33');
    await page.close();
  });

  it('switches the format, rewriting the value', async () => {
    const { page } = await open(markup("{ value: '#1f74bf' }"));
    await openPicker(page);
    const events: string[] = [];
    await page.exposeFunction('logFormat', (format: string) => events.push(format));
    await page.$eval('#cp', (el) =>
      el.addEventListener('format-change', (event) =>
        (window as unknown as { logFormat(f: string): void }).logFormat(
          (event as CustomEvent<{ format: string }>).detail.format,
        ),
      ),
    );
    await page.selectOption('#cp-format', 'oklch');
    await settle(page);
    expect(await data(page, '#cp', 'format')).toBe('oklch');
    expect(await value(page)).toBe('oklch(0.549 0.14 250.2)');
    expect(await inputText(page)).toBe('oklch(0.549 0.14 250.2)');
    await page.selectOption('#cp-format', 'rgb');
    await settle(page);
    expect(await value(page)).toBe('rgb(31 116 191)');
    expect(events).toEqual(['oklch', 'rgb']);
    await page.close();
  });

  it('chooses a swatch, named by its value and pressed when current', async () => {
    const { page } = await open(markup("{ value: '#1f74bf' }"));
    await openPicker(page);
    expect(await attr(page, '#cp-swatches', 'aria-label')).toBe('Swatches');
    expect(await attr(page, '#cp-swatch-teal', 'aria-label')).toBe('#0B9488');
    expect(await attr(page, '#cp-swatch-teal', 'aria-pressed')).toBe('false');
    await page.click('#cp-swatch-teal');
    await settle(page);
    expect(await value(page)).toBe('#0b9488');
    expect(await attr(page, '#cp-swatch-teal', 'aria-pressed')).toBe('true');
    await page.close();
  });

  it('hides the eyedropper where EyeDropper is unsupported', async () => {
    const { page } = await open(markup("{ value: '#1f74bf' }"));
    const supported = await page.evaluate(() => 'EyeDropper' in window);
    expect(await page.$eval('#cp-eyedropper', (el) => el.hasAttribute('hidden'))).toBe(!supported);
    expect(await attr(page, '#cp-eyedropper', 'aria-label')).toBe('Pick a color from the screen');
    await page.close();
  });

  it('writes opaque values and drops the alpha slider without alpha', async () => {
    const { page } = await open(markup("{ value: '#1f74bf80', alpha: false }", { alpha: false }));
    expect(await inputText(page)).toBe('#1f74bf');
    await page.fill('#cp-input', '#c92f3380');
    await page.press('#cp-input', 'Enter');
    await settle(page);
    expect(await value(page)).toBe('#c92f33');
    await page.close();
  });

  it('follows Alpine data and translated labels', async () => {
    const { page } = await open(
      markup("{ value: '#1f74bf', labels: { trigger: 'Elegir color', hue: 'Tono' } }"),
    );
    expect(await attr(page, '#cp-trigger', 'aria-label')).toBe('Elegir color');
    expect(await attr(page, '#cp-hue-thumb', 'aria-label')).toBe('Tono');
    await setData(page, '#cp', 'value', 'hsl(0 100% 50%)');
    expect(await inputText(page)).toBe('#ff0000');
    await setData(page, '#cp', 'open', true);
    expect(await attr(page, '#cp-trigger', 'aria-expanded')).toBe('true');
    await page.close();
  });

  it('keeps the field wired through a server morph', async () => {
    const { page, errors } = await open(markup("{ value: '#1f74bf' }"));
    await morph(page, '#cp', markup("{ value: '#1f74bf' }"));
    expect(await attr(page, '#cp-trigger', 'aria-label')).toBe('Choose a color');
    expect(await inputText(page)).toBe('#1f74bf');
    await openPicker(page);
    await page.click('#cp-swatch-red');
    await settle(page);
    expect(await value(page)).toBe('#c92f33');
    expect(errors).toEqual([]);
    await page.close();
  });
});
