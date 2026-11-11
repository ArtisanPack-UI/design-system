/**
 * Combobox through the Alpine adapter (#35): local filtering, keyboard
 * selection, single and multiple values bound to Alpine data, an option list
 * the server morphs, remote search, and teardown.
 */
import type { Page } from 'playwright';

import { close, data, listenerCount, morph, open, setData, settle } from './browser';

const COUNTRIES: [string, string][] = [
  ['fr', 'France'],
  ['de', 'Germany'],
  ['gh', 'Ghana'],
  ['is', 'Iceland'],
  ['ci', "Côte d'Ivoire"],
];

/** The combobox as a server renders it. `options` is the x-data argument. */
const markup = (options = '{}', items = COUNTRIES) => `
<div id="cb" x-data="apuiCombobox(${options})">
  <label id="cb-label" x-apui:label>Country</label>
  <div x-apui:control>
    <input id="cb-input" x-apui:input />
    <button id="cb-toggle" x-apui:trigger>▾</button>
  </div>
  <div x-apui:positioner>
    <ul id="cb-list" x-apui:content>
      ${items.map(([value, label]) => `<li x-apui:item="{ value: '${value}', label: ${JSON.stringify(label).replace(/"/g, '&quot;')} }" data-test="${value}">${label}</li>`).join('\n      ')}
      <li id="cb-empty" x-apui:empty>No matches</li>
    </ul>
  </div>
