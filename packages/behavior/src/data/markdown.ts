/**
 * Markdown rendering (#65): GitHub-flavored Markdown (tables, task lists,
 * strikethrough, autolinks) to the HTML the Markdown component's
 * `.apui-prose` root styles. React and Vue call it directly; Livewire UI
 * Components renders the same HTML with league/commonmark (`MarkdownRenderer`:
 * the GFM extension, `html_input` escape, `allow_unsafe_links` off).
 *
 * `marked` only tokenizes here. The serializer below writes commonmark's
 * output byte for byte (its newlines, `<br />` and `<hr />`, its URL
 * encoding and escaping), plus the design-system changes both stacks make:
 *
 * - raw HTML is escaped (`sanitize`, the default) or, with `sanitize: false`,
 *   filtered to an allowlist of formatting tags and safe attributes; never
 *   script-capable markup;
 * - links and images whose URL isn't safe (the SafeUrl rules: links take
 *   relative, http, https, mailto, tel and sms; images relative, http, https,
 *   blob and PNG, GIF, JPEG or WebP `data:` images, raw `<img>` included)
 *   are dropped, keeping their text;
 * - a task-list item is `<li data-scope="markdown" data-part="task">` with
 *   its disabled checkbox inside a `<label>` holding the item's first line;
 * - table cell alignment is `data-align` (start, center, end), not `align`.
 *
 * Both stacks bound the work untrusted source can cause, as commonmark's
 * `max_nesting_level` and `max_delimiters_per_line`
 * ({@link MARKDOWN_MAX_NESTING}, {@link MARKDOWN_MAX_DELIMITERS}): deeper
 * blocks stay text, and emphasis delimiters past the limit stay literal.
 *
 * The shared vectors in `test/fixtures/markdown-vectors.json` hold both
 * stacks to the same output; keep the PHP port in step.
 */
import { getDefaults, Lexer, Tokenizer, type Token, type Tokens } from 'marked';

/** The Markdown component's modes: the rendered preview, the source, or both side by side. */
export type MarkdownMode = 'preview' | 'write' | 'split';

/** Every mode, in the tabs' order. */
export const MARKDOWN_MODES: readonly MarkdownMode[] = ['write', 'preview', 'split'];

/** The default user-facing strings. Livewire translates the same English with `__()`. */
export const MARKDOWN_LABELS = {
  /** Names the mode tabs. */
  tabs: 'Markdown mode',
  write: 'Write',
  preview: 'Preview',
  split: 'Split',
  /** Names the source textarea. */
  editor: 'Markdown source',
  /** Names the rendered preview region in write and split modes. */
  output: 'Rendered preview',
} as const;

/**
 * How deep blocks nest before the rest of a line stays text: commonmark's
 * `max_nesting_level`, which LUC's `MarkdownRenderer` sets to the same value.
 * A block quote is one level, a list two (the list and its item).
 */
export const MARKDOWN_MAX_NESTING = 100;

/**
 * Emphasis and strikethrough delimiter runs one paragraph, heading or cell
 * may use before the rest stay literal: commonmark's
 * `max_delimiters_per_line`, which LUC's `MarkdownRenderer` sets to the same value.
 */
export const MARKDOWN_MAX_DELIMITERS = 500;

/** Options for {@link renderMarkdown}. */
export interface MarkdownRenderOptions {
  /**
   * Escape raw HTML in the source (the default). `false` keeps the allowlisted
   * formatting tags ({@link MARKDOWN_HTML_TAGS}) with safe attributes and
   * escapes every other tag.
   */
  sanitize?: boolean;
}

/** Tags raw HTML may keep with `sanitize: false`. Everything else is escaped as text. */
export const MARKDOWN_HTML_TAGS: readonly string[] = [
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'caption',
  'cite',
  'code',
  'dd',
  'del',
  'details',
  'dfn',
  'div',
  'dl',
  'dt',
  'em',
  'figcaption',
  'figure',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'ins',
  'kbd',
  'li',
  'mark',
  'ol',
  'p',
  'pre',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
  'var',
];

