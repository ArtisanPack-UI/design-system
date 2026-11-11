/**
 * Signature, RichTextEditor and CodeEditor CSS (#53) in Chromium: states
 * the markup carries, hidden mode parts, and code staying left to right.
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

const token = (page: Page, name: string) =>
  page.evaluate((n) => {
    const probe = document.createElement('div');
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  }, name);

const signature = (attributes = '', mode = 'draw') => `
  <div class="apui-signature" data-mode="${mode}" data-pen-color="default" ${attributes}>
    <div data-scope="signature" data-part="modes" role="group">
      <button type="button" data-scope="signature" data-part="mode" aria-pressed="true">Draw</button>
      <button type="button" data-scope="signature" data-part="mode" aria-pressed="false">Type</button>
    </div>
    <div data-scope="signature" data-part="pad">
      <span data-scope="signature" data-part="line"></span>
      <canvas data-scope="signature" data-part="ink" ${mode === 'type' ? 'hidden' : ''}></canvas>
      <input data-scope="signature" data-part="typed" ${mode === 'type' ? '' : 'hidden'} />
      <div data-scope="signature" data-part="tools" ${mode === 'type' ? 'hidden' : ''}></div>
    </div>
  </div>`;

describe('Signature', () => {
  it('draws the pad as the spec frame, with an error edge when invalid', async () => {
    const page = await open(signature() + signature('data-invalid id="bad"'));
    expect(await style(page, '[data-part="pad"]', 'height')).toBe('160px');
    expect(await style(page, '#bad [data-part="pad"]', 'border-top-color')).toBe(
      await token(page, '--apui-color-error-border'),
    );
    await page.close();
  });

  it('hides the parts of the other modes, though they set display', async () => {
    const draw = await open(signature());
    expect(await style(draw, '[data-part="typed"]', 'display')).toBe('none');
    expect(await style(draw, '[data-part="ink"]', 'display')).toBe('block');
    await draw.close();
    const type = await open(signature('', 'type'));
    expect(await style(type, '[data-part="ink"]', 'display')).toBe('none');
    expect(await style(type, '[data-part="tools"]', 'display')).toBe('none');
    expect(await style(type, '[data-part="typed"]', 'display')).toBe('block');
    await type.close();
  });

  it('inks with the pen color', async () => {
    const page = await open(
      signature().replace('data-pen-color="default"', 'data-pen-color="primary"'),
    );
    expect(await style(page, '[data-part="ink"]', 'color')).toBe(
      await token(page, '--apui-color-primary-text'),
    );
    await page.close();
  });
});

describe('RichTextEditor', () => {
  const editor = `
    <div class="apui-rich-text-editor">
      <div data-scope="rich-text-editor" data-part="box">
        <div data-scope="rich-text-editor" data-part="toolbar" role="toolbar">
          <button id="on" type="button" data-scope="rich-text-editor" data-part="button" aria-pressed="true">B</button>
          <button id="off" type="button" data-scope="rich-text-editor" data-part="button" aria-pressed="false">I</button>
        </div>
        <div data-scope="rich-text-editor" data-part="content" contenteditable="true"></div>
        <p id="ph" data-scope="rich-text-editor" data-part="placeholder" hidden>Write…</p>
        <div data-scope="rich-text-editor" data-part="footer"></div>
      </div>
    </div>`;

  it('tints pressed toggles with the selected colors', async () => {
    const page = await open(editor);
    expect(await style(page, '#on', 'background-color')).toBe(
      await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.style.backgroundColor = 'var(--apui-selected-bg)';
        document.body.append(probe);
        return getComputedStyle(probe).backgroundColor;
      }),
    );
    expect(await style(page, '#off', 'background-color')).toBe('rgba(0, 0, 0, 0)');
    await page.close();
  });

  it('keeps a hidden placeholder hidden and stacks a shown one on the content', async () => {
    const page = await open(editor);
    expect(await style(page, '#ph', 'display')).toBe('none');
    await page.$eval('#ph', (el) => el.removeAttribute('hidden'));
    const [content, placeholder] = await Promise.all(
      ['[data-part="content"]', '#ph'].map((sel) => page.locator(sel).boundingBox()),
    );
    expect(placeholder!.y).toBe(content!.y);
    await page.close();
  });

  it('rings the box while the content has focus', async () => {
    const page = await open(editor);
    await page.focus('[data-part="content"]');
    expect(await style(page, '[data-part="box"]', 'box-shadow')).not.toBe('none');
    await page.close();
  });
});

describe('CodeEditor', () => {
  const codeEditor = `
    <div class="apui-code-editor">
      <div data-scope="code-editor" data-part="box">
        <div data-scope="code-editor" data-part="body">
          <div data-scope="code-editor" data-part="gutter"><span data-scope="code-editor" data-part="line">1</span></div>
          <textarea data-scope="code-editor" data-part="control" rows="1"></textarea>
        </div>
        <div data-scope="code-editor" data-part="status"><span>Ln 1, Col 1</span></div>
      </div>
    </div>`;

  it('keeps the code left to right, with the gutter on the left, in RTL', async () => {
    const page = await open(codeEditor, 'data-theme="light" dir="rtl"');
    expect(await style(page, '[data-part="body"]', 'direction')).toBe('ltr');
    expect(await style(page, '[data-part="status"]', 'direction')).toBe('rtl');
    const [gutter, control] = await Promise.all(
      ['[data-part="gutter"]', '[data-part="control"]'].map((sel) =>
        page.locator(sel).boundingBox(),
      ),
    );
    expect(gutter!.x).toBeLessThan(control!.x);
    expect(await style(page, '[data-part="control"]', 'font-family')).toMatch(/mono/i);
    await page.close();
  });
});

describe('RichTextEditor motion', () => {
  it('drops transitions under prefers-reduced-motion', async () => {
    const page = await open(
      '<div class="apui-rich-text-editor"><div data-scope="rich-text-editor" data-part="box"><div data-scope="rich-text-editor" data-part="toolbar"><button id="b" data-scope="rich-text-editor" data-part="button">B</button></div></div></div>',
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await style(page, '#b', 'transition-property')).toBe('none');
    expect(await style(page, '[data-part="box"]', 'transition-property')).toBe('none');
    await page.close();
  });
});