</div>`;

const visibleItems = (page: Page) =>
  page.$$eval('#cb-list [data-part="item"]:not([hidden])', (els) =>
    els.map((el) => el.getAttribute('data-value')),
  );
const isOpen = (page: Page) => page.$eval('#cb-list', (el) => !el.hasAttribute('hidden'));

async function type(page: Page, text: string) {
  await page.click('#cb-input');
  await page.keyboard.type(text);
  await settle(page);
}

afterAll(close);

describe('combobox', () => {
  it('wires ARIA between the label, input and listbox', async () => {
    const { page, errors } = await open(markup());
    const input = await page.$eval('#cb-input', (el) => ({
      role: el.getAttribute('role'),
      expanded: el.getAttribute('aria-expanded'),
      controls: el.getAttribute('aria-controls'),
      autocomplete: el.getAttribute('aria-autocomplete'),
    }));
    expect(input).toEqual({
      role: 'combobox',
      expanded: 'false',
      controls: 'cb-list',
      autocomplete: 'list',
    });
    expect(await page.$eval('#cb-label', (el) => el.getAttribute('for'))).toBe('cb-input');
    expect(await page.$eval('#cb-list', (el) => el.getAttribute('role'))).toBe('listbox');
    expect(await page.$$eval('[role="option"]', (els) => els.length)).toBe(COUNTRIES.length);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('filters by label as you type, ignoring case and accents', async () => {
    const { page } = await open(markup());
    await type(page, 'COTE');
    expect(await isOpen(page)).toBe(true);
    expect(await visibleItems(page)).toEqual(['ci']);
    await page.fill('#cb-input', '');
    await page.keyboard.type('g');
    await settle(page);
    expect(await visibleItems(page)).toEqual(['de', 'gh']);
    expect(await page.$eval('#cb-empty', (el) => el.hasAttribute('hidden'))).toBe(true);
    await page.close();
  });

  it('shows the empty part when nothing matches', async () => {
    const { page } = await open(markup());
    await type(page, 'zzz');
    expect(await visibleItems(page)).toEqual([]);
    expect(await page.$eval('#cb-empty', (el) => el.hasAttribute('hidden'))).toBe(false);
    await page.close();
  });

  it('selects with the keyboard and binds the value', async () => {
    const { page } = await open(markup('{ value: null }'));
    await page.evaluate(() => {
      (window as unknown as { values: unknown[] }).values = [];
      document.querySelector('#cb')!.addEventListener('value-change', (event) => {
        (window as unknown as { values: unknown[] }).values.push(
          (event as CustomEvent<{ value: unknown }>).detail.value,
        );
      });
    });
    await type(page, 'ger');
    // aria-activedescendant follows the highlighted option.
    const active = await page.$eval('#cb-input', (el) => el.getAttribute('aria-activedescendant'));
    expect(await page.$eval(`[id="${active}"]`, (el) => el.getAttribute('data-value'))).toBe('de');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await data(page, '#cb', 'value')).toBe('de');
    expect(await page.inputValue('#cb-input')).toBe('Germany');
    expect(await isOpen(page)).toBe(false);
    expect(await page.evaluate(() => (window as unknown as { values: unknown[] }).values)).toEqual([
      'de',
    ]);

    // Reopening lists everything again, not just the selected label.
    await page.click('#cb-toggle');
    await settle(page);
    expect(await visibleItems(page)).toEqual(COUNTRIES.map(([value]) => value));
    await page.close();
  });

  it('takes a value from outside, as $wire.entangle() sets it', async () => {
    const { page } = await open(markup("{ value: 'fr' }"));
    // The label shows on load, before anything is picked.
    expect(await page.inputValue('#cb-input')).toBe('France');
    expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
      'true',
    );
    await setData(page, '#cb', 'value', 'is');
    expect(await page.inputValue('#cb-input')).toBe('Iceland');
    expect(await page.$eval('[data-value="is"]', (el) => el.getAttribute('aria-selected'))).toBe(
      'true',
    );
    expect(await page.$eval('[data-value="fr"]', (el) => el.getAttribute('aria-selected'))).toBe(
      'false',
    );
    await page.close();
  });

  it('selects several values with multiple', async () => {
    const { page } = await open(markup('{ multiple: true, value: [] }'));
    await page.click('#cb-input');
    await settle(page);
    await page.click('[data-value="gh"]');
    await settle(page);
    await page.click('[data-value="fr"]');
    await settle(page);
    expect(await data(page, '#cb', 'value')).toEqual(['gh', 'fr']);
    await page.close();
  });

  describe('morphing', () => {
    it('picks up a new option list from the server', async () => {
      const { page, errors } = await open(markup());
      await type(page, 'a');
      expect(await isOpen(page)).toBe(true);

      // The server answers with a different list.
      await morph(
        page,
        '#cb',
        markup('{}', [
          ['ar', 'Argentina'],
          ['at', 'Austria'],
          ['ca', 'Canada'],
        ]),
      );

      expect(await isOpen(page)).toBe(true);
      expect(await page.$eval('#cb-input', (el) => el.getAttribute('role'))).toBe('combobox');
      expect(await visibleItems(page)).toEqual(['ar', 'at', 'ca']);
      expect(await page.$$eval('[data-test="fr"]', (els) => els.length)).toBe(0);

      // Keyboard navigation runs over the new items.
      await page.keyboard.press('ArrowDown');
      await settle(page);
      const active = await page.$eval('#cb-input', (el) =>
        el.getAttribute('aria-activedescendant'),
      );
      expect(await page.$eval(`[id="${active}"]`, (el) => el.getAttribute('data-value'))).toMatch(
        /^(ar|at|ca)$/,
      );
      await page.keyboard.press('Enter');
      await settle(page);
      expect(['ar', 'at', 'ca']).toContain(await data(page, '#cb', 'value'));
      expect(errors).toEqual([]);
      await page.close();
    });
  });

  describe('remote', () => {
    it('hands the search to the server and does not filter itself', async () => {
      const { page } = await open(markup("{ remote: true, search: '' }"));
      await type(page, 'zz');
      expect(await data(page, '#cb', 'search')).toBe('zz');
      // The server decides what matches, so nothing is hidden here.
      expect(await visibleItems(page)).toEqual(COUNTRIES.map(([value]) => value));

      // The server re-renders with its results.
      await morph(page, '#cb', markup("{ remote: true, search: '' }", [['zw', 'Zimbabwe']]));
      expect(await visibleItems(page)).toEqual(['zw']);

      // Keyboard selection runs over the server's items, not the replaced ones.
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await settle(page);
      expect(await data(page, '#cb', 'value')).toBe('zw');
      await page.close();
    });
  });

  describe('tags: multiple with chips and create', () => {
    /** A multiple combobox with chips and a create option, as the Blade view renders it. */
    const tags = (options = '{}') => `
