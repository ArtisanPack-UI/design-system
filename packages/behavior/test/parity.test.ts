/**
 * The Alpine, React and Vue adapters emit the same parts and data attributes
 * (#36). Each stack renders the same Dialog and Combobox, with the same ids,
 * and every element carrying a `data-scope` must have identical attributes,
 * closed and open.
 */
import type { Page } from 'playwright';

import { close, mount, open, openStack, settle, type Stack } from './browser';
import { COUNTRIES, MENU_ITEMS } from './fixtures/shared';

/** Alpine markup with the same structure and ids as the React and Vue fixtures. */
const alpineDialog = `
<div id="dialog" x-data="apuiDialog({ id: 'parity' })">
  <button id="trigger" x-apui:trigger>Edit profile</button>
  <div id="backdrop" x-apui:backdrop></div>
  <div id="positioner" x-apui:positioner>
    <div id="content" x-apui:content>
      <h2 x-apui:title>Edit profile</h2>
      <p x-apui:description>Saved 0 times.</p>
      <input id="name" value="Jordan" />
      <button id="save">Save</button>
      <button id="close" x-apui:close-trigger>Close</button>
    </div>
  </div>
</div>
<button id="outside">Outside</button>`;

const alpineCombobox = `
<div id="cb" x-data="apuiCombobox({ id: 'parity', value: 'de' })">
  <label id="cb-label" x-apui:label>Country</label>
  <div x-apui:control>
    <input id="cb-input" x-apui:input />
    <button id="cb-toggle" x-apui:trigger>▾</button>
  </div>
  <div x-apui:positioner>
    <ul id="cb-list" x-apui:content>
      ${COUNTRIES.map(([value, label]) => `<li x-apui:item="{ value: '${value}', label: ${JSON.stringify(label).replace(/"/g, '&quot;')} }">${label}</li>`).join('\n      ')}
      <li id="cb-empty" x-apui:empty>No matches</li>
    </ul>
  </div>
</div>`;

const alpineMenu = `
<div id="menu" x-data="apuiDropdownMenu({ id: 'parity' })">
  <button id="trigger" x-apui:trigger>Options</button>
  <div id="positioner" x-apui:positioner>
    <div id="content" x-apui:content>
      <div id="group" x-apui:item-group="{ id: 'edit' }">
        <div id="group-label" x-apui:item-group-label="{ htmlFor: 'edit' }">Edit</div>
        ${MENU_ITEMS.map(([value, label, disabled]) => `<div x-apui:item="{ value: '${value}', disabled: ${disabled} }"><span x-apui:item-text="{ value: '${value}' }">${label}</span></div>`).join('\n        ')}
      </div>
      <hr x-apui:separator>
      <div x-apui:option-item="{ type: 'checkbox', value: 'grid', checked: false }">
        <span x-apui:item-indicator="{ type: 'checkbox', value: 'grid', checked: false }">✓</span>
        <span x-apui:item-text="{ type: 'checkbox', value: 'grid', checked: false }">Show grid</span>
      </div>
    </div>
  </div>
</div>`;

const alpineToaster = `
<div id="toaster" x-data="apuiToaster({ id: 'parity', duration: 0, label: 'Notifications' })">
  <div x-apui:group>
    <template x-for="(entry, index) in toasts" :key="entry.id">
      <div x-data="apuiToast(entry, index)" x-apui:root>
        <span x-apui:icon></span>
        <p x-apui:title x-text="entry.title"></p>
        <p x-apui:description x-text="entry.description"></p>
        <button x-apui:close-trigger>×</button>
      </div>
    </template>
  </div>
