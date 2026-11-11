/**
 * Dialog and Combobox through the React and Vue adapters (#36): the same
 * behavior the Alpine tests check, plus each stack's controlled and
 * uncontrolled patterns.
 */
import type { Page } from 'playwright';

import {
  close,
  events,
  getParent,
  listenerCount,
  mount,
  openStack,
  setParent,
  settle,
  type Stack,
  unmount,
} from './browser';

const COUNTRY_VALUES = ['fr', 'de', 'gh', 'is', 'ci'];

const dialogOpen = (page: Page) => page.$eval('#content', (el) => !el.hasAttribute('hidden'));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const listOpen = (page: Page) => page.$eval('#cb-list', (el) => !el.hasAttribute('hidden'));
const itemValues = (page: Page) =>
  page.$$eval('#cb-list [data-part="item"]:not([hidden])', (els) =>
    els.map((el) => el.getAttribute('data-value')),
  );
const named = (list: [string, unknown][], name: string) =>
  list.filter(([event]) => event === name).map(([, details]) => details);

async function type(page: Page, text: string) {
  await page.click('#cb-input');
  await page.keyboard.type(text);
  await settle(page);
}

afterAll(close);

describe.each<Stack>(['react', 'vue'])('%s adapter', (stack) => {
  describe('dialog', () => {
    it('renders the parts closed, with scope, part, ARIA and the authored ids', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'uncontrolled' });
      expect(await dialogOpen(page)).toBe(false);
      expect(
        await page.$eval('#trigger', (el) => ({
          scope: el.getAttribute('data-scope'),
          part: el.getAttribute('data-part'),
          expanded: el.getAttribute('aria-expanded'),
          haspopup: el.getAttribute('aria-haspopup'),
          controls: el.getAttribute('aria-controls'),
        })),
      ).toEqual({
        scope: 'dialog',
        part: 'trigger',
        expanded: 'false',
        haspopup: 'dialog',
        controls: 'content',
      });
      expect(errors).toEqual([]);
      await page.close();
    });

    it('uncontrolled: opens from the trigger, traps focus, closes on Escape', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'uncontrolled' });
      await page.click('#trigger');
      await settle(page);
      expect(await dialogOpen(page)).toBe(true);
      expect(
        await page.$eval('#content', (el) => [
          el.getAttribute('role'),
          el.getAttribute('aria-modal'),
        ]),
      ).toEqual(['dialog', 'true']);
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
      expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
      expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBe('true');

      await page.keyboard.press('Escape');
      await settle(page);
      expect(await dialogOpen(page)).toBe(false);
      expect(await focusedId(page)).toBe('trigger');
      expect(await page.$eval('#outside', (el) => el.hasAttribute('aria-hidden'))).toBe(false);
      expect(named(await events(page), 'open-change')).toEqual([{ open: true }, { open: false }]);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('uncontrolled: starts open with defaultOpen', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'uncontrolled', initial: true });
      expect(await dialogOpen(page)).toBe(true);
      expect(await getParent(page, 'open')).toBe(true);
      await page.close();
    });

    it('controlled: follows the parent both ways', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'controlled' });

      // Parent → widget. Setting the state doesn't fire onOpenChange.
      await setParent(page, 'open', true);
      expect(await dialogOpen(page)).toBe(true);
      expect(named(await events(page), 'open-change')).toEqual([]);

      // Widget → parent.
      await page.click('#close');
      await settle(page);
      expect(await getParent(page, 'open')).toBe(false);
      expect(await dialogOpen(page)).toBe(false);
      expect(named(await events(page), 'open-change')).toEqual([{ open: false }]);

      await setParent(page, 'open', true);
      await setParent(page, 'open', false);
      expect(await dialogOpen(page)).toBe(false);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('controlled: stays as the parent says when it ignores a change', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'locked', initial: true });
      await page.keyboard.press('Escape');
      await settle(page);
      expect(named(await events(page), 'open-change')).toEqual([{ open: false }]);
      expect(await dialogOpen(page)).toBe(true);
      await page.close();
    });

    it('cleans up on unmount, adding no listeners per instance', async () => {
      const { page } = await openStack(stack);
      const cycle = async () => {
        await mount(page, 'dialog', { mode: 'uncontrolled', initial: true });
        expect(await page.$eval('#outside', (el) => el.getAttribute('aria-hidden'))).toBe('true');
        await unmount(page);
        expect(await page.$eval('#outside', (el) => el.hasAttribute('aria-hidden'))).toBe(false);
        expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe(
          'hidden',
        );
      };
      // Zag tracks keyboard versus pointer focus once per window.
      await cycle();
      const baseline = await listenerCount(page);
      await cycle();
      await cycle();
      expect(await listenerCount(page)).toBe(baseline);
      await page.close();
    });
  });

  describe('combobox', () => {
    it('wires ARIA between the label, input and listbox', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'uncontrolled' });
      expect(
        await page.$eval('#cb-input', (el) => ({
          role: el.getAttribute('role'),
          expanded: el.getAttribute('aria-expanded'),
          controls: el.getAttribute('aria-controls'),
          autocomplete: el.getAttribute('aria-autocomplete'),
        })),
      ).toEqual({ role: 'combobox', expanded: 'false', controls: 'cb-list', autocomplete: 'list' });
      expect(await page.$eval('#cb-label', (el) => el.getAttribute('for'))).toBe('cb-input');
      expect(await page.$eval('#cb-list', (el) => el.getAttribute('role'))).toBe('listbox');
      expect(await page.$$eval('[role="option"]', (els) => els.length)).toBe(5);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('filters by label as you type and shows the empty part', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'uncontrolled' });
      await type(page, 'COTE');
      expect(await listOpen(page)).toBe(true);
      expect(await itemValues(page)).toEqual(['ci']);
      expect(await page.$eval('#cb-empty', (el) => el.hasAttribute('hidden'))).toBe(true);
      await page.fill('#cb-input', 'zzz');
      await settle(page);
      expect(await itemValues(page)).toEqual([]);
      expect(await page.$eval('#cb-empty', (el) => el.hasAttribute('hidden'))).toBe(false);
      await page.close();
    });

    it('uncontrolled: shows the defaultValue label and selects with the keyboard', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'uncontrolled', initial: 'fr' });
      expect(await page.inputValue('#cb-input')).toBe('France');
      expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
        'true',
      );

      await page.fill('#cb-input', '');
      await type(page, 'ger');
      const active = await page.$eval('#cb-input', (el) =>
        el.getAttribute('aria-activedescendant'),
      );
      expect(await page.$eval(`[id="${active}"]`, (el) => el.getAttribute('data-value'))).toBe(
        'de',
      );
      await page.keyboard.press('Enter');
      await settle(page);
      expect(await getParent(page, 'value')).toBe('de');
      expect(await page.inputValue('#cb-input')).toBe('Germany');
      expect(await listOpen(page)).toBe(false);
      expect(named(await events(page), 'value-change')).toEqual([{ value: 'de' }]);

      // Reopening lists everything again, not just the selected label.
      await page.click('#cb-toggle');
      await settle(page);
      expect(await itemValues(page)).toEqual(COUNTRY_VALUES);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('controlled: takes a value from the parent and reports selections', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'controlled', initial: 'fr' });
      expect(await page.inputValue('#cb-input')).toBe('France');

      await setParent(page, 'value', 'is');
      expect(await page.inputValue('#cb-input')).toBe('Iceland');
      expect(await page.$eval('[data-value="is"]', (el) => el.getAttribute('aria-selected'))).toBe(
        'true',
      );
      expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
        'false',
      );
      expect(named(await events(page), 'value-change')).toEqual([]);

      await page.click('#cb-toggle');
      await settle(page);
      await page.click('[data-value="gh"]');
      await settle(page);
      expect(await getParent(page, 'value')).toBe('gh');
      expect(await page.inputValue('#cb-input')).toBe('Ghana');
      expect(named(await events(page), 'value-change')).toEqual([{ value: 'gh' }]);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('controlled: keeps the parent value when it ignores a selection', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'locked', initial: 'fr' });
      await page.click('#cb-toggle');
      await settle(page);
      await page.click('[data-value="gh"]');
      await settle(page);
      expect(named(await events(page), 'value-change')).toEqual([{ value: 'gh' }]);
      expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
        'true',
      );
      expect(await page.$eval('[data-value="gh"]', (el) => el.getAttribute('aria-selected'))).toBe(
        'false',
      );
      await page.close();
    });

    it('selects several values with multiple, as arrays', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'controlled', multiple: true });
      await page.click('#cb-input');
      await settle(page);
      await page.click('[data-value="gh"]');
      await settle(page);
      await page.click('[data-value="fr"]');
      await settle(page);
      expect(await getParent(page, 'value')).toEqual(['gh', 'fr']);
      expect(named(await events(page), 'value-change')).toEqual([
        { value: ['gh'] },
        { value: ['gh', 'fr'] },
      ]);
      await page.close();
    });

    it('uncontrolled: enforces max, disables the rest, and keeps reporting creates', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'combobox', {
        mode: 'uncontrolled',
        multiple: true,
        initial: [],
        max: 2,
        allowCreate: true,
      });
      await page.click('#cb-input');
      await settle(page);
      await page.click('[data-value="gh"]');
      await settle(page);
      // A create after an earlier pick is still reported.
      await type(page, 'Atlantis');
      await page.keyboard.press('Enter');
      await settle(page);
      expect(await getParent(page, 'value')).toEqual(['gh', 'Atlantis']);
      expect(named(await events(page), 'create')).toEqual([{ value: 'Atlantis' }]);
      // At max: the others are disabled and a click is refused.
      await page.fill('#cb-input', '');
      await settle(page);
      expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-disabled'))).toBe(
        'true',
      );
      await page.click('[data-value="fr"]', { force: true });
      await settle(page);
      expect(await getParent(page, 'value')).toEqual(['gh', 'Atlantis']);
      expect(named(await events(page), 'value-change')).toEqual([
        { value: ['gh'] },
        { value: ['gh', 'Atlantis'] },
      ]);
      await page.close();
    });

    it('remote: reports the search, does not filter, and takes new items', async () => {
      const { page } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'controlled', remote: true });
      await type(page, 'zz');
      expect(
        named(await events(page), 'input-value-change').filter(
          (details) => (details as { reason?: string }).reason === 'input-change',
        ),
      ).toEqual([
        { inputValue: 'z', reason: 'input-change' },
        { inputValue: 'zz', reason: 'input-change' },
      ]);
      expect(await itemValues(page)).toEqual(COUNTRY_VALUES);

      // The server answers.
      await setParent(page, 'items', [['zw', 'Zimbabwe']]);
      expect(await itemValues(page)).toEqual(['zw']);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await settle(page);
      expect(await getParent(page, 'value')).toBe('zw');
      await page.close();
    });

    it('opens the listbox on the logical side in RTL', async () => {
      const { page } = await openStack(stack, { dir: 'rtl' });
      await page.addStyleTag({
        content: '#cb { inline-size: 300px; margin: 40px auto; } #cb-list { inline-size: 400px; }',
      });
      await mount(page, 'combobox', { mode: 'uncontrolled' });
      await page.click('#cb-toggle');
      await settle(page);
      await settle(page);
      const [control, list] = await Promise.all([
        page.$eval('[data-part="box"]', (el) => el.getBoundingClientRect().toJSON()),
        page.$eval('#cb-list', (el) => el.getBoundingClientRect().toJSON()),
      ]);
      // bottom-start in RTL aligns the listbox with the control's right edge,
      // and it's wider than the control, so it overhangs on the left.
      expect(Math.abs(control.right - list.right)).toBeLessThan(2);
      expect(list.left).toBeLessThan(control.left - 50);
      expect(list.top).toBeGreaterThanOrEqual(control.bottom);
      await page.close();
    });

    it('cleans up on unmount, adding no listeners per instance', async () => {
      const { page } = await openStack(stack);
      const cycle = async () => {
        await mount(page, 'combobox', { mode: 'uncontrolled' });
        await type(page, 'g');
        await page.keyboard.press('Escape');
        await unmount(page);
      };
      await cycle();
      const baseline = await listenerCount(page);
      await cycle();
      await cycle();
      expect(await listenerCount(page)).toBe(baseline);
      await page.close();
    });
  });
});
