/**
 * The form editors (#53) in Chromium: the shared helpers (sanitizing,
 * Markdown, the signature pad, indentation) and the Alpine components the
 * Blade views mount (apuiSignature, apuiRichTextEditor, apuiCodeEditor).
 */
import { join } from 'node:path';

import { build } from 'esbuild';
import type { Page } from 'playwright';

import {
  caretPosition,
  fillPlaceholders,
  gutterLines,
  problemsLabel,
  CODE_EDITOR_TRANSLATIONS,
  markdownToHtml,
  resolveToolbar,
  safeImageUrl,
  safeLinkUrl,
  severityByLine,
  shortcutCommand,
  signatureModes,
  initialSignatureMode,
  textStats,
} from '../src/form/index';
import { close, data, launch, open, settle } from './browser';

afterAll(close);

let helpers: string | undefined;

/** The helpers as a classic script exposing `window.F`. */
async function helperScript(): Promise<string> {
  helpers ??= (
    await build({
      entryPoints: [join(__dirname, '../src/form/index.ts')],
      bundle: true,
      format: 'iife',
      globalName: 'F',
      target: 'es2020',
      write: false,
    })
  ).outputFiles[0]!.text;
  return helpers;
}

async function helperPage(): Promise<Page> {
  const page = await (await launch()).newPage();
  await page.setContent(
    `<!doctype html><html><body><div id="root"></div><script>${await helperScript()}</script></body></html>`,
  );
  return page;
}

describe('pure helpers', () => {
  it('always offers type mode, in the standard order', () => {
    expect(signatureModes(['upload', 'draw'])).toEqual(['draw', 'type', 'upload']);
    expect(signatureModes(['draw'])).toEqual(['draw', 'type']);
    expect(signatureModes(['nope'])).toEqual(['type']);
    expect(signatureModes()).toEqual(['draw', 'type', 'upload']);
    expect(initialSignatureMode('upload', ['draw', 'type'])).toBe('draw');
  });

  it('resolves toolbars, dropping what the output cannot hold and stray dividers', () => {
    expect(resolveToolbar('compact')).toEqual(['bold', 'italic', 'link', '|', 'bulletList']);
    expect(resolveToolbar(['|', 'bold', '|', '|', 'nope', 'underline', '|'])).toEqual([
      'bold',
      '|',
      'underline',
    ]);
    expect(resolveToolbar(['bold', 'underline'], 'markdown')).toEqual(['bold']);
    expect(resolveToolbar('unknown')).toEqual(resolveToolbar('default'));
  });

  it('allowlists URL schemes', () => {
    expect(safeLinkUrl('https://a.test')).toBe('https://a.test');
    expect(safeLinkUrl('/path')).toBe('/path');
    expect(safeLinkUrl(' JaVa\tScript:alert(1)')).toBeNull();
    expect(safeImageUrl('data:image/png;base64,AA')).toBeNull();
    expect(safeImageUrl('mailto:a@b.test')).toBeNull();
  });

  it('converts Markdown to the editor HTML without a DOM, dropping unsafe links', () => {
    expect(
      markdownToHtml(
        '## Title\n\nSome **bold** and _em_ and `<b>`.\n\n- one\n- two\n  - nested\n\n> quote',
      ),
    ).toBe(
      '<h2>Title</h2><p>Some <strong>bold</strong> and <em>em</em> and <code>&lt;b&gt;</code>.</p><ul><li>one</li><li>two<ul><li>nested</li></ul></li></ul><blockquote><p>quote</p></blockquote>',
    );
    expect(markdownToHtml('[x](javascript:alert) [y](https://y.test)')).toBe(
      '<p>x <a href="https://y.test">y</a></p>',
    );
  });

  it('counts words and characters and fills placeholders', () => {
    expect(textStats(' Hello   brave\nworld ')).toEqual({ words: 3, characters: 20 });
    expect(fillPlaceholders(':count / :max', { count: 3, max: 10 })).toBe('3 / 10');
  });

  it('maps shortcuts and diagnostics', () => {
    const key = (init: KeyboardEventInit) => ({ altKey: false, ...init }) as KeyboardEvent;
    expect(shortcutCommand(key({ key: 'b', ctrlKey: true }))).toBe('bold');
    expect(shortcutCommand(key({ key: 'K', metaKey: true }))).toBe('link');
    expect(shortcutCommand(key({ key: 'x', ctrlKey: true, shiftKey: true }))).toBe('strike');
    expect(shortcutCommand(key({ key: 'b' }))).toBeNull();
    expect(caretPosition('ab\ncde', 5)).toEqual({ line: 2, column: 3 });
    expect(gutterLines('a\nb', 12)).toBe(12);
    expect(gutterLines('a\n'.repeat(20), 12)).toBe(21);
    const diagnostics = [
      { line: 2, message: 'w', severity: 'warning' as const },
      { line: 2, message: 'e' },
      { line: 4, message: 'w2', severity: 'warning' as const },
    ];
    expect([...severityByLine(diagnostics)]).toEqual([
      [2, 'error'],
      [4, 'warning'],
    ]);
    expect(problemsLabel(diagnostics, CODE_EDITOR_TRANSLATIONS)).toBe('1 error · 2 warnings');
  });
});