/** Attributes any allowed tag keeps. */
const GLOBAL_ATTRIBUTES: readonly string[] = ['title', 'lang', 'dir'];

/** Attributes particular tags keep. `href` and `src` also pass the SafeUrl rules. */
const TAG_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  a: ['href'],
  img: ['src', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
  ol: ['start', 'reversed'],
  li: ['value'],
  details: ['open'],
};

/** Schemes a link may use (SafeUrl). */
const LINK_SCHEMES = ['http', 'https', 'mailto', 'tel', 'sms'];
/** Schemes an image may use, besides `data:image/…` (SafeUrl). */
const MEDIA_SCHEMES = ['http', 'https', 'blob'];

// eslint-disable-next-line no-control-regex
const IGNORED_URL_CHARACTERS = /[\u0000-\u0020\u007f]+/g;

/** The URL as a browser reads its scheme: no whitespace or control characters, lowercased. */
function normalizeUrl(url: string): string {
  return url.replace(IGNORED_URL_CHARACTERS, '').toLowerCase();
}

/** The scheme, lowercased; `null` for a relative URL; `false` for an empty one. */
function urlScheme(url: string): string | null | false {
  const normalized = normalizeUrl(url);
  if (normalized === '') return false;
  const match = /^([a-z][a-z0-9+.-]*):/.exec(normalized);
  return match ? match[1]! : null;
}

/**
 * Whether commonmark (`allow_unsafe_links` off) refuses a URL: javascript,
 * vbscript, file and data, except PNG, GIF, JPEG and WebP data images.
 */
function commonmarkUnsafe(url: string): boolean {
  // eslint-disable-next-line no-control-regex
  const trimmed = url.replace(/[\t\n\r]/g, '').replace(/^[\u0000-\u0020]+/, '');
  return (
    /^(?:javascript|vbscript|file|data):/i.test(trimmed) &&
    !/^data:image\/(?:png|gif|jpeg|webp)/i.test(trimmed)
  );
}

/** A link URL, or `null` unless it's relative, http, https, mailto, tel or sms (SafeUrl::href). */
export function markdownLinkUrl(url: string | null | undefined): string | null {
  if (url === null || url === undefined) return null;
  const scheme = urlScheme(url);
  if (scheme === false) return null;
  return scheme === null || LINK_SCHEMES.includes(scheme) ? url : null;
}

/** An image URL, or `null` unless it's relative, http, https, blob or `data:image/…` (SafeUrl::media). */
export function markdownImageUrl(url: string | null | undefined): string | null {
  if (url === null || url === undefined) return null;
  const scheme = urlScheme(url);
  if (scheme === false) return null;
  if (scheme === null || MEDIA_SCHEMES.includes(scheme)) return url;
  return scheme === 'data' && normalizeUrl(url).startsWith('data:image/') ? url : null;
}

// ---------------------------------------------------------------------------
// Escaping

/** Text and attribute values, as commonmark's `Xml::escape`. */
function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Raw HTML shown as text, as commonmark's `html_input` escape (`htmlspecialchars`, no quotes). */
function escapeHtml(html: string): string {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Named character references decoded in text, URLs and titles. Commonmark
 * decodes every HTML5 name; a name missing here stays as written, which a
 * browser renders the same.
 */
const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  bull: '•',
  middot: '·',
  deg: '°',
  plusmn: '±',
  times: '×',
  divide: '÷',
  frac12: '½',
  frac14: '¼',
  frac34: '¾',
  euro: '€',
  pound: '£',
  yen: '¥',
  cent: '¢',
  sect: '§',
  para: '¶',
  larr: '←',
  rarr: '→',
  uarr: '↑',
  darr: '↓',
  harr: '↔',
};

/** A code point as text, or U+FFFD where commonmark substitutes it. */
function codePoint(value: number): string {
  if (value === 0 || value > 0x10ffff || (value >= 0xd800 && value <= 0xdfff)) return '�';
  return String.fromCodePoint(value);
}

