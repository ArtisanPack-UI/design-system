/**
 * Opens a fixture sheet in Chromium, forces its pseudo-states and takes the
 * screenshot the visual gate compares (#39).
 */
import { PSEUDO_STATES } from '@artisanpack-ui/manifest';
import type { Browser, Page } from 'playwright';

import { FIXTURE_ROOT_ID, FIXTURE_WIDTH, fixturePage } from './page';
import type { FixtureHost, FixtureSheet } from './types';

/** How a stack gets its cases onto the page. */
export type SheetSource =
  /** Cases rendered on the server (Blade): the HTML that goes inside `#apui-fixture`. */
  | { kind: 'html'; html: string }
  /** A bundled host script that sets `window.apuiFixture` (React, Vue). */
  | { kind: 'host'; script: string; component: string };

export interface OpenSheetOptions {
  sheet: FixtureSheet;
  source: SheetSource;
  /** Stylesheet contents, in order. */
  css: string[];
  /** Classic scripts that run before the host, such as the Alpine adapter. */
  scripts?: string[];
  /** The component's root class, which the pseudo-states are forced on. */
  rootClass: string;
}

export interface OpenedSheet {
  page: Page;
  /** Page errors and console errors or warnings. */
  errors: string[];
}

/** Lets microtasks and two frames run, so renders and transitions settle. */
async function settle(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 0))),
      ),
  );
}

/** Opens one sheet, rendered and with its pseudo-states forced. */
export async function openSheet(browser: Browser, options: OpenSheetOptions): Promise<OpenedSheet> {
  const { sheet, source, css, scripts = [], rootClass } = options;
  const page = await browser.newPage({
    viewport: { width: FIXTURE_WIDTH, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });

  // The caller closes the page, but only once it has it: close it on a failed render.
  try {
    const html = fixturePage({
      sheet,
      css,
      scripts: source.kind === 'host' ? [...scripts, source.script] : scripts,
      body: source.kind === 'html' ? source.html : '',
    });
    await page.setContent(html, { waitUntil: 'load' });
    if (source.kind === 'host') {
      await page.waitForFunction(() => window.apuiFixture !== undefined);
      await page.evaluate(
        ([s, name]) => window.apuiFixture!.render(s as FixtureSheet, name as string),
        [sheet, source.component] as const,
      );
    }
    await page.evaluate(() => document.fonts.ready);
    await settle(page);
    // States are forced below, never real focus. An open overlay's machine
    // moves focus into it, and whether that shows a ring depends on each
    // framework's focus heuristics, not on the component (D-019). A blur moves
    // focus to the body, which dismisses nothing.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
    await settle(page);
    await forceStates(page, rootClass);
    await settle(page);
  } catch (error) {
    await page.close();
    throw error;
  }
  return { page, errors };
}

/**
 * Forces `:hover`, `:focus-visible` and `:active` on each case's root through
 * the DevTools protocol, so no stack needs preview-only classes. A field's
 * root is a wrapper around a native `control` part (Input, Select, Checkbox),
 * so the state goes on that control instead, where the browser would put it.
 */
export async function forceStates(page: Page, rootClass: string): Promise<void> {
  const scope = rootClass.replace(/^apui-/, '');
  const session = await page.context().newCDPSession(page);
  await session.send('DOM.enable');
  await session.send('CSS.enable');
  const { root } = await session.send('DOM.getDocument', { depth: -1 });
  for (const state of PSEUDO_STATES) {
    const { nodeIds: roots } = await session.send('DOM.querySelectorAll', {
      nodeId: root.nodeId,
      selector: `[data-apui-state="${state}"] .${rootClass}`,
    });
    for (const rootId of roots) {
      const { nodeId: controlId } = await session.send('DOM.querySelector', {
        nodeId: rootId,
        selector: `[data-scope="${scope}"][data-part="control"]`,
      });
      await session.send('CSS.forcePseudoState', {
        nodeId: controlId || rootId,
        forcedPseudoClasses: [state],
      });
    }
  }
}

declare global {
  interface Window {
    apuiFixture?: FixtureHost;
  }
}

/** A PNG of the sheet's cases. */
export async function screenshotSheet(page: Page): Promise<Buffer> {
  return page.locator(`#${FIXTURE_ROOT_ID}`).screenshot({ animations: 'disabled', caret: 'hide' });
}