describe('sanitizing and Markdown in the browser', () => {
  it('keeps the editor formats and drops everything else', async () => {
    const page = await helperPage();
    const out = await page.evaluate(() =>
      (window as unknown as { F: { sanitizeRichText(html: string): string } }).F.sanitizeRichText(
        '<p onclick="x()">Hi <b>there</b> <span style="color:red">red</span><script>alert(1)</script></p><a href="javascript:alert(1)">bad</a><img src="x.png" onerror="x()"><iframe src="/"></iframe>',
      ),
    );
    expect(out).toBe('<p>Hi <strong>there</strong> red</p>bad<img src="x.png" alt="">');
    await page.close();
  });

  it('round-trips HTML through Markdown', async () => {
    const page = await helperPage();
    const html =
      '<h2>About</h2><p>A <strong>bold</strong>, <em>soft</em>, <s>gone</s> <a href="https://a.test">link</a>.</p><ul><li>one</li><li>two</li></ul><ol><li>first</li></ol><blockquote><p>Quiet.</p></blockquote>';
    const markdown = await page.evaluate(
      (value) =>
        (window as unknown as { F: { htmlToMarkdown(html: string): string } }).F.htmlToMarkdown(
          value,
        ),
      html,
    );
    expect(markdown).toBe(
      '## About\n\nA **bold**, _soft_, ~~gone~~ [link](https://a.test).\n\n- one\n- two\n\n1. first\n\n> Quiet.',
    );
    expect(markdownToHtml(markdown)).toBe(html);
    await page.close();
  });
});

/** The Signature as the Blade view renders it. */
const signature = (modes = "['draw', 'type', 'upload']") => `
<div id="sig" class="apui-signature" x-data="apuiSignature({ value: '', mode: 'draw', modes: ${modes} })">
  <div id="modes" role="group">
    <button id="m-draw" type="button" x-on:click="setMode('draw')" :aria-pressed="String(mode === 'draw')">Draw</button>
    <button id="m-type" type="button" x-on:click="setMode('type')" :aria-pressed="String(mode === 'type')">Type</button>
  </div>
  <div style="position: relative; width: 400px; height: 160px">
    <canvas id="ink" x-ref="ink" style="display: block; width: 400px; height: 160px; color: rgb(17, 24, 39)" :hidden="mode === 'type'"></canvas>
    <input id="typed" x-ref="typed" x-model="typed" x-on:input="type()" :hidden="mode !== 'type'" hidden style="font: 40px serif" />
    <button id="undo" type="button" x-on:click="undo()" :disabled="!canUndo">Undo</button>
    <button id="clear" type="button" x-on:click="clear()" :disabled="empty">Clear</button>
  </div>
  <input id="value" type="hidden" :value="value" />
  <span id="status" x-text="announcement"></span>
</div>`;

