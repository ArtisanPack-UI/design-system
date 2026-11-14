/**
 * Markdown (#65) in a plain form through the Alpine adapter: `apuiMarkdown`
 * holds the source both Textareas bind to and renders the draft, so the
 * Preview and Split panels show what's typed; Write's Textarea stays enabled
 * on Preview so the form posts the source, and an invalid one opens Write.
 * The markup is Livewire UI Components' write mode without `wire:model`.
 */
import { renderMarkdown } from '../src/data/markdown';
import { markdownComponent } from '../src/alpine/markdown';
import { close, open, settle } from './browser';

const panel = (tab: string, inner: string) => `
  <div id="md-content-${tab}" x-apui:content="{ value: '${tab}' }">${inner}</div>`;
const textarea = (tab: string, disabled: string, invalid = '') => `
  <textarea id="md-${tab}-source" name="notes" required x-model="source"
    x-bind:disabled="${disabled}" ${invalid}></textarea>`;
const preview = (id: string) =>
  `<div id="${id}" data-part="preview" x-html="html"><p>server</p></div>`;

const markup = (sanitize = true) => `
<form id="form">
  <div id="md" x-data="apuiMarkdown({ view: 'write', source: '', sanitize: ${sanitize} })"
    x-on:value-change="if ($event.target.matches('.apui-tabs')) { view = $event.detail.value }">
    <div class="apui-tabs" id="md-tabs" x-data="apuiTabs({ value: 'write' })" x-apui:root>
      <div x-apui:list>
        <button type="button" id="md-trigger-write" x-apui:trigger="{ value: 'write' }">Write</button>
        <button type="button" id="md-trigger-preview" x-apui:trigger="{ value: 'preview' }">Preview</button>
        <button type="button" id="md-trigger-split" x-apui:trigger="{ value: 'split' }">Split</button>
      </div>
      ${panel('write', textarea('write', "view === 'split'", `x-on:invalid="select('write')"`))}
      ${panel('preview', preview('preview-only'))}
      ${panel('split', textarea('split', "view !== 'split'") + preview('preview-split'))}
    </div>
  </div>
</form>`;

afterAll(close);

describe('apuiMarkdown', () => {
  it('renders nothing on Write and the draft elsewhere, with the sanitize setting', () => {
    const escaped = markdownComponent({ source: '<kbd>K</kbd> **b**' });
    expect(escaped.view).toBe('write');
    expect(escaped.html).toBe('');
    escaped.view = 'preview';
    expect(escaped.html).toBe(renderMarkdown('<kbd>K</kbd> **b**'));
    const kept = markdownComponent({ view: 'split', source: '<kbd>K</kbd>', sanitize: false });
    expect(kept.html).toBe('<p><kbd>K</kbd></p>\n');
  });

  it('shows the draft in Preview and Split, and posts the source on every tab', async () => {
    const { page, errors } = await open(markup());
    await page.fill('#md-write-source', '# Draft\n\n- [x] typed');
    await page.click('#md-trigger-preview');
    await settle(page);
    const expected = renderMarkdown('# Draft\n\n- [x] typed');
    expect(await page.innerHTML('#preview-only')).toBe(expected);
    const posted = () =>
      page.evaluate(() => new FormData(document.querySelector('form')!).getAll('notes'));
    expect(await posted()).toEqual(['# Draft\n\n- [x] typed']);

    await page.click('#md-trigger-split');
    await settle(page);
    expect(await page.inputValue('#md-split-source')).toBe('# Draft\n\n- [x] typed');
    await page.fill('#md-split-source', 'Split **edit**');
    await settle(page);
    expect(await page.innerHTML('#preview-split')).toBe('<p>Split <strong>edit</strong></p>\n');
    expect(await posted()).toEqual(['Split **edit**']);

    await page.click('#md-trigger-write');
    await settle(page);
    expect(await posted()).toEqual(['Split **edit**']);
    expect(errors).toEqual([]);
    await page.close();
  });

  it('opens Write when the required source is empty on submit', async () => {
    const { page } = await open(markup());
    await page.click('#md-trigger-preview');
    await settle(page);
    const valid = await page.evaluate(() => document.querySelector('form')!.checkValidity());
    await settle(page);
    expect(valid).toBe(false);
    expect(await page.isVisible('#md-write-source')).toBe(true);
    await page.close();
  });
});
