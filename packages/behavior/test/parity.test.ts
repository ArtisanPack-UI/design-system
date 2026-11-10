/**
 * The Alpine, React and Vue adapters emit the same parts and data attributes
 * (#36). Each stack renders the same Dialog and Combobox, with the same ids,
 * and every element carrying a `data-scope` must have identical attributes,
 * closed and open.
 */
import type { Page } from 'playwright';

import { close, mount, open, openStack, settle, type Stack } from './browser';
import { COUNTRIES } from './fixtures/shared';

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

describe('parity across Alpine, React and Vue', () => {
  let alpine: { dialog: unknown; combobox: unknown };

  beforeAll(async () => {
    const dialogPage = await open(alpineDialog);
    const dialog = await states(dialogPage.page, '#trigger');
    await dialogPage.page.close();
    const comboboxPage = await open(alpineCombobox);
    const combobox = await states(comboboxPage.page, '#cb-toggle');
    await comboboxPage.page.close();
    alpine = { dialog, combobox };
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
      new Set(['label', 'control', 'input', 'trigger', 'positioner', 'content', 'item', 'empty']),
    );
  });

  describe.each<Stack>(['react', 'vue'])('%s', (stack) => {
    it('dialog matches Alpine, closed and open', async () => {
      const { page, errors } = await openStack(stack);
      await mount(page, 'dialog', { mode: 'uncontrolled', id: 'parity' });
      expect(await states(page, '#trigger')).toEqual(alpine.dialog);
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