async function stroke(page: Page, from: [number, number], to: [number, number]) {
  const box = (await page.locator('#ink').boundingBox())!;
  await page.mouse.move(box.x + from[0], box.y + from[1]);
  await page.mouse.down();
  await page.mouse.move(box.x + (from[0] + to[0]) / 2, box.y + (from[1] + to[1]) / 2);
  await page.mouse.move(box.x + to[0], box.y + to[1]);
  await page.mouse.up();
  await settle(page);
}

describe('apuiSignature', () => {
  it('draws a stroke into a PNG value, undoes and clears it', async () => {
    const { page, errors } = await open(signature());
    const changes: string[] = [];
    await page.exposeFunction('record', (value: string) => changes.push(value));
    await page.evaluate(() =>
      document.getElementById('sig')!.addEventListener('value-change', (event) => {
        (window as unknown as { record(v: string): void }).record(
          (event as CustomEvent<{ value: string }>).detail.value.slice(0, 22),
        );
      }),
    );
    expect(await page.$eval('#undo', (el) => (el as HTMLButtonElement).disabled)).toBe(true);
    await stroke(page, [20, 100], [200, 60]);
    expect(await data<string>(page, '#sig', 'value')).toMatch(/^data:image\/png;base64,/);
    expect(await page.$eval('#value', (el) => (el as HTMLInputElement).value)).toMatch(
      /^data:image\/png/,
    );
    expect(await data<boolean>(page, '#sig', 'canUndo')).toBe(true);
    await stroke(page, [40, 40], [80, 120]);
    await page.click('#undo');
    await settle(page);
    expect(await data<string>(page, '#sig', 'value')).toMatch(/^data:image\/png/);
    await page.click('#undo');
    await settle(page);
    expect(await data<string>(page, '#sig', 'value')).toBe('');
    await stroke(page, [20, 100], [200, 60]);
    await page.click('#clear');
    await settle(page);
    expect(await data<string>(page, '#sig', 'value')).toBe('');
    expect(await page.textContent('#status')).toBe('Signature cleared.');
    expect(changes[0]).toBe('data:image/png;base64,');
    expect(changes.at(-1)).toBe('');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('renders a typed name to a PNG value and starts over when switching modes', async () => {
    const { page } = await open(signature("['draw']"));
    await stroke(page, [20, 100], [200, 60]);
    await page.click('#m-type');
    await settle(page);
    expect(await data<string>(page, '#sig', 'value')).toBe('');
    expect(await page.$eval('#ink', (el) => el.hasAttribute('hidden'))).toBe(true);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('typed');
    await page.keyboard.type('Olivia Rhye');
    await settle(page);
    expect(await data<string>(page, '#sig', 'value')).toMatch(/^data:image\/png;base64,/);
    await page.fill('#typed', '');
    await page.dispatchEvent('#typed', 'input');
    await settle(page);
    expect(await data<string>(page, '#sig', 'value')).toBe('');
    await page.close();
  });

  it('clears the pad when the bound value is emptied from outside', async () => {
    const { page } = await open(signature());
    await stroke(page, [20, 100], [200, 60]);
    await page.evaluate(() => {
      const alpine = (window as unknown as { Alpine: { $data(el: Element): { value: string } } })
        .Alpine;
      alpine.$data(document.getElementById('sig')!).value = '';
    });
    await settle(page);
    expect(await data<boolean>(page, '#sig', 'empty')).toBe(true);
    expect(await data<boolean>(page, '#sig', 'canUndo')).toBe(false);
    await page.close();
  });
});

/** The RichTextEditor as the Blade view renders it, with the built-in engine. */
const editor = (output = 'html', value = '') => `
<div id="rte" x-data="apuiRichTextEditor({ value: ${JSON.stringify(value).replace(/"/g, '&quot;')}, output: '${output}', engine: 'native', maxLength: 500 })">
  <div id="toolbar" role="toolbar" x-ref="toolbar" x-on:keydown="toolbarKeydown($event)">
    <button id="b-bold" data-part="button" type="button" x-on:mousedown.prevent x-on:click="run('bold')" :aria-pressed="String(!!active.bold)">B</button>
    <button id="b-h2" data-part="button" type="button" x-on:mousedown.prevent x-on:click="run('heading2')" :aria-pressed="String(!!active.heading2)">H2</button>
    <button id="b-list" data-part="button" type="button" x-on:mousedown.prevent x-on:click="run('bulletList')" :aria-pressed="String(!!active.bulletList)">List</button>
  </div>
  <div id="content" x-ref="content" contenteditable="true" role="textbox" aria-multiline="true"></div>
  <span id="count" x-text="count"></span>
</div>`;

async function selectAllIn(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel)!;
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  }, selector);
  await settle(page);
}