</div>`;

const PARITY_TOAST = {
  id: 'parity-toast',
  title: 'Listing saved',
  description: 'It is live now.',
  color: 'success',
};

/**
 * Every `data-scope` element's attributes, in DOM order. Left out: Alpine's
 * own directives, `class` and `style` (author-owned, and positioning writes
 * pixel values), and `value`, which each stack sets as a property.
 */
function snapshot(page: Page) {
  return page.$$eval('[data-scope]', (els) =>
    els.map((el) => {
      const attrs: Record<string, string> = { tag: el.tagName.toLowerCase() };
      for (const { name, value } of Array.from(el.attributes).sort((a, b) =>
        a.name.localeCompare(b.name),
      )) {
        if (name.startsWith('x-') || ['class', 'style', 'value'].includes(name)) continue;
        // A toast's height is measured, in pixels, as it mounts.
        if (name === 'data-mounted') continue;
        attrs[name] = value;
      }
      return attrs;
    }),
  );
}

async function states(page: Page, trigger: string) {
  const closed = await snapshot(page);
  await page.click(trigger);
  await settle(page);
  await settle(page);
  const opened = await snapshot(page);
  return { closed, opened };
}

afterAll(close);

/** The toaster with one toast in it. */
async function toastState(page: Page, add: () => Promise<unknown>) {
  await add();
  await settle(page);
  await settle(page);
  return snapshot(page);
}

describe('parity across Alpine, React and Vue', () => {
  let alpine: { dialog: unknown; combobox: unknown; menu: unknown; toast: unknown };

  beforeAll(async () => {
    const dialogPage = await open(alpineDialog);
    const dialog = await states(dialogPage.page, '#trigger');
    await dialogPage.page.close();
    const comboboxPage = await open(alpineCombobox);
    const combobox = await states(comboboxPage.page, '#cb-toggle');
    await comboboxPage.page.close();
    const menuPage = await open(alpineMenu);
    const menu = await states(menuPage.page, '#trigger');
    await menuPage.page.close();
    const toastPage = await open(alpineToaster);
    const toast = await toastState(toastPage.page, () =>
      toastPage.page.evaluate(
        (detail) => window.dispatchEvent(new CustomEvent('toast', { detail })),
        PARITY_TOAST,
      ),
    );
    await toastPage.page.close();
    alpine = { dialog, combobox, menu, toast };
  });

  it('snapshots every part', () => {
    const { dialog, combobox } = alpine as {
      dialog: { closed: { 'data-part': string }[] };
      combobox: { closed: { 'data-part': string }[] };
    };
    expect(dialog.closed.map((part) => part['data-part'])).toEqual([
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'title',
      'description',
      'close-trigger',
    ]);
    expect(new Set(combobox.closed.map((part) => part['data-part']))).toEqual(
      new Set(['label', 'box', 'control', 'trigger', 'positioner', 'content', 'item', 'empty']),
    );
    const { menu, toast } = alpine as {
      menu: { closed: { 'data-part': string }[] };
      toast: { 'data-part': string }[];
    };
    expect(new Set(menu.closed.map((part) => part['data-part']))).toEqual(
      new Set([
        'trigger',
        'positioner',
        'content',
        'item-group',
        'item-group-label',
        'item',
        'item-text',
        'separator',
        'item-indicator',
      ]),
    );
    expect(toast.map((part) => part['data-part'])).toEqual([
      'group',
      'root',
      'icon',
      'title',
      'description',
      'close-trigger',
    ]);
  });

  describe.each<Stack>(['react', 'vue'])('%s', (stack) => {
    it('dialog matches Alpine, closed and open', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'uncontrolled', id: 'parity' });
      expect(await states(page, '#trigger')).toEqual(alpine.dialog);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('dropdown menu matches Alpine, closed and open', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'menu', { mode: 'uncontrolled', id: 'parity' });
      expect(await states(page, '#trigger')).toEqual(alpine.menu);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('toaster and toast match Alpine', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'toaster', { id: 'parity' });
      const state = await toastState(page, () =>
        page.evaluate(
          (detail) =>
            (window as unknown as { fixture: { toast(o: object): void } }).fixture.toast(detail),
          PARITY_TOAST,
        ),
      );
      expect(state).toEqual(alpine.toast);
      expect(errors).toEqual([]);
      await page.close();
    });

    it('combobox matches Alpine, closed and open', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'combobox', { mode: 'uncontrolled', id: 'parity', initial: 'de' });
      expect(await states(page, '#cb-toggle')).toEqual(alpine.combobox);
      expect(errors).toEqual([]);
      await page.close();
    });
  });
});
