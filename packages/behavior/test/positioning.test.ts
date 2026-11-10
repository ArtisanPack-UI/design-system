/**
 * Positioning (#33): logical placements map to Floating UI's physical ones by
 * direction, and `position()` places a floating element in a real browser.
 */
import { join } from 'node:path';

import { build } from 'esbuild';

import { toPlacement } from '../src/positioning';
import { close, launch } from './browser';

describe('toPlacement', () => {
  it.each([
    ['bottom-start', 'ltr', 'bottom-start'],
    ['bottom-start', 'rtl', 'bottom-start'],
    ['top', 'rtl', 'top'],
    ['start', 'ltr', 'left'],
    ['start', 'rtl', 'right'],
    ['end', 'ltr', 'right'],
    ['end', 'rtl', 'left'],
    ['end-start', 'rtl', 'left-start'],
  ] as const)('%s in %s is %s', (placement, dir, expected) => {
    expect(toPlacement(placement, dir)).toBe(expected);
  });
});

describe('position', () => {
  let script: string;

  beforeAll(async () => {
    const result = await build({
      stdin: {
        contents: "import { position } from './src/positioning'; window.apuiPosition = position;",
        resolveDir: join(__dirname, '..'),
        loader: 'ts',
      },
      bundle: true,
      format: 'iife',
      write: false,
    });
    script = result.outputFiles[0]!.text;
  });

  afterAll(close);

  async function place(dir: 'ltr' | 'rtl', placement: string) {
    const page = await (await launch()).newPage({ viewport: { width: 800, height: 600 } });
    await page.setContent(`<!doctype html><html dir="${dir}"><body style="margin:0">
      <button id="ref" style="position:absolute;inset-block-start:200px;inset-inline-start:300px;inline-size:100px;block-size:40px">Ref</button>
      <div id="float" style="inline-size:80px;block-size:30px">Float</div>
      <script>${script}</script></body></html>`);
    await page.evaluate((p) => {
      const w = window as unknown as {
        apuiPosition(r: Element, f: HTMLElement, o: object): () => void;
      };
      w.apuiPosition(document.querySelector('#ref')!, document.querySelector('#float')!, {
        placement: p,
        gutter: 4,
      });
    }, placement);
    await page.waitForFunction(
      () => document.querySelector<HTMLElement>('#float')!.dataset.placement,
    );
    const rects = await page.evaluate(() => {
      const r = document.querySelector('#ref')!.getBoundingClientRect();
      const f = document.querySelector('#float')!.getBoundingClientRect();
      return {
        r: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
        f: { left: f.left, right: f.right, top: f.top },
      };
    });
    await page.close();
    return rects;
  }

  it('places below the reference, aligned to its start edge', async () => {
    const ltr = await place('ltr', 'bottom-start');
    expect(ltr.f.top).toBe(ltr.r.bottom + 4);
    expect(ltr.f.left).toBe(ltr.r.left);
    const rtl = await place('rtl', 'bottom-start');
    expect(rtl.f.right).toBe(rtl.r.right);
  });

  it('opens on the end side, which is the left in RTL', async () => {
    const ltr = await place('ltr', 'end');
    expect(ltr.f.left).toBe(ltr.r.right + 4);
    const rtl = await place('rtl', 'end');
    expect(rtl.f.right).toBe(rtl.r.left - 4);
  });
});
