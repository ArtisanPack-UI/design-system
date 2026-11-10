/**
 * A Chromium page with Alpine, its morph plugin (what Livewire morphs with)
 * and the Alpine adapter built from source, for the behavior tests.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { build } from 'esbuild';
import { chromium, type Browser, type Page } from 'playwright';

const require = createRequire(import.meta.url);
const read = (specifier: string) => readFileSync(require.resolve(specifier), 'utf8');

let adapter: string | undefined;
let browser: Browser | undefined;

/** The adapter as the classic script pages without a bundler load. */
async function adapterScript(): Promise<string> {
  if (adapter) return adapter;
  const result = await build({
    entryPoints: [join(__dirname, '../src/alpine/global.ts')],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    write: false,
  });
  adapter = result.outputFiles[0]!.text;
  return adapter;
}

export async function launch(): Promise<Browser> {
  browser ??= await chromium.launch();
  return browser;
}

export async function close(): Promise<void> {
  await browser?.close();
  browser = undefined;
}

export interface Opened {
  page: Page;
  errors: string[];
}

/**
 * Opens `body` with the adapter registered before Alpine starts, the order a
 * Livewire page loads them in.
 */
export async function open(body: string, { dir = 'ltr' } = {}): Promise<Opened> {
  const page = await (await launch()).newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.setContent(`<!doctype html>
<html dir="${dir}">
<head>
<style>
  [hidden] { display: none !important; }
  body { margin: 0; min-height: 200vh; }
</style>
</head>
<body>
${body}
<script>${await adapterScript()}</script>
<script>${read('@alpinejs/morph/dist/cdn.min.js')}</script>
<script>${read('alpinejs/dist/cdn.min.js')}</script>
</body>
</html>`);
  await page.waitForFunction(() => (window as unknown as { Alpine?: unknown }).Alpine);
  await settle(page);
  return { page, errors };
}

/** Lets microtasks and a frame run, so machine effects and re-applies land. */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0))),
  );
}

/**
 * Morphs `selector` into `html` with Alpine's morph plugin, the way a Livewire
 * re-render does: attributes the server didn't render are removed.
 */
export async function morph(page: Page, selector: string, html: string): Promise<void> {
  await page.evaluate(
    ([sel, markup]) => {
      const alpine = (window as unknown as { Alpine: { morph(el: Element, to: string): void } })
        .Alpine;
      alpine.morph(document.querySelector(sel!)!, markup!);
    },
    [selector, html],
  );
  await settle(page);
}

/** Alpine data on an element. */
export async function data<T>(page: Page, selector: string, key: string): Promise<T> {
  return page.evaluate(
    ([sel, k]) => {
      const alpine = (
        window as unknown as { Alpine: { $data(el: Element): Record<string, unknown> } }
      ).Alpine;
      return JSON.parse(JSON.stringify(alpine.$data(document.querySelector(sel!)!)[k!] ?? null));
    },
    [selector, key],
  ) as Promise<T>;
}

export async function setData(page: Page, selector: string, key: string, value: unknown) {
  await page.evaluate(
    ([sel, k, v]) => {
      const alpine = (
        window as unknown as { Alpine: { $data(el: Element): Record<string, unknown> } }
      ).Alpine;
      alpine.$data(document.querySelector(sel as string)!)[k as string] = v;
    },
    [selector, key, value] as const,
  );
  await settle(page);
}

/** Event listeners on document and window, through the DevTools protocol. */
export async function listenerCount(page: Page): Promise<number> {
  const session = await page.context().newCDPSession(page);
  let total = 0;
  for (const expression of ['document', 'window', 'document.body']) {
    const { result } = await session.send('Runtime.evaluate', { expression });
    const { listeners } = await session.send('DOMDebugger.getEventListeners', {
      objectId: result.objectId!,
    });
    total += listeners.length;
  }
  await session.detach();
  return total;
}