<div id="cb" x-data="apuiCombobox(Object.assign({ multiple: true, allowCreate: true, value: [] }, ${options}))">
  <label id="cb-label" x-apui:label>Tags</label>
  <div id="cb-box" x-apui:control>
    <template x-for="chip in chips" :key="chip.value">
      <span class="chip" data-scope="combobox" data-part="chip" :data-value="chip.value" :data-color="chip.color">
        <span x-text="chip.label"></span>
        <button type="button" data-scope="combobox" data-part="chip-remove" :aria-label="removeLabel(chip.label)" x-on:click="remove(chip.value)">x</button>
      </span>
    </template>
    <input id="cb-input" x-apui:input />
  </div>
  <div x-apui:positioner>
    <div id="cb-list" x-apui:content>
      ${COUNTRIES.map(([value, label]) => `<div x-apui:item="{ value: '${value}', label: ${JSON.stringify(label).replace(/"/g, '&quot;')}, color: 'info' }"><span x-apui:item-text x-html="itemHtml(${JSON.stringify(label).replace(/"/g, '&quot;')})">${label}</span></div>`).join('\n      ')}
      <div x-apui:item="createOption" data-create><span x-apui:item-text x-text="createText"></span></div>
      <div id="cb-empty" x-apui:empty x-text="emptyText"></div>
    </div>
  </div>
  <span id="cb-status" role="status" x-text="status"></span>