const ENTITY_PATTERN = /&(?:#[xX]([0-9a-fA-F]{1,6})|#([0-9]{1,7})|([A-Za-z][A-Za-z0-9]{1,31}));/g;

/** One reference decoded, or `null` for a name outside {@link NAMED_ENTITIES}. */
function decodeEntity(
  hex: string | undefined,
  decimal: string | undefined,
  name: string | undefined,
): string | null {
  if (hex !== undefined) return codePoint(parseInt(hex, 16));
  if (decimal !== undefined) return codePoint(parseInt(decimal, 10));
  return NAMED_ENTITIES[name!] ?? null;
}

/** Decodes numeric references and the {@link NAMED_ENTITIES}, as commonmark does in URLs and titles. */
function decodeEntities(text: string): string {
  return text.replace(
    ENTITY_PATTERN,
    (match, hex: string | undefined, decimal: string | undefined, name: string | undefined) =>
      decodeEntity(hex, decimal, name) ?? match,
  );
}

/**
 * Source text as escaped HTML: references decoded and the result escaped,
 * as commonmark writes text. A name outside {@link NAMED_ENTITIES} is kept as
 * written, so the browser decodes it (or shows it, when it isn't a name) the
 * way commonmark's output reads.
 */
function textHtml(text: string): string {
  let html = '';
  let last = 0;
  for (const match of text.matchAll(ENTITY_PATTERN)) {
    html += escapeText(text.slice(last, match.index));
    last = match.index! + match[0].length;
    const decoded = decodeEntity(match[1], match[2], match[3]);
    html += decoded === null ? match[0] : escapeText(decoded);
  }
  return html + escapeText(text.slice(last));
}

/** Characters commonmark's URL encoder keeps as they are (everything else ASCII is percent-encoded). */
const URL_KEEP = /[A-Za-z0-9!#$&'()*+,\-./:;=?@_~]/;

/** Percent-encodes a destination as commonmark's `UrlEncoder::unescapeAndEncode`. */
function encodeUrl(url: string): string {
  const chars = Array.from(url);
  let result = '';
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]!;
    if (
      char === '%' &&
      i + 2 < chars.length &&
      /^[0-9a-f]{2}$/i.test(`${chars[i + 1]}${chars[i + 2]}`)
    ) {
      result += `%${chars[i + 1]}${chars[i + 2]}`;
      i += 2;
      continue;
    }
    const code = char.codePointAt(0)!;
    if (code < 128) {
      result += URL_KEEP.test(char) ? char : `%${code.toString(16).toUpperCase().padStart(2, '0')}`;
      continue;
    }
    result += encodeURIComponent(char);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Raw HTML (sanitize: false)

const TAG_PATTERN =
  /<!--[\s\S]*?-->|<(\/?)([A-Za-z][A-Za-z0-9-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g;
const ATTRIBUTE_PATTERN = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

/** Decodes the references an attribute value may use: numeric, amp, lt, gt, quot, apos. */
function decodeAttribute(value: string): string {
  return value.replace(
    /&(?:#[xX]([0-9a-fA-F]{1,6})|#([0-9]{1,7})|(amp|lt|gt|quot|apos));/g,
    (_match, hex: string | undefined, decimal: string | undefined, name: string | undefined) => {
      if (hex !== undefined) return codePoint(parseInt(hex, 16));
      if (decimal !== undefined) return codePoint(parseInt(decimal, 10));
      return NAMED_ENTITIES[name!]!;
    },
  );
}

/** One allowed tag rebuilt with its allowed, escaped attributes; `null` when the tag isn't allowed. */
function rebuildTag(closing: boolean, rawName: string, rawAttributes: string): string | null {
  const name = rawName.toLowerCase();
  if (!MARKDOWN_HTML_TAGS.includes(name)) return null;
  if (closing) return `</${name}>`;
  const allowed = [...GLOBAL_ATTRIBUTES, ...(TAG_ATTRIBUTES[name] ?? [])];
  const seen = new Set<string>();
  let attributes = '';
  for (const match of rawAttributes.matchAll(ATTRIBUTE_PATTERN)) {
    const attribute = match[1]!.toLowerCase();
    if (!allowed.includes(attribute) || seen.has(attribute)) continue;
    seen.add(attribute);
    let value = decodeAttribute(match[2] ?? match[3] ?? match[4] ?? '');
    if (attribute === 'href' || attribute === 'src') {
      const safe = attribute === 'href' ? markdownLinkUrl(value) : markdownImageUrl(value);
      // Images take the same data: formats as Markdown images: PNG, GIF, JPEG and WebP.
      if (safe === null || (attribute === 'src' && commonmarkUnsafe(safe))) continue;
      value = safe;
    }
    attributes += ` ${attribute}="${escapeText(value)}"`;
  }
  return `<${name}${attributes}>`;
}

/**
 * Raw HTML with `sanitize: false`: allowlisted tags are rebuilt with their
 * allowed attributes (event handlers, `style` and `class` never pass; `href`
 * and `src` follow the SafeUrl rules), comments are dropped, and every other
 * tag, and any stray `<` or `>`, is escaped as text. Works on tags, not a
 * tree, so it needs no DOM and gives the same output on a server.
 */
export function filterMarkdownHtml(html: string): string {
  let result = '';
  let last = 0;
  for (const match of html.matchAll(TAG_PATTERN)) {
    const index = match.index!;
    result += escapeAngles(html.slice(last, index));
    last = index + match[0].length;
    if (match[2] === undefined) continue;
    const tag = rebuildTag(match[1] === '/', match[2], match[3] ?? '');
    result += tag ?? escapeAngles(match[0]);
  }
  return result + escapeAngles(html.slice(last));
}

function escapeAngles(text: string): string {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// Rendering

const WHITESPACE = /^[\s\p{Zs}]$/u;
const PUNCTUATION = /^[\p{P}\p{S}]$/u;

/**
 * Whether a delimiter run goes on commonmark's delimiter stack, so it counts
 * toward {@link MARKDOWN_MAX_DELIMITERS}: it can open or close emphasis
 * (`DelimiterParser::determineCanOpenOrClose`).
 */
function countsAsDelimiter(character: string, before: string, after: string): boolean {
  const beforeSpace = before === '' || WHITESPACE.test(before);
  const afterSpace = after === '' || WHITESPACE.test(after);
  const beforePunctuation = !beforeSpace && PUNCTUATION.test(before);
  const afterPunctuation = !afterSpace && PUNCTUATION.test(after);
  const left = !afterSpace && (!afterPunctuation || beforeSpace || beforePunctuation);
  const right = !beforeSpace && (!beforePunctuation || afterSpace || afterPunctuation);
  if (character !== '_') return left || right;
  return (left && (!right || beforePunctuation)) || (right && (!left || afterPunctuation));
}

/** A lexer that tracks block depth and, per inline container, delimiter runs. */
class GuardedLexer extends Lexer {
  /** The current container's commonmark depth: the document is 0. */
  blockDepth = 0;
  /** Delimiter runs counted in the current inline container. */
  delimiters = 0;
  /** The inline source being lexed, outermost first. */
  inlineSources: string[] = [];

  override inlineTokens(src: string, tokens: Token[] = []): Token[] {
    if (this.inlineSources.length === 0) this.delimiters = 0;
    this.inlineSources.push(src);
    try {
      return super.inlineTokens(src, tokens);
    } finally {
      this.inlineSources.pop();
    }
  }
}

/**
 * Marked's tokenizer with commonmark's limits: a block quote or list starts
 * only below {@link MARKDOWN_MAX_NESTING}, and a delimiter run past
 * {@link MARKDOWN_MAX_DELIMITERS} is literal text, which also keeps marked's
 * closer search from going quadratic.
 */
class GuardedTokenizer extends Tokenizer {
  override blockquote(src: string): Tokens.Blockquote | undefined {
    return this.nested(1, () => super.blockquote(src));
  }

  override list(src: string): Tokens.List | undefined {
    return this.nested(2, () => super.list(src));
  }

  override emStrong(
    src: string,
    maskedSrc: string,
    prevChar = '',
  ): Tokens.Em | Tokens.Strong | undefined {
    return this.delimited(/^(?:\*+|_+)/, src, () => super.emStrong(src, maskedSrc, prevChar));
  }

  override del(src: string, maskedSrc: string, prevChar = ''): Tokens.Del | undefined {
    return this.delimited(/^~+/, src, () => super.del(src, maskedSrc, prevChar));
  }

  private get guarded(): GuardedLexer {
    return this.lexer as GuardedLexer;
  }

  private nested<T>(cost: number, run: () => T | undefined): T | undefined {
    const lexer = this.guarded;
    if (lexer.blockDepth >= MARKDOWN_MAX_NESTING) return undefined;
    lexer.blockDepth += cost;
    try {
      return run();
    } finally {
      lexer.blockDepth -= cost;
    }
  }

  private delimited<T extends Token>(
    pattern: RegExp,
    src: string,
    run: () => T | undefined,
  ): T | undefined {
    const delimiter = pattern.exec(src)?.[0];
    if (delimiter === undefined) return run();
    const lexer = this.guarded;
    const whole = lexer.inlineSources.at(-1) ?? src;
    const index = whole.length - src.length;
    if (!countsAsDelimiter(delimiter[0]!, whole.charAt(index - 1), src.charAt(delimiter.length))) {
      return run();
    }
    if (lexer.delimiters >= MARKDOWN_MAX_DELIMITERS) {
      // Marked takes any token here; a text token renders the run as written.
      const literal: Tokens.Text = { type: 'text', raw: delimiter, text: delimiter };
      return literal as unknown as T;
    }
    lexer.delimiters += 1;
    const token = run();
    // The closing run went on commonmark's stack too.
    if (token !== undefined) lexer.delimiters += 1;
    return token;
  }
}

/** Tokens for the source, with the limits above. */
function lex(source: string): Token[] {
  return new GuardedLexer({
    ...getDefaults(),
    gfm: true,
    breaks: false,
    tokenizer: new GuardedTokenizer(),
  }).lex(source);
}

interface RenderContext {
  sanitize: boolean;
}

/** Inline tokens as plain text, for an image's alt. */
function plainText(tokens: readonly Token[] | undefined): string {
  return (tokens ?? [])
    .map((token) => {
      if ('tokens' in token && token.tokens && token.type !== 'codespan')
        return plainText(token.tokens);
      if (token.type === 'br') return '\n';
      if (token.type === 'html') return token.text;
      if (token.type === 'codespan' || token.type === 'escape') return token.text;
      if (token.type === 'text') return decodeEntities(token.text);
      return 'text' in token ? String(token.text) : '';
    })
    .join('');
}

function titleAttribute(title: string | null | undefined): string {
  return title ? ` title="${escapeText(decodeEntities(title))}"` : '';
}

function renderInline(tokens: readonly Token[] | undefined, context: RenderContext): string {
  let html = '';
  for (const token of tokens ?? []) html += renderInlineToken(token, context);
  return html;
}

function renderInlineToken(token: Token, context: RenderContext): string {
  switch (token.type) {
    case 'text': {
      const text = token as Tokens.Text;
      // Commonmark drops the spaces before a soft line break.
      return text.tokens
        ? renderInline(text.tokens, context)
        : textHtml(text.text.replace(/ +\n/g, '\n'));
    }
    case 'escape':
      return escapeText(token.text);
    case 'strong':
      return `<strong>${renderInline(token.tokens, context)}</strong>`;
    case 'em':
      return `<em>${renderInline(token.tokens, context)}</em>`;
    case 'del':
      return `<del>${renderInline(token.tokens, context)}</del>`;
    case 'codespan':
      return `<code>${escapeText(token.text)}</code>`;
    case 'br':
      return '<br />\n';
    case 'html':
      return context.sanitize ? escapeHtml(token.text) : filterMarkdownHtml(token.text);
    case 'link': {
      const link = token as Tokens.Link;
      const inner = renderInline(link.tokens, context);
      const href = markdownLinkUrl(encodeUrl(decodeEntities(link.href)));
      if (href === null || commonmarkUnsafe(href)) return inner;
      return `<a href="${escapeText(href)}"${titleAttribute(link.title)}>${inner}</a>`;
    }
    case 'image': {
      const image = token as Tokens.Image;
      const alt = image.tokens ? plainText(image.tokens) : decodeEntities(image.text);
      const src = markdownImageUrl(encodeUrl(decodeEntities(image.href)));
      if (src === null || commonmarkUnsafe(src)) return escapeText(alt);
      return `<img src="${escapeText(src)}" alt="${escapeText(alt)}"${titleAttribute(image.title)} />`;
    }
    case 'checkbox':
      return checkbox((token as Tokens.Checkbox).checked);
    default:
      return 'text' in token ? escapeText(String(token.text)) : '';
  }
}

function checkbox(checked: boolean): string {
  return `<input${checked ? ' checked=""' : ''} disabled="" type="checkbox">`;
}

/** Whether a block token renders as a paragraph (bare in a tight list). */
function isParagraph(token: Token): boolean {
  return token.type === 'paragraph' || token.type === 'text';
}

/** The first line of a task item: the checkbox and its text, in a label. */
function taskLabel(tokens: readonly Token[], context: RenderContext, gap: string): string {
  const [marker, ...rest] = tokens;
  const checked = marker?.type === 'checkbox' && (marker as Tokens.Checkbox).checked;
  const body = marker?.type === 'checkbox' ? rest : tokens;
  return `<label>${checkbox(checked)}${gap}${renderInline(body, context)}</label>`;
}

/** The whitespace after a task item's `[x]`, which commonmark keeps in the text. */
function taskGap(item: Tokens.ListItem): string {
  return /^\s*(?:[-+*]|\d{1,9}[.)])[ \t]+\[[ xX]\]([ \t]+)/.exec(item.raw)?.[1] ?? ' ';
}

function renderParagraph(
  token: Tokens.Paragraph | Tokens.Text,
  tight: boolean,
  context: RenderContext,
  gap: string | null,
): string {
  const tokens = token.tokens ?? [{ type: 'text', raw: token.text, text: token.text } as Token];
  // Commonmark trims the paragraph's last line.
  const inner = (
    gap !== null ? taskLabel(tokens, context, gap) : renderInline(tokens, context)
  ).replace(/[ \t]+(<\/label>)?$/, '$1');
  return tight ? inner : `<p>${inner}</p>`;
}

function renderListItem(item: Tokens.ListItem, tight: boolean, context: RenderContext): string {
  let children = item.tokens.filter((token) => token.type !== 'space');
  // A tight item carries its checkbox before the first line; a loose one, inside it.
  const marker = children[0]?.type === 'checkbox' ? (children[0] as Tokens.Checkbox) : null;
  if (marker) children = children.slice(1);
  const parts = children.map((child, index) => {
    if (isParagraph(child)) {
      const paragraph = child as Tokens.Paragraph;
      const task = item.task && index === 0;
      return renderParagraph(
        marker && task
          ? { ...paragraph, tokens: [marker, ...(paragraph.tokens ?? [])] }
          : paragraph,
        tight,
        context,
        task ? taskGap(item) : null,
      );
    }
    return renderBlock(child, context);
  });
  let contents = parts.join('\n');
  const separates = (child: Token | undefined) =>
    child !== undefined && !(isParagraph(child) && tight);
  if (separates(children[0])) contents = `\n${contents}`;
  if (separates(children[children.length - 1])) contents += '\n';
  const attributes = item.task ? ' data-scope="markdown" data-part="task"' : '';
  return `<li${attributes}>${contents}</li>`;
}

const ALIGNMENT: Readonly<Record<string, string>> = {
  left: 'start',
  center: 'center',
  right: 'end',
};

function renderCell(cell: Tokens.TableCell, context: RenderContext): string {
  const tag = cell.header ? 'th' : 'td';
  const align = cell.align ? ` data-align="${ALIGNMENT[cell.align]}"` : '';
  return `<${tag}${align}>${renderInline(cell.tokens, context)}</${tag}>`;
}

function renderRow(cells: Tokens.TableCell[], context: RenderContext): string {
  return `<tr>\n${cells.map((cell) => renderCell(cell, context)).join('\n')}\n</tr>`;
}

function renderTable(table: Tokens.Table, context: RenderContext): string {
  const head = `<thead>\n${renderRow(table.header, context)}\n</thead>`;
  const body = table.rows.length
    ? `\n<tbody>\n${table.rows.map((row) => renderRow(row, context)).join('\n')}\n</tbody>`
    : '';
  return `<table>\n${head}${body}\n</table>`;
}

function renderCode(code: Tokens.Code): string {
  const word = /^\S+/.exec(code.lang ?? '')?.[0];
  const language = word
    ? ` class="${escapeText(word.startsWith('language-') ? word : `language-${word}`)}"`
    : '';
  const literal = code.text === '' ? '' : `${code.text}\n`;
  return `<pre><code${language}>${escapeText(literal)}</code></pre>`;
}

function renderBlock(token: Token, context: RenderContext): string {
  switch (token.type) {
    case 'heading':
      return `<h${token.depth}>${renderInline(token.tokens, context)}</h${token.depth}>`;
    case 'paragraph':
    case 'text':
      return renderParagraph(token as Tokens.Paragraph, false, context, null);
    case 'code':
      return renderCode(token as Tokens.Code);
    case 'blockquote': {
      const inner = renderBlocks((token as Tokens.Blockquote).tokens, context);
      return inner === '' ? '<blockquote>\n</blockquote>' : `<blockquote>\n${inner}\n</blockquote>`;
    }
    case 'hr':
      return '<hr />';
    case 'list': {
      const list = token as Tokens.List;
      const tag = list.ordered ? 'ol' : 'ul';
      const start =
        list.ordered && list.start !== '' && Number(list.start) !== 1
          ? ` start="${Number(list.start)}"`
          : '';
      const items = list.items.map((item) => renderListItem(item, !list.loose, context));
      return `<${tag}${start}>\n${items.join('\n')}\n</${tag}>`;
    }
    case 'html': {
      // Commonmark's literal ends at the block's last line, without its newline.
      const literal = token.text.replace(/\n+$/, '');
      return context.sanitize ? escapeHtml(literal) : filterMarkdownHtml(literal);
    }
    case 'table':
      return renderTable(token as Tokens.Table, context);
    default:
      return '';
  }
}

function renderBlocks(tokens: readonly Token[], context: RenderContext): string {
  return tokens
    .filter((token) => token.type !== 'space' && token.type !== 'def')
    .map((token) => renderBlock(token, context))
    .join('\n');
}

/**
 * Renders Markdown to the HTML the `.apui-prose` root styles: the same HTML
 * Livewire's commonmark renderer writes.
 *
 * @example
 * ```ts
 * renderMarkdown('- [x] Confirm time with agent');
 * // '<ul>\n<li data-scope="markdown" data-part="task"><label><input checked="" disabled="" type="checkbox"> Confirm time with agent</label></li>\n</ul>\n'
 * ```
 */
export function renderMarkdown(
  source: string | null | undefined,
  options: MarkdownRenderOptions = {},
): string {
  if (!source) return '';
  const context: RenderContext = { sanitize: options.sanitize !== false };
  const html = renderBlocks(lex(source.replace(/\r\n?/g, '\n')), context);
  return html === '' ? '' : `${html}\n`;
}