describe('apuiRichTextEditor (built-in engine)', () => {
  it('shows the initial value, formats the selection and reports sanitized HTML', async () => {
    const { page, errors } = await open(editor('html', '<p>Hello world</p><script>x()</script>'));
    expect(await page.innerHTML('#content')).toBe('<p>Hello world</p>');
    expect(await page.textContent('#count')).toBe('2 words · 11 / 500 characters');
    await page.click('#content');
    await selectAllIn(page, '#content p');
    await page.click('#b-bold');
    await settle(page);
    expect(await data<string>(page, '#rte', 'value')).toBe('<p><strong>Hello world</strong></p>');
    expect(await page.getAttribute('#b-bold', 'aria-pressed')).toBe('true');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('writes Markdown and runs Markdown shortcuts', async () => {
    const { page } = await open(editor('markdown'));
    await page.click('#content');
    await page.keyboard.type('## Title');
    await settle(page);
    expect(await page.$eval('#content', (el) => el.querySelector('h2')?.textContent)).toBe('Title');
    expect(await data<string>(page, '#rte', 'value')).toBe('## Title');
    expect(await page.getAttribute('#b-h2', 'aria-pressed')).toBe('true');
    await page.keyboard.press('Enter');
    await page.keyboard.type('- item');
    await settle(page);
    expect(await data<string>(page, '#rte', 'value')).toBe('## Title\n\n- item');
    await page.close();
  });

  it('applies keyboard shortcuts and loads a value set from outside', async () => {
    const { page } = await open(editor());
    await page.click('#content');
    await page.keyboard.type('Bold');
    await selectAllIn(page, '#content');
    await page.keyboard.press('Control+b');
    await settle(page);
    expect(await data<string>(page, '#rte', 'value')).toContain('<strong>Bold</strong>');
    await page.evaluate(() => {
      const alpine = (window as unknown as { Alpine: { $data(el: Element): { value: string } } })
        .Alpine;
      alpine.$data(document.getElementById('rte')!).value = '<p>From the server</p>';
    });
    await settle(page);
    expect(await page.innerHTML('#content')).toBe('<p>From the server</p>');
    await page.close();
  });

  it('moves through the toolbar with arrows that follow the text direction', async () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const { page } = await open(editor(), { dir });
      expect(
        await page.$$eval('#toolbar button', (els) =>
          els.map((el) => (el as HTMLElement).tabIndex),
        ),
      ).toEqual([0, -1, -1]);
      await page.focus('#b-bold');
      await page.keyboard.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('b-h2');
      await page.keyboard.press('End');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('b-list');
      await page.keyboard.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('b-bold');
      expect(
        await page.$$eval('#toolbar button', (els) =>
          els.map((el) => (el as HTMLElement).tabIndex),
        ),
      ).toEqual([0, -1, -1]);
      await page.close();
    }
  });

  it('stops typing at maxLength', async () => {
    const { page } = await open(editor().replace('maxLength: 500', 'maxLength: 5'));
    await page.click('#content');
    await page.keyboard.type('abcdefgh');
    await settle(page);
    expect(await page.textContent('#content')).toBe('abcde');
    expect(await page.textContent('#count')).toBe('1 word · 5 / 5 characters');
    await page.close();
  });
});