</div>`;

    const chips = (page: Page) =>
      page.$$eval('[data-part="chip"]', (els) => els.map((el) => el.getAttribute('data-value')));

    it('offers to create unmatched text, adds it as a chip and dispatches create', async () => {
      const { page, errors } = await open(tags());
      await page.evaluate(() => {
        (window as unknown as { created: unknown[] }).created = [];
        document.querySelector('#cb')!.addEventListener('create', (event) => {
          (window as unknown as { created: unknown[] }).created.push(
            (event as CustomEvent<{ value: unknown }>).detail.value,
          );
        });
      });
      await type(page, 'Rooftop');
      expect(await page.$eval('[data-create]', (el) => el.hasAttribute('hidden'))).toBe(false);
      expect(await page.textContent('[data-create]')).toBe('Create “Rooftop”');
      // Nothing else matches, so the create option is highlighted.
      await page.keyboard.press('Enter');
      await settle(page);
      expect(await data(page, '#cb', 'value')).toEqual(['Rooftop']);
      expect(await chips(page)).toEqual(['Rooftop']);
      expect(
        await page.evaluate(() => (window as unknown as { created: unknown[] }).created),
      ).toEqual(['Rooftop']);
      // The input clears for the next tag.
      expect(await page.inputValue('#cb-input')).toBe('');
      expect(errors).toEqual([]);
      await page.close();
    });

    it("doesn't offer to create a value that exists, ignoring case and accents", async () => {
      const { page } = await open(tags("{ value: ['Rooftop'] }"));
      await type(page, 'cote d’ivoire'.replace('’', "'"));
      expect(await page.$eval('[data-create]', (el) => el.hasAttribute('hidden'))).toBe(true);
      await page.fill('#cb-input', '');
      await page.keyboard.type('ROOFTOP');
      await settle(page);
      expect(await page.$eval('[data-create]', (el) => el.hasAttribute('hidden'))).toBe(true);
      await page.close();
    });

    it('marks the typed text in labels', async () => {
      const { page } = await open(tags());
      await type(page, 'erm');
      expect(await page.$eval('[data-value="de"] [data-part="mark"]', (el) => el.textContent)).toBe(
        'erm',
      );
      expect(
        await page.$eval('[data-value="de"] [data-part="item-text"]', (el) => el.textContent),
      ).toBe('Germany');
      await page.close();
    });

    it('removes chips with their button and with Backspace, and announces it', async () => {
      const { page } = await open(tags("{ value: ['fr', 'gh', 'is'] }"));
      expect(await chips(page)).toEqual(['fr', 'gh', 'is']);
      // Labels come from the items.
      expect(
        await page.$eval('[data-value="gh"] [data-part="chip-remove"]', (el) =>
          el.getAttribute('aria-label'),
        ),
      ).toBe('Remove Ghana');
      await page.click('[data-value="gh"] [data-part="chip-remove"]');
      await settle(page);
      expect(await data(page, '#cb', 'value')).toEqual(['fr', 'is']);
      expect(await page.textContent('#cb-status')).toBe('Removed Ghana.');

      await page.click('#cb-input');
      await page.keyboard.press('Backspace');
      await settle(page);
      expect(await data(page, '#cb', 'value')).toEqual(['fr']);
      expect(await page.textContent('#cb-status')).toBe('Removed Iceland.');
      expect(await chips(page)).toEqual(['fr']);
      await page.close();
    });

    it('stops at max and disables the other options', async () => {
      const { page } = await open(tags("{ max: 2, value: ['fr'] }"));
      await page.click('#cb-input');
      await settle(page);
      await page.click('[data-value="gh"]');
      await settle(page);
      expect(await data(page, '#cb', 'value')).toEqual(['fr', 'gh']);
      expect(await page.$eval('[data-value="is"]', (el) => el.getAttribute('aria-disabled'))).toBe(
        'true',
      );
      await page.click('[data-value="is"]', { force: true });
      await settle(page);
      expect(await data(page, '#cb', 'value')).toEqual(['fr', 'gh']);
      await page.close();
    });

    it('shows the empty text with the search, and the loading text while loading', async () => {
      const { page } = await open(tags('{ allowCreate: false }'));
      await type(page, 'zzz');
      expect(await page.textContent('#cb-empty')).toBe('No matches for “zzz”.');
      await setData(page, '#cb', 'loading', true);
      expect(await page.textContent('#cb-empty')).toBe('Loading…');
      expect(await page.$eval('#cb-list', (el) => el.getAttribute('data-loading'))).toBe('');
      await page.close();
    });

    it('takes translated labels', async () => {
      const { page } = await open(
        tags(
          "{ allowCreate: true, labels: { create: 'Créer « {value} »', remove: 'Retirer {label}' }, value: ['fr'] }",
        ),
      );
      expect(
        await page.$eval('[data-part="chip-remove"]', (el) => el.getAttribute('aria-label')),
      ).toBe('Retirer France');
      await type(page, 'Nouveau');
      expect(await page.textContent('[data-create]')).toBe('Créer « Nouveau »');
      await page.close();
    });
  });

  describe('search', () => {
    it('dispatches search-change as you type and debounces the entangled search', async () => {
      const { page } = await open(markup("{ remote: true, search: '', debounce: 200 }"));
      await page.evaluate(() => {
        (window as unknown as { searches: unknown[] }).searches = [];
        document.querySelector('#cb')!.addEventListener('search-change', (event) => {
          (window as unknown as { searches: unknown[] }).searches.push(
            (event as CustomEvent<{ search: unknown }>).detail.search,
          );
        });
      });
      await type(page, 'ab');
      expect(
        await page.evaluate(() => (window as unknown as { searches: unknown[] }).searches),
      ).toEqual(['a', 'ab']);
      expect(await data(page, '#cb', 'search')).toBe('');
      await page.waitForTimeout(300);
      expect(await data(page, '#cb', 'search')).toBe('ab');
      await page.close();
    });

    it("renders with the server's search text in the input, filtered", async () => {
      const { page } = await open(markup("{ search: 'gh' }"));
      expect(await page.inputValue('#cb-input')).toBe('gh');
      expect(await visibleItems(page)).toEqual(['gh']);
      await page.close();
    });
  });

  it('binds a number item value as a number, as a Livewire integer id', async () => {
    const { page } = await open(`
