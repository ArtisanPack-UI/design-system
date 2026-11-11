/**
 * The toast stack through the Alpine adapter (#51): a `toast` browser event
 * (what Livewire's dispatch() sends) adds a toast to the region, which is a
 * polite live region; toasts time out, pause on hover, close from the close
 * trigger and Escape, run their action, and an error is an alert.
 */
import type { Page } from 'playwright';

import { close, open, settle } from './browser';

/** A toaster as the Blade component renders it. */
const markup = (options = "{ label: 'Notifications', duration: 400 }") => `
<div id="toaster" x-data="apuiToaster(${options})">
  <div id="region" x-apui:group>
    <template x-for="(entry, index) in toasts" :key="entry.id">
      <div x-data="apuiToast(entry, index)" x-apui:root>
        <span x-apui:icon x-html="icon"></span>
        <p x-apui:title x-text="entry.title"></p>
        <p x-apui:description x-text="entry.description"></p>
        <template x-if="entry.action">
          <div x-apui:actions>
            <button x-apui:action-trigger x-text="entry.action.label"></button>
          </div>
        </template>
        <button x-apui:close-trigger>×</button>
      </div>
    </template>
  </div>
</div>
<button id="outside">Outside</button>`;

const toasts = (page: Page) =>
  page.$$eval('[data-scope="toast"][data-part="root"]', (els) =>
    els.map((el) => ({
      title: el.querySelector('[data-part="title"]')?.textContent ?? '',
      role: el.getAttribute('role'),
      color: el.getAttribute('data-color'),
      variant: el.getAttribute('data-variant'),
      surface: el.getAttribute('data-surface'),
      state: el.getAttribute('data-state'),
    })),
  );

/** What Livewire's `$this->dispatch('toast', title: …)` sends. */
const dispatchToast = (page: Page, detail: Record<string, unknown>) =>
  page.evaluate((d) => window.dispatchEvent(new CustomEvent('toast', { detail: d })), detail);

const wait = (page: Page, ms: number) => page.waitForTimeout(ms);

afterAll(close);

