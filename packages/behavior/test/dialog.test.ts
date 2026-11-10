/**
 * Dialog through the Alpine adapter (#34): focus trap, Escape, scroll lock,
 * outside click, open state bound to Alpine data, surviving a morph, and no
 * leaks after teardown.
 */
import type { Page } from 'playwright';

import { close, data, listenerCount, morph, open, setData, settle } from './browser';

/** The dialog as a server would render it: no machine attributes. */
const markup = (saved = 0, open_ = false) => `
<div id="dialog" x-data="apuiDialog({ open: ${open_} })">
  <button id="trigger" x-apui:trigger>Edit profile</button>
  <div id="backdrop" x-apui:backdrop></div>
  <div id="positioner" x-apui:positioner>
    <div id="content" x-apui:content>
      <h2 x-apui:title>Edit profile</h2>
      <p x-apui:description>Saved ${saved} times.</p>
      <input id="name" value="Jordan" />
      <button id="save">Save</button>
      <button id="close" x-apui:close-trigger>Close</button>
    </div>
  </div>
</div>
<button id="outside">Outside</button>`;

const isOpen = (page: Page) => page.$eval('#content', (el) => !el.hasAttribute('hidden'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');

afterAll(close);

describe('dialog', () => {
  it('renders the parts closed, with scope, part and ARIA', async () => {
    const { page, errors } = await open(markup());
    expect(await isOpen(page)).toBe(false);
    const trigger = await page.$eval('#trigger', (el) => ({
      scope: el.getAttribute('data-scope'),
      part: el.getAttribute('data-part'),
      expanded: el.getAttribute('aria-expanded'),
      haspopup: el.getAttribute('aria-haspopup'),
      controls: el.getAttribute('aria-controls'),
    }));
    expect(trigger).toEqual({
      scope: 'dialog',
      part: 'trigger',
      expanded: 'false',
      haspopup: 'dialog',
      controls: await page.$eval('#content', (el) => el.id),
    });
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens from the trigger, traps focus and locks scroll', async () => {
    const { page } = await open(markup());
    await page.click('#trigger');
    await settle(page);
    expect(await isOpen(page)).toBe(true);
    const content = await page.$eval('#content', (el) => ({
      role: el.getAttribute('role'),
      modal: el.getAttribute('aria-modal'),
      labelledby: el.getAttribute('aria-labelledby'),
      state: el.getAttribute('data-state'),
    }));
    expect(content.role).toBe('dialog');
    expect(content.modal).toBe('true');
    expect(content.state).toBe('open');
    expect(await page.$eval(`[id="${content.labelledby}"]`, (el) => el.textContent)).toBe(
      'Edit profile',
    );
    expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('true');

    // Focus moves in and Tab stays inside.
    expect(
      await page.evaluate(() =>
        document.querySelector('#content')!.contains(document.activeElement),
      ),
    ).toBe(true);
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() =>
        document.querySelector('#content')!.contains(document.activeElement),
      ),
    ).toBe(true);

    // Scroll lock and everything else hidden from assistive technology.
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
    expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBe('true');
    await page.close();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { page } = await open(markup());
    await page.click('#trigger');
    await settle(page);
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    expect(await focusedId(page)).toBe('trigger');
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
    expect(await page.$eval('#outside', (el) => el.hasAttribute('aria-hidden'))).toBe(false);
    await page.close();
  });

  it('closes on an outside click and from the close trigger', async () => {
    const { page } = await open(markup());
    await page.click('#trigger');
    await settle(page);
    await page.mouse.click(5, 5);
    await settle(page);
    expect(await isOpen(page)).toBe(false);

    await page.click('#trigger');
    await settle(page);
    await page.click('#close');
    await settle(page);
    expect(await isOpen(page)).toBe(false);
    await page.close();
  });

  it('binds open to Alpine data both ways and dispatches open-change', async () => {
    const { page } = await open(markup());
    await page.evaluate(() => {
      (window as unknown as { changes: boolean[] }).changes = [];
      document.querySelector('#dialog')!.addEventListener('open-change', (event) => {
        (window as unknown as { changes: boolean[] }).changes.push(
          (event as CustomEvent<{ open: boolean }>).detail.open,
        );
      });
    });

    // Server → client: what $wire.entangle() does when Livewire sets the property.
    await setData(page, '#dialog', 'open', true);
    expect(await isOpen(page)).toBe(true);

    // Client → server: closing writes back.
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await data(page, '#dialog', 'open')).toBe(false);
    // Like onOpenChange in React and update:open in Vue, open-change reports
    // changes the dialog makes, not ones made to the bound state.
    expect(
      await page.evaluate(() => (window as unknown as { changes: boolean[] }).changes),
    ).toEqual([false]);
    await page.close();
  });

  it('starts open when the bound state is true', async () => {
    const { page } = await open(markup(0, true));
    expect(await isOpen(page)).toBe(true);
    await page.close();
  });

  describe('morphing', () => {
    it('stays open, focused and labelled when the server re-renders', async () => {
      const { page, errors } = await open(markup());
      await page.click('#trigger');
      await settle(page);
      await page.focus('#name');

      // The server re-renders the component with new content and none of the
      // machine's attributes, as Livewire's morph does after an action.
      await morph(page, '#dialog', markup(1).replace(/<button id="outside">.*<\/button>/, ''));

      expect(await isOpen(page)).toBe(true);
      expect(await page.textContent('#content p')).toBe('Saved 1 times.');
      expect(
        await page.$eval('#content', (el) => [
          el.getAttribute('role'),
          el.getAttribute('aria-modal'),
        ]),
      ).toEqual(['dialog', 'true']);
      expect(await page.$eval('#trigger', (el) => el.getAttribute('aria-expanded'))).toBe('true');
      expect(await focusedId(page)).toBe('name');
      expect(await data(page, '#dialog', 'open')).toBe(true);

      // Behavior still works after the morph.
      await page.keyboard.press('Escape');
      await settle(page);
      expect(await isOpen(page)).toBe(false);
      expect(await focusedId(page)).toBe('trigger');
      expect(errors).toEqual([]);
      await page.close();
    });

    it('stays closed when re-rendered closed', async () => {
      const { page } = await open(markup());
      await morph(page, '#dialog', markup(2).replace(/<button id="outside">.*<\/button>/, ''));
      expect(await isOpen(page)).toBe(false);
      expect(await page.$eval('#content', (el) => el.getAttribute('data-state'))).toBe('closed');
      await page.close();
    });

    it('writes back any machine attribute something else removes', async () => {
      const { page } = await open(markup());
      await page.evaluate(() => {
        const content = document.querySelector('#content')!;
        content.removeAttribute('hidden');
        content.removeAttribute('data-state');
      });
      await settle(page);
      expect(
        await page.$eval('#content', (el) => [
          el.hasAttribute('hidden'),
          el.getAttribute('data-state'),
        ]),
      ).toEqual([true, 'closed']);
      await page.close();
    });
  });

  it('cleans up when the component is destroyed, as wire:navigate does', async () => {
    const { page } = await open('<div id="host"></div>');
    const baseline = await listenerCount(page);

    // Mount, open and close the dialog, then mount another and tear both down.
    await page.evaluate((html) => {
      const host = document.querySelector('#host')!;
      host.innerHTML = html;
    }, markup());
    await settle(page);
    await page.click('#trigger');
    await settle(page);
    await page.evaluate(() => {
      const alpine = (window as unknown as { Alpine: { destroyTree(el: Element): void } }).Alpine;
      const host = document.querySelector('#host')!;
      alpine.destroyTree(host);
      host.innerHTML = '';
    });
    await settle(page);

    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
    expect(
      await page.evaluate(() => document.querySelectorAll('[aria-hidden="true"], [inert]').length),
    ).toBe(0);
    expect(await listenerCount(page)).toBe(baseline);
    await page.close();
  });
});