/** The CodeEditor as the Blade view renders it. */
const codeEditor = `
<div id="ce" x-data="apuiCodeEditor({ tabSize: 2, rows: 3, tab: 'a' })" x-init="$watch('tab', (value) => $dispatch('tab-change', { value }))">
  <div id="tabs" role="tablist" x-ref="tabs" x-on:keydown="tabsKeydown($event)">
    <button id="t-a" role="tab" data-part="tab" data-value="a" aria-selected="true" :aria-selected="String(tab === 'a')" x-on:click="selectTab('a')">a.ts</button>
    <button id="t-b" role="tab" data-part="tab" data-value="b" aria-selected="false" :aria-selected="String(tab === 'b')" x-on:click="selectTab('b')">b.ts</button>
  </div>
  <div id="gutter" x-ref="gutter"><span data-scope="code-editor" data-part="line">1</span><span data-scope="code-editor" data-part="line">2</span><span data-scope="code-editor" data-part="line">3</span></div>
  <textarea id="control" x-ref="control" x-on:keydown="keydown($event)" x-on:input="sync()" x-on:keyup="sync()" x-on:click="sync()"></textarea>
  <span id="position" x-text="position"></span>
</div>
<button id="after">After</button>`;

describe('apuiCodeEditor', () => {
  it('indents with Tab, outdents with Shift+Tab and leaves after Escape', async () => {
    const { page, errors } = await open(codeEditor);
    await page.click('#control');
    await page.keyboard.type('a');
    await page.keyboard.press('Tab');
    await page.keyboard.type('b');
    expect(await page.inputValue('#control')).toBe('a  b');
    await page.keyboard.press('Enter');
    await page.keyboard.type('c');
    await page.evaluate(() => (document.getElementById('control') as HTMLTextAreaElement).select());
    await page.keyboard.press('Tab');
    expect(await page.inputValue('#control')).toBe('  a  b\n  c');
    await page.keyboard.press('Shift+Tab');
    expect(await page.inputValue('#control')).toBe('a  b\nc');
    await page.keyboard.press('ControlOrMeta+z');
    expect(await page.inputValue('#control')).toBe('  a  b\n  c');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('after');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('keeps the gutter, the active line and the caret position in step', async () => {
    const { page } = await open(codeEditor);
    await page.click('#control');
    await page.keyboard.type('one\ntwo\nthree\nfour');
    await settle(page);
    const lines = await page.$$eval('#gutter [data-part="line"]', (els) =>
      els.map((el) => [el.textContent, el.hasAttribute('data-active')]),
    );
    expect(lines).toEqual([
      ['1', false],
      ['2', false],
      ['3', false],
      ['4', true],
    ]);
    expect(await page.textContent('#position')).toBe('Ln 4, Col 5');
    await page.keyboard.press('ArrowUp');
    await settle(page);
    expect(await page.textContent('#position')).toBe('Ln 3, Col 5');
    await page.fill('#control', 'x');
    await settle(page);
    expect(await page.$$eval('#gutter [data-part="line"]', (els) => els.length)).toBe(3);
    await page.close();
  });

  it('runs the file tabs as a tablist and reports the change', async () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const { page } = await open(codeEditor, { dir });
      const changes: string[] = [];
      await page.exposeFunction('record', (value: string) => changes.push(value));
      await page.evaluate(() =>
        document.getElementById('ce')!.addEventListener('tab-change', (event) => {
          (window as unknown as { record(v: string): void }).record(
            (event as CustomEvent<{ value: string }>).detail.value,
          );
        }),
      );
      expect(await page.getAttribute('#t-b', 'tabindex')).toBe('-1');
      await page.focus('#t-a');
      await page.keyboard.press(dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      await settle(page);
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('t-b');
      expect(await page.getAttribute('#t-b', 'aria-selected')).toBe('true');
      expect(changes).toEqual(['b']);
      await page.click('#t-b');
      await settle(page);
      expect(changes).toEqual(['b']);
      await page.close();
    }
  });
});

describe('review fixes', () => {
  it('never puts a code span inside an attribute (XSS)', () => {
    expect(markdownToHtml('![x](`" onerror="alert(1)//`)')).toBe('<p></p>');
    expect(markdownToHtml('[x](`" onmouseover="alert(1)`)')).toBe('<p>x</p>');
    expect(markdownToHtml('[x](https://a.test/"onmouseover=alert(1))')).not.toMatch(
      /<a[^>]*onmouseover/,
    );
    expect(markdownToHtml('![a "q" `c`](/i.png)')).toBe(
      '<p><img src="/i.png" alt="a &quot;q&quot; c"></p>',
    );
  });

  it('round-trips block markers, odd URLs and code with backticks', async () => {
    const page = await helperPage();
    const html =
      '<p># not a heading</p><p>&gt; not a quote</p><p>- not a list</p><p>1. not a list</p><p>~~not struck~~</p><p><a href="https://a.test/a b(c)">l</a> <code>a`b</code></p>';
    const markdown = await page.evaluate(
      (value) =>
        (window as unknown as { F: { htmlToMarkdown(html: string): string } }).F.htmlToMarkdown(
          value,
        ),
      html,
    );
    expect(markdown).toContain('\\# not a heading');
    expect(markdown).toContain('[l](<https://a.test/a b(c)>)');
    expect(markdown).toContain('``a`b``');
    expect(markdownToHtml(markdown)).toBe(html);
    await page.close();
  });

  it('sanitizes Markdown output where there is a DOM', async () => {
    const page = await helperPage();
    const html = await page.evaluate(() =>
      (
        window as unknown as { F: { richTextToHtml(v: string, o: string): string } }
      ).F.richTextToHtml('![x](`" onerror="alert(1)//`) [y](javascript:alert(1))', 'markdown'),
    );
    expect(html).not.toMatch(/onerror|<a |<img/);
    await page.close();
  });

  it('ignores an image that loads after a newer change', async () => {
    const page = await helperPage();
    const result = await page.evaluate(async () => {
      const F = (
        window as unknown as {
          F: {
            SignaturePad: new (c: HTMLCanvasElement) => {
              load(src: string): Promise<void>;
              clear(silent?: boolean): void;
              isEmpty(): boolean;
            };
          };
        }
      ).F;
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:200px;height:100px;display:block';
      document.body.append(canvas);
      const pad = new F.SignaturePad(canvas);
      const pixel =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const late = pad.load(pixel);
      pad.clear(true);
      await late;
      return pad.isEmpty();
    });
    expect(result).toBe(true);
    await page.close();
  });

  it('stops a paste at maxLength and skips shortcuts while read-only', async () => {
    const page = await helperPage();
    const result = await page.evaluate(() => {
      const F = (
        window as unknown as {
          F: { RichTextSurface: new (root: HTMLElement, options: object) => unknown };
        }
      ).F;
      const root = document.getElementById('root')!;
      root.contentEditable = 'true';
      root.textContent = 'abc';
      let editable = true;
      new F.RichTextSurface(root, { maxLength: () => 5, canEdit: () => editable });
      root.focus();
      const range = document.createRange();
      range.selectNodeContents(root);
      range.collapse(false);
      getSelection()!.removeAllRanges();
      getSelection()!.addRange(range);
      const data = new DataTransfer();
      data.setData('text/plain', 'defgh');
      data.setData('text/html', '<b>defgh</b>');
      root.dispatchEvent(
        new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }),
      );
      const pasted = root.textContent;
      editable = false;
      const key = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      root.dispatchEvent(key);
      return { pasted, prevented: key.defaultPrevented };
    });
    expect(result).toEqual({ pasted: 'abcde', prevented: false });
    await page.close();
  });
});