describe('toast', () => {
  it('renders the region as a polite, labelled live region', async () => {
    const { page, errors } = await open(markup());
    const region = await page.$eval('[data-part="group"]', (el) => ({
      scope: el.getAttribute('data-scope'),
      part: el.getAttribute('data-part'),
      role: el.getAttribute('role'),
      live: el.getAttribute('aria-live'),
      label: el.getAttribute('aria-label'),
      id: el.id,
    }));
    expect(region.scope).toBe('toast');
    expect(region.part).toBe('group');
    expect(region.role).toBe('region');
    expect(region.live).toBe('polite');
    expect(region.label).toMatch(/^Notifications/);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('adds a toast from a toast event, with its parts, color and status icon', async () => {
    const { page, errors } = await open(markup());
    await dispatchToast(page, {
      title: 'Listing saved',
      description: 'It is live now.',
      color: 'success',
    });
    await settle(page);
    expect(await toasts(page)).toEqual([
      {
        title: 'Listing saved',
        role: 'status',
        color: 'success',
        variant: 'default',
        surface: 'overlay',
        state: 'open',
      },
    ]);
    const root = await page.$eval('[data-part="root"]', (el) => ({
      labelledby: el.getAttribute('aria-labelledby'),
      describedby: el.getAttribute('aria-describedby'),
    }));
    expect(await page.$eval(`[id="${root.labelledby}"]`, (el) => el.textContent)).toBe(
      'Listing saved',
    );
    expect(await page.$eval(`[id="${root.describedby}"]`, (el) => el.textContent)).toBe(
      'It is live now.',
    );
    expect(
      await page.$eval('[data-part="icon"]', (el) => ({
        hidden: el.getAttribute('aria-hidden'),
        svg: el.querySelector('svg')?.getAttribute('stroke'),
      })),
    ).toEqual({ hidden: 'true', svg: 'currentColor' });
    expect(
      await page.$eval('[data-part="close-trigger"]', (el) => el.getAttribute('aria-label')),
    ).toBe('Dismiss notification');
    expect(errors).toEqual([]);
    await page.close();
  });

  it('accepts the detail wrapped in an array, as some Livewire versions send it', async () => {
    const { page } = await open(markup());
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent('toast', { detail: [{ title: 'Wrapped' }] })),
    );
    await settle(page);
    expect((await toasts(page)).map((t) => t.title)).toEqual(['Wrapped']);
    await page.close();
  });

  it('makes an error an alert', async () => {
    const { page } = await open(markup());
    await dispatchToast(page, { title: 'Upload failed', color: 'error' });
    await settle(page);
    expect((await toasts(page))[0]!.role).toBe('alert');
    await page.close();
  });

  it('dismisses itself after its duration, and pauses while hovered', async () => {
    const { page } = await open(markup());
    await dispatchToast(page, { title: 'Brief' });
    await settle(page);
    // Zag ignores pointer events for a moment after a toast arrives, so a
    // layout shift isn't a hover; a real pointer keeps moving.
    await page.hover('[data-part="root"]');
    await wait(page, 100);
    const box = (await page.$('[data-part="root"]'))!.boundingBox();
    const { x, y } = (await box)!;
    await page.mouse.move(x + 4, y + 4);
    await wait(page, 600);
    expect((await toasts(page)).map((t) => t.title)).toEqual(['Brief']);
    await page.mouse.move(600, 500);
    await wait(page, 1200);
    expect(await toasts(page)).toEqual([]);
    await page.close();
  });

  it('keeps a toast with duration 0 or an action', async () => {
    const { page } = await open(markup());
    await dispatchToast(page, { title: 'Sticky', duration: 0 });
    await dispatchToast(page, { title: 'Undoable', action: { label: 'Undo' } });
    await wait(page, 1200);
    expect((await toasts(page)).map((t) => t.title).sort()).toEqual(['Sticky', 'Undoable']);
    await page.close();
  });

  it('runs the action, then dismisses', async () => {
    const { page } = await open(markup());
    await page.evaluate(() => {
      const w = window as unknown as {
        undone: number;
        ApuiBehavior: { toast(options: object): string };
      };
      w.undone = 0;
      w.ApuiBehavior.toast({
        title: 'Listing archived',
        action: { label: 'Undo', onClick: () => w.undone++ },
      });
    });
    await settle(page);
    await page.click('[data-part="action-trigger"]');
    await wait(page, 600);
    expect(await page.evaluate(() => (window as unknown as { undone: number }).undone)).toBe(1);
    expect(await toasts(page)).toEqual([]);
    await page.close();
  });

  it('closes from the close trigger and from Escape', async () => {
    const { page } = await open(markup('{ duration: 0 }'));
    await dispatchToast(page, { title: 'One' });
    await settle(page);
    await page.click('[data-part="close-trigger"]');
    await wait(page, 600);
    expect(await toasts(page)).toEqual([]);

    await dispatchToast(page, { title: 'Two' });
    await settle(page);
    await page.focus('[data-part="root"]');
    await page.keyboard.press('Escape');
    await wait(page, 600);
    expect(await toasts(page)).toEqual([]);
    await page.close();
  });

  it('shows toasts passed in on load, newest first', async () => {
    const { page } = await open(
      markup("{ duration: 0, toasts: [{ title: 'First' }, { title: 'Second' }] }"),
    );
    await settle(page);
    expect((await toasts(page)).map((t) => t.title)).toEqual(['Second', 'First']);
    await page.close();
  });

  it('sits at the bottom end, mirrored in RTL, with toasts in the page direction', async () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const { page } = await open(markup('{ duration: 0 }'), { dir });
      await dispatchToast(page, { title: 'Placed' });
      await settle(page);
      const placed = await page.$eval('[data-part="root"]', (el) => {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, dir: getComputedStyle(el).direction };
      });
      const width = await page.evaluate(() => window.innerWidth);
      if (dir === 'ltr') expect(width - placed.right).toBeLessThan(40);
      else expect(placed.left).toBeLessThan(40);
      expect(placed.dir).toBe(dir);
      await page.close();
    }
  });

  it('updates only the options given, keeping color, action and timing', async () => {
    const { page } = await open(markup('{ duration: 300 }'));
    await page.evaluate(() => {
      const w = window as unknown as { ApuiBehavior: { toast(o: object): string } };
      w.ApuiBehavior.toast({
        id: 'u',
        title: 'Uploading',
        color: 'error',
        action: { label: 'Retry' },
      });
      // A second create with the same id updates it, as toaster.update does.
      w.ApuiBehavior.toast({ id: 'u', title: 'Still uploading' });
    });
    await settle(page);
    await wait(page, 700);
    const [toast] = await toasts(page);
    expect(toast).toMatchObject({ title: 'Still uploading', color: 'error' });
    expect(await page.$('[data-part="action-trigger"]')).not.toBeNull();
    await page.close();
  });

  it('stacks toasts of different heights without overlapping', async () => {
    const { page } = await open(
      `<style>[data-part="group"] > [data-part="root"] { translate: var(--x) var(--y); inset-inline: 0; }</style>` +
        markup('{ duration: 0 }'),
    );
    for (const [title, description] of [
      ['A', ''],
      ['B', 'Line one. Line two. Line three. Line four. Line five.'],
      ['C', ''],
    ]) {
      await dispatchToast(page, { title, description });
      await settle(page);
      await wait(page, 50);
    }
    await wait(page, 300);
    const boxes = await page.$$eval('[data-part="root"]', (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
      }),
    );
    const sorted = [...boxes].sort((a, b) => a.top - b.top);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]!.top).toBeGreaterThanOrEqual(sorted[i - 1]!.bottom);
    }
    await page.close();
  });

  it('follows an update to its color with the matching icon', async () => {
    const { page } = await open(markup('{ duration: 0 }'));
    await dispatchToast(page, { id: 'x1', title: 'Saving' });
    await settle(page);
    const before = await page.$eval('[data-part="icon"]', (el) => el.innerHTML);
    await dispatchToast(page, { id: 'x1', title: 'Saved', color: 'success' });
    await settle(page);
    expect(await page.$eval('[data-part="icon"]', (el) => el.innerHTML)).not.toBe(before);
    await page.close();
  });

  it("hides the close button with hideClose, and ignores another library's toast event", async () => {
    const { page } = await open(markup('{ duration: 0 }'));
    await dispatchToast(page, { title: 'No close', hideClose: true });
    await dispatchToast(page, { message: 'Not ours' });
    await settle(page);
    expect((await toasts(page)).map((t) => t.title)).toEqual(['No close']);
    expect(await page.$eval('[data-part="close-trigger"]', (el) => el.hasAttribute('hidden'))).toBe(
      true,
    );
    await page.close();
  });

  it('stops listening when the toaster is destroyed', async () => {
    const { page, errors } = await open(markup());
    await page.evaluate(() => {
      const w = window as unknown as { Alpine: { destroyTree(el: Element): void } };
      const el = document.querySelector('#toaster')!;
      w.Alpine.destroyTree(el);
      el.remove();
    });
    await dispatchToast(page, { title: 'Nobody listening' });
    await settle(page);
    expect(await toasts(page)).toEqual([]);
    expect(errors).toEqual([]);
    await page.close();
  });
});
