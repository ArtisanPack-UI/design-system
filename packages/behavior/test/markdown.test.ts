// @vitest-environment happy-dom
/**
 * Markdown rendering (#65). The vectors come from Livewire UI Components'
 * commonmark renderer; React and Vue render through `renderMarkdown`, so the
 * two must write the same bytes. LUC's MarkdownRendererTest reads the same file.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  filterMarkdownHtml,
  markdownImageUrl,
  markdownLinkUrl,
  renderMarkdown,
} from '../src/data/markdown';

interface Vector {
  name: string;
  source: string;
  html: string;
  unsanitized: string;
}

const { vectors } = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'fixtures/markdown-vectors.json'),
    'utf8',
  ),
) as { vectors: Vector[] };

describe('renderMarkdown vectors', () => {
  it.each(vectors.map((vector) => [vector.name, vector] as const))('%s', (_name, vector) => {
    expect(renderMarkdown(vector.source)).toBe(vector.html);
    expect(renderMarkdown(vector.source, { sanitize: false })).toBe(vector.unsanitized);
  });
});

describe('renderMarkdown', () => {
  it('renders nothing for empty or missing source', () => {
    expect(renderMarkdown('')).toBe('');
    expect(renderMarkdown(null)).toBe('');
    expect(renderMarkdown(undefined)).toBe('');
  });

  it('labels task checkboxes and marks the item as the task part', () => {
    expect(renderMarkdown('- [x] Done\n- [ ] Open')).toBe(
      '<ul>\n<li data-scope="markdown" data-part="task"><label><input checked="" disabled="" type="checkbox"> Done</label></li>\n' +
        '<li data-scope="markdown" data-part="task"><label><input disabled="" type="checkbox"> Open</label></li>\n</ul>\n',
    );
  });

  it('keeps header cells and writes alignment as data-align', () => {
    const html = renderMarkdown('| A | B | C |\n|:--|:-:|--:|\n| 1 | 2 | 3 |');
    expect(html).toContain('<th data-align="start">A</th>');
    expect(html).toContain('<th data-align="center">B</th>');
    expect(html).toContain('<td data-align="end">3</td>');
  });

  it('normalizes Windows line endings', () => {
    expect(renderMarkdown('# A\r\n\r\nB')).toBe('<h1>A</h1>\n<p>B</p>\n');
  });

  it.each([true, false])('never renders script-capable markup (sanitize %s)', (sanitize) => {
    const html = renderMarkdown(
      [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        '<a href="javascript:alert(1)">a</a> <a href="&#106;avascript:alert(1)">b</a>',
        '<iframe src="https://x.test"></iframe> <svg onload=alert(1)>',
        '[c](javascript:alert(1)) ![d](javascript:alert(1)) [e](vbscript:x) [f](data:text/html,x)',
        '<div style="background:url(javascript:x)" class="x">s</div>',
      ].join('\n\n'),
      { sanitize },
    );
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    expect(doc.querySelector('script, iframe, svg, style, object, embed')).toBeNull();
    for (const element of doc.body.querySelectorAll('*')) {
      for (const attribute of Array.from(element.attributes)) {
        expect(attribute.name).not.toMatch(/^(on|style$|class$)/i);
        if (attribute.name === 'href' || attribute.name === 'src') {
          expect(attribute.value).not.toMatch(/^\s*(javascript|vbscript|data:text)/i);
        }
      }
    }
  });
});

describe('filterMarkdownHtml', () => {
  it('rebuilds allowed tags with their allowed attributes', () => {
    expect(filterMarkdownHtml('<KBD class="k" title="Key">K</KBD>')).toBe(
      '<kbd title="Key">K</kbd>',
    );
    expect(filterMarkdownHtml('<a href="/x" target="_blank" onclick="y">x</a>')).toBe(
      '<a href="/x">x</a>',
    );
    expect(filterMarkdownHtml('<details open><summary>S</summary></details>')).toBe(
      '<details open=""><summary>S</summary></details>',
    );
  });

  it('escapes other tags and drops comments', () => {
    expect(filterMarkdownHtml('<x-card>a</x-card><!-- c --><b>b</b>')).toBe(
      '&lt;x-card&gt;a&lt;/x-card&gt;<b>b</b>',
    );
    expect(filterMarkdownHtml('<p>1 < 2</p>')).toBe('<p>1 &lt; 2</p>');
  });

  it('checks URLs after decoding references, and escapes what it keeps', () => {
    expect(filterMarkdownHtml('<a href="&#x6A;avascript:x">a</a>')).toBe('<a>a</a>');
    expect(filterMarkdownHtml('<a href="?a=1&amp;b=2">a</a>')).toBe('<a href="?a=1&amp;b=2">a</a>');
    expect(filterMarkdownHtml('<a href="java&Tab;script:x">a</a>')).toBe(
      '<a href="java&amp;Tab;script:x">a</a>',
    );
  });
});

describe('Markdown URLs', () => {
  it('follows the SafeUrl rules', () => {
    expect(markdownLinkUrl('/a')).toBe('/a');
    expect(markdownLinkUrl('sms:+1')).toBe('sms:+1');
    expect(markdownLinkUrl(' JavaScript:x')).toBeNull();
    expect(markdownLinkUrl('ftp://x')).toBeNull();
    expect(markdownLinkUrl('')).toBeNull();
    expect(markdownImageUrl('blob:https://x/1')).toBe('blob:https://x/1');
    expect(markdownImageUrl('data:image/png;base64,AA')).toBe('data:image/png;base64,AA');
    expect(markdownImageUrl('data:text/html,x')).toBeNull();
  });
});