<div id="cb" x-data="apuiCombobox({ value: 1 })">
  <label id="cb-label" x-apui:label>Floor</label>
  <div x-apui:control><input id="cb-input" x-apui:input /></div>
  <div x-apui:positioner>
    <ul id="cb-list" x-apui:content>
      <li x-apui:item="{ value: 1, label: 'First floor' }">First floor</li>
      <li x-apui:item="{ value: 3, label: 'Third floor' }">Third floor</li>
    </ul>
  </div>
</div>`);
    expect(await page.inputValue('#cb-input')).toBe('First floor');
    await page.fill('#cb-input', '');
    await type(page, 'third');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await data(page, '#cb', 'value')).toBe(3);
    await page.close();
  });

  describe('form submission', () => {
    /** The combobox in a form, with hidden inputs for its values, as the Blade view renders them. */
    const inForm = (options: string) => `
<form id="f">${markup(options).replace(
      '<label id="cb-label"',
      '<template x-for="entry in formValues" :key="entry"><input type="hidden" name="country[]" :value="entry" /></template>\n  <label id="cb-label"',
    )}</form>`;
    const submitted = (page: Page) =>
      page.$eval('#f', (form) => [...new FormData(form as HTMLFormElement).entries()]);

    it('submits one hidden input per value, never the text input', async () => {
      const { page } = await open(inForm("{ multiple: true, value: ['fr'] }"));
      expect(await submitted(page)).toEqual([['country[]', 'fr']]);
      await page.click('#cb-input');
      await settle(page);
      await page.click('[data-value="gh"]');
      await settle(page);
      expect(await submitted(page)).toEqual([
        ['country[]', 'fr'],
        ['country[]', 'gh'],
      ]);
      expect(await page.$eval('#cb-input', (el) => el.getAttribute('name'))).toBeNull();
      await page.close();
    });

    it('submits nothing while empty', async () => {
      const { page } = await open(inForm('{ value: null }'));
      expect(await submitted(page)).toEqual([]);
      await page.close();
    });
  });

  it('renames the field parts: box around the control (D-018)', async () => {
    const { page } = await open(markup());
    expect(await page.$eval('#cb-input', (el) => el.getAttribute('data-part'))).toBe('control');
    expect(await page.$eval('#cb-input', (el) => el.parentElement!.getAttribute('data-part'))).toBe(
      'box',
    );
    await page.close();
  });

  it('cleans up when destroyed, adding no listeners per instance', async () => {
    const { page } = await open('<div id="host"></div>');
    const cycle = async () => {
      await page.evaluate((html) => {
        document.querySelector('#host')!.innerHTML = html;
      }, markup());
      await settle(page);
      await type(page, 'g');
      await page.keyboard.press('Escape');
      await page.evaluate(() => {
        const alpine = (window as unknown as { Alpine: { destroyTree(el: Element): void } }).Alpine;
        const host = document.querySelector('#host')!;
        alpine.destroyTree(host);
        host.innerHTML = '';
      });
      await settle(page);
    };
    // Zag tracks keyboard versus pointer focus once per window, shared by every
    // widget, so the first mount adds those listeners for good.
    await cycle();
    const baseline = await listenerCount(page);
    await cycle();
    await cycle();
    expect(await listenerCount(page)).toBe(baseline);
    await page.close();
  });
});
