/**
 * The `apuiMarkdown` Alpine component (#65), for Markdown's write and split
 * modes in a plain form (no `wire:model`). It holds the selected tab and the
 * source both Textareas bind to (`x-model="source"`), and renders the draft
 * with `renderMarkdown`, the same HTML the server's commonmark renderer
 * writes, so Preview and Split show what's being typed:
 *
 *   <div class="apui-markdown" x-data="apuiMarkdown({ view: 'write', source: '…', sanitize: true })">
 *     …<textarea name="notes" x-model="source"></textarea>…
 *     <div data-scope="markdown" data-part="preview" x-html="html">…server HTML…</div>
 *   </div>
 *
 * Nothing renders while only the Write tab shows.
 */
import { renderMarkdown, type MarkdownMode } from '../data/markdown';

/** Options for `apuiMarkdown`. */
export interface MarkdownAlpineOptions {
  /** The selected tab. @defaultValue `'write'` */
  view?: MarkdownMode;
  /** The Markdown. */
  source?: string;
  /** Escape raw HTML (the default), or keep the allowlisted tags. @defaultValue `true` */
  sanitize?: boolean;
}

/** The `apuiMarkdown` component: `view`, `source` and the rendered `html`. */
export function markdownComponent(options: MarkdownAlpineOptions = {}) {
  const sanitize = options.sanitize !== false;
  return {
    view: (options.view ?? 'write') as MarkdownMode,
    source: options.source ?? '',

    /** The draft as HTML; empty while only the Write tab shows. */
    get html(): string {
      return this.view === 'write' ? '' : renderMarkdown(this.source, { sanitize });
    },
  };
}
