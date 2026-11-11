/**
 * The RichTextEditor's shared pieces (#53): toolbar presets and their icons,
 * the built-in strings, HTML sanitizing, Markdown in and out, and the
 * contentEditable engine React, Vue and Livewire (without TinyMCE) edit with.
 *
 * Livewire can run TinyMCE behind the same toolbar instead (D-003); the
 * Alpine component picks the engine, and both report the same `value`.
 */
import { definedLabels } from './labels';

/** A formatting command, one per toolbar button. */
export type RichTextCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'quote'
  | 'code'
  | 'link'
  | 'image'
  | 'undo'
  | 'redo';

/** A toolbar entry: a command, or `|` for a divider. */
export type RichTextToolbarItem = RichTextCommand | '|';

/** The formats `value` is read and written in. */
export type RichTextOutput = 'html' | 'markdown';

/** Each command's icon (a registry name) and whether it's a toggle (`aria-pressed`). */
export const RICH_TEXT_COMMANDS: Readonly<
  Record<RichTextCommand, { icon: string; toggle: boolean }>
> = {
  bold: { icon: 'bold', toggle: true },
  italic: { icon: 'italic', toggle: true },
  underline: { icon: 'underline', toggle: true },
  strike: { icon: 'strikethrough', toggle: true },
  heading2: { icon: 'heading-2', toggle: true },
  heading3: { icon: 'heading-3', toggle: true },
  bulletList: { icon: 'list', toggle: true },
  orderedList: { icon: 'list-ordered', toggle: true },
  quote: { icon: 'quote', toggle: true },
  code: { icon: 'code', toggle: true },
  link: { icon: 'link', toggle: true },
  image: { icon: 'image', toggle: false },
  undo: { icon: 'undo-2', toggle: false },
  redo: { icon: 'redo-2', toggle: false },
};

/** The toolbar presets `toolbar` names. */
export const RICH_TEXT_TOOLBARS: Readonly<Record<string, readonly RichTextToolbarItem[]>> = {
  default: [
    'bold',
    'italic',
    'underline',
    'strike',
    '|',
    'heading2',
    'heading3',
    '|',
    'bulletList',
    'orderedList',
    'quote',
    'code',
    '|',
    'link',
    'image',
    '|',
    'undo',
    'redo',
  ],
  compact: ['bold', 'italic', 'link', '|', 'bulletList'],
  minimal: ['bold', 'italic', 'link'],
};

/** Commands Markdown can't represent, left off the toolbar when `output` is markdown. */
const NOT_IN_MARKDOWN: ReadonlySet<RichTextCommand> = new Set(['underline']);

/**
 * The toolbar to render: a preset name or a list of commands and `|`.
 * Unknown names are dropped, and so are formats the output can't hold.
 * Dividers never lead, trail or double up.
 */
export function resolveToolbar(
  toolbar: string | readonly string[] | null | undefined,
  output: RichTextOutput = 'html',
): RichTextToolbarItem[] {
  const list =
    typeof toolbar === 'string' || toolbar === null || toolbar === undefined
      ? (RICH_TEXT_TOOLBARS[toolbar ?? 'default'] ?? RICH_TEXT_TOOLBARS.default!)
      : toolbar;
  const items = list.filter(
    (item): item is RichTextToolbarItem =>
      item === '|' ||
      (item in RICH_TEXT_COMMANDS &&
        !(output === 'markdown' && NOT_IN_MARKDOWN.has(item as RichTextCommand))),
  );
  return items.filter(
    (item, i) => item !== '|' || (i > 0 && i < items.length - 1 && items[i - 1] !== '|'),
  );
}

/** The built-in strings. Livewire passes them through `__()`; React and Vue take `translations`. */
export const RICH_TEXT_TRANSLATIONS = {
  toolbar: 'Formatting',
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strike: 'Strikethrough',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  bulletList: 'Bulleted list',
  orderedList: 'Numbered list',
  quote: 'Quote',
  code: 'Code',
  link: 'Link',
  image: 'Image',
  undo: 'Undo',
  redo: 'Redo',
  linkPrompt: 'Link URL',
  imagePrompt: 'Image URL',
  imageAltPrompt: 'Describe the image',
  shortcuts: 'Markdown shortcuts on',
  word: ':count word',
  words: ':count words',
  character: ':count character',
  characters: ':count characters',
  limit: ':count / :max characters',
};

/** The RichTextEditor's strings. */
export type RichTextTranslations = typeof RICH_TEXT_TRANSLATIONS;

/** The built-in strings with the caller's overrides. */
export function richTextTranslations(
  overrides: Partial<RichTextTranslations> | null | undefined,
): RichTextTranslations {
  return { ...RICH_TEXT_TRANSLATIONS, ...definedLabels(overrides) };
}

/** Fills `:name` placeholders, longest names first so `:count` never eats `:countable`. */
export function fillPlaceholders(text: string, values: Record<string, string | number>): string {
  return Object.keys(values)
    .sort((a, b) => b.length - a.length)
    .reduce((result, key) => result.split(`:${key}`).join(String(values[key])), text);
}

/** Words and characters in a piece of text, as the footer counts them. */
export function textStats(text: string): { words: number; characters: number } {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  return {
    words: trimmed === '' ? 0 : trimmed.split(' ').length,
    characters: Array.from(text.replace(/\n/g, '')).length,
  };
}

/** The footer's count, e.g. "78 words · 486 characters", or "486 / 500 characters" with a limit. */
export function countLabel(
  text: string,
  translations: RichTextTranslations,
  maxLength?: number | null,
): string {
  const { words, characters } = textStats(text);
  const chars = maxLength
    ? fillPlaceholders(translations.limit, { count: characters, max: maxLength })
    : fillPlaceholders(characters === 1 ? translations.character : translations.characters, {
        count: characters,
      });
  const wordLabel = fillPlaceholders(words === 1 ? translations.word : translations.words, {
    count: words,
  });
  return `${wordLabel} · ${chars}`;
}

// ---------------------------------------------------------------------------
// URLs and sanitizing

/** Control characters and whitespace, which browsers ignore inside a URL's scheme. */
// eslint-disable-next-line no-control-regex
const IGNORED_URL_CHARACTERS = /[\u0000- \u007f-\u009f]/g;

function urlScheme(url: string): string {
  const match = /^([a-z][a-z0-9+.-]*):/.exec(url.replace(IGNORED_URL_CHARACTERS, '').toLowerCase());
  return match ? match[1]! : '';
}

/** A link URL, or `null` unless it's relative, http, https, mailto or tel. */
export function safeLinkUrl(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value) return null;
  const scheme = urlScheme(value);
  return scheme === '' || ['http', 'https', 'mailto', 'tel'].includes(scheme) ? value : null;
}

/** An image URL, or `null` unless it's relative, http or https. */
export function safeImageUrl(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value) return null;
  const scheme = urlScheme(value);
  return scheme === '' || scheme === 'http' || scheme === 'https' ? value : null;
}

/** Tags kept as they are (attributes aside). `b`, `i`, `strike` and `del` are renamed. */
const ALLOWED_TAGS: ReadonlySet<string> = new Set([
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'a',
  'img',
  'hr',
]);

const RENAMED_TAGS: Readonly<Record<string, string>> = {
  b: 'strong',
  i: 'em',
  strike: 's',
  del: 's',
  h1: 'h2',
  h5: 'h4',
  h6: 'h4',
  div: 'p',
};

/** Tags dropped with everything inside them. */
const DROPPED_TAGS: ReadonlySet<string> = new Set([
  'script',
  'style',
  'template',
  'iframe',
  'object',
  'embed',
  'noscript',
  'svg',
  'math',
  'head',
  'title',
  'meta',
  'link',
  'form',
  'input',
  'button',
  'select',
  'textarea',
]);

function escapeText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(text: string): string {
  return escapeText(text).replace(/"/g, '&quot;');
}

/**
 * Keeps only the formats the editor makes: paragraphs, headings, lists,
 * quotes, code, links (safe URLs only) and images (safe URLs, with alt).
 * Everything else is unwrapped to its text, or dropped with its content
 * (scripts, styles, embeds, form controls). Needs a DOM (`DOMParser`), so it
 * runs in the browser; on a server, render the content after mount.
 */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return serializeChildren(doc.body).replace(/^(<p><br><\/p>)+$/, '');
}

function serializeChildren(node: Node): string {
  return Array.from(node.childNodes).map(serializeNode).join('');
}

function serializeNode(node: Node): string {
  if (node.nodeType === 3) return escapeText(node.textContent ?? '');
  if (node.nodeType !== 1) return '';
  const element = node as Element;
  const name = element.tagName.toLowerCase();
  if (DROPPED_TAGS.has(name)) return '';
  const tag = RENAMED_TAGS[name] ?? name;
  if (!ALLOWED_TAGS.has(tag)) return serializeChildren(element);
  if (tag === 'br' || tag === 'hr') return `<${tag}>`;
  if (tag === 'img') {
    const src = safeImageUrl(element.getAttribute('src'));
    if (!src) return '';
    return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(element.getAttribute('alt') ?? '')}">`;
  }
  const inner = serializeChildren(element);
  if (tag === 'a') {
    const href = safeLinkUrl(element.getAttribute('href'));
    return href ? `<a href="${escapeAttribute(href)}">${inner}</a>` : inner;
  }
  return `<${tag}>${inner}</${tag}>`;
}

// ---------------------------------------------------------------------------
// Markdown

function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_[\]~<])/g, '\\$1');
}

/** Escapes what would start a block at the start of a line: `#`, `>`, `-`, `+`, `*`, `1.`. */
function escapeLineStart(text: string): string {
  return text
    .replace(/^(#{1,6})(?=\s|$)/, '\\$1')
    .replace(/^([>+-])/, '\\$1')
    .replace(/^(\d+)\.(?=\s|$)/, '$1\\.');
}

/** A link or image destination, wrapped in `<…>` when it holds spaces or parentheses. */
function markdownUrl(url: string): string {
  if (!/[\s()<>]/.test(url)) return url;
  return `<${url.replace(/</g, '%3C').replace(/>/g, '%3E')}>`;
}

/** A code span whose fence is longer than any run of backticks inside it. */
function markdownCode(code: string): string {
  const longest = Math.max(0, ...(code.match(/`+/g) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longest + 1);
  const pad = code.startsWith('`') || code.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${code}${pad}${fence}`;
}

/** Converts the editor's HTML to Markdown (CommonMark plus `~~strike~~`). Needs a DOM. */
export function htmlToMarkdown(html: string | null | undefined): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(
    `<body>${sanitizeRichText(html)}</body>`,
    'text/html',
  );
  return blocks(doc.body, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inline(node: Node): string {
  if (node.nodeType === 3) return escapeMarkdown((node.textContent ?? '').replace(/\s+/g, ' '));
  if (node.nodeType !== 1) return '';
  const element = node as Element;
  const inner = () => Array.from(element.childNodes).map(inline).join('');
  switch (element.tagName.toLowerCase()) {
    case 'strong':
      return `**${inner()}**`;
    case 'em':
      return `_${inner()}_`;
    case 's':
      return `~~${inner()}~~`;
    case 'code':
      return markdownCode(element.textContent ?? '');
    case 'br':
      return '  \n';
    case 'a':
      return `[${inner()}](${markdownUrl(element.getAttribute('href') ?? '')})`;
    case 'img':
      return `![${escapeMarkdown(element.getAttribute('alt') ?? '')}](${markdownUrl(element.getAttribute('src') ?? '')})`;
    default:
      return inner();
  }
}

function blocks(container: Element, indent: string): string {
  let out = '';
  let pending = '';
  const flush = () => {
    if (pending.trim()) out += `${indent}${escapeLineStart(pending.trim())}\n\n`;
    pending = '';
  };
  for (const node of Array.from(container.childNodes)) {
    const tag = node.nodeType === 1 ? (node as Element).tagName.toLowerCase() : '';
    const element = node as Element;
    switch (tag) {
      case 'p':
        flush();
        out += `${indent}${escapeLineStart(Array.from(element.childNodes).map(inline).join('').trim())}\n\n`;
        break;
      case 'h2':
      case 'h3':
      case 'h4':
        flush();
        out += `${indent}${'#'.repeat(Number(tag[1]))} ${Array.from(element.childNodes).map(inline).join('').trim()}\n\n`;
        break;
      case 'ul':
      case 'ol':
        flush();
        out += list(element, indent, tag === 'ol') + '\n';
        break;
      case 'blockquote':
        flush();
        out +=
          blocks(element, '')
            .trim()
            .split('\n')
            .map((line) => `${indent}> ${line}`.trimEnd())
            .join('\n') + '\n\n';
        break;
      case 'pre':
        flush();
        out += `${indent}\`\`\`\n${(element.textContent ?? '').replace(/\n$/, '')}\n${indent}\`\`\`\n\n`;
        break;
      case 'hr':
        flush();
        out += `${indent}---\n\n`;
        break;
      default:
        pending += inline(node);
    }
  }
  flush();
  return out;
}

function list(element: Element, indent: string, ordered: boolean): string {
  let out = '';
  let n = 1;
  for (const item of Array.from(element.children)) {
    if (item.tagName.toLowerCase() !== 'li') continue;
    const marker = ordered ? `${n++}. ` : '- ';
    const nested = Array.from(item.children).filter((child) =>
      ['ul', 'ol'].includes(child.tagName.toLowerCase()),
    );
    const text = Array.from(item.childNodes)
      .filter((child) => !nested.includes(child as Element))
      .map(inline)
      .join('')
      .trim();
    out += `${indent}${marker}${escapeLineStart(text)}\n`;
    for (const child of nested) {
      out += list(
        child,
        `${indent}${' '.repeat(marker.length)}`,
        child.tagName.toLowerCase() === 'ol',
      );
    }
  }
  return out;
}

/** Placeholders for code spans (`\u0000`) and built links (`\u0001`), never valid in a URL. */
// eslint-disable-next-line no-control-regex
const PLACEHOLDER = /[\u0000\u0001]/;

/** Removes Markdown backslash escapes. */
function unescapeMarkdown(text: string): string {
  return text.replace(/\\([\\`*_[\]#>+.~<-])/g, '$1');
}

/** A destination from `(url)` or `(<url>)`, or `null` when it isn't safe. */
function destination(raw: string, safe: (url: string) => string | null): string | null {
  const url = raw.startsWith('<') && raw.endsWith('>') ? raw.slice(1, -1) : raw;
  if (PLACEHOLDER.test(url)) return null;
  return safe(url.replace(/%3C/gi, '<').replace(/%3E/gi, '>').replace(/%20/g, ' '));
}

/** A code-span placeholder, and a built link or image placeholder. */
// eslint-disable-next-line no-control-regex
const CODE_TOKEN = new RegExp('\\u0000(\\d+)\\u0000', 'g');
// eslint-disable-next-line no-control-regex
const BUILT_TOKEN = new RegExp('\\u0001(\\d+)\\u0001', 'g');

const DESTINATION = '(<[^<>\\n]*>|[^\\s()<>]+)';

function inlineMarkdown(text: string): string {
  // 1. Code spans first: their content is literal and only ever restored as text.
  const codes: string[] = [];
  let work = text.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, (_, _fence: string, code: string) => {
    const trimmed = /^ .* $/s.test(code) && code.trim() !== '' ? code.slice(1, -1) : code;
    codes.push(trimmed);
    return `\u0000${codes.length - 1}\u0000`;
  });
  // In an attribute, a code placeholder becomes its plain text.
  const plain = (value: string) =>
    // eslint-disable-next-line no-control-regex
    unescapeMarkdown(value).replace(/\u0000(\d+)\u0000/g, (_, n: string) => codes[Number(n)] ?? '');
  // 2. Images and links, built now and kept out of the rest of the pass.
  const built: string[] = [];
  const keep = (html: string) => {
    built.push(html);
    return `\u0001${built.length - 1}\u0001`;
  };
  work = work
    .replace(
      new RegExp(`!\\[([^\\]]*)\\]\\(${DESTINATION}\\)`, 'g'),
      (_, alt: string, raw: string) => {
        const url = destination(raw, safeImageUrl);
        return url
          ? keep(`<img src="${escapeAttribute(url)}" alt="${escapeAttribute(plain(alt))}">`)
          : '';
      },
    )
    .replace(
      new RegExp(`\\[([^\\]]+)\\]\\(${DESTINATION}\\)`, 'g'),
      (_, label: string, raw: string) => {
        const url = destination(raw, safeLinkUrl);
        const inner = formatInline(label);
        return url ? keep(`<a href="${escapeAttribute(url)}">${inner}</a>`) : inner;
      },
    );
  // 3. Text formatting, then the kept links, then code spans: all in text context.
  return formatInline(work)
    .replace(BUILT_TOKEN, (_, n: string) => built[Number(n)] ?? '')
    .replace(CODE_TOKEN, (_, n: string) => `<code>${escapeText(codes[Number(n)] ?? '')}</code>`);
}

/** Escapes text and applies strong, em, strike and line breaks, keeping placeholders. */
function formatInline(text: string): string {
  return escapeText(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*\\])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w\\])_([^_]+)_/g, '$1<em>$2</em>')
    .replace(/(^|[^\\])~~([^~]+)~~/g, '$1<s>$2</s>')
    .replace(/ {2}\n/g, '<br>')
    .replace(/\\([\\`*_[\]#>+.~-])/g, '$1')
    .replace(/\\&lt;/g, '&lt;')
    .replace(/\\&gt;/g, '&gt;');
}

/**
 * Converts the Markdown the editor writes back to its HTML: paragraphs,
 * `##`–`####` headings, `-`/`*`/`1.` lists (nested by indent), `>` quotes,
 * fenced code, `---`, and inline strong, em, strike, code, links and images.
 * Pure string work, so it runs on a server too.
 */
export function markdownToHtml(markdown: string | null | undefined): string {
  if (!markdown) return '';
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (/^```/.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i]!)) code.push(lines[i++]!);
      i++;
      html += `<pre><code>${escapeText(code.join('\n'))}</code></pre>`;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(Math.max(heading[1]!.length, 2), 4);
      html += `<h${level}>${inlineMarkdown(heading[2]!.trim())}</h${level}>`;
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      html += '<hr>';
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quoted: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]!))
        quoted.push(lines[i++]!.replace(/^>\s?/, ''));
      html += `<blockquote>${markdownToHtml(quoted.join('\n'))}</blockquote>`;
      continue;
    }
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i]!.trim() === '' ? false : /^\s*([-*+]|\d+\.)\s+|^\s{2,}/.test(lines[i]!))
      ) {
        items.push(lines[i++]!);
      }
      html += listHtml(items);
      continue;
    }
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() !== '' &&
      !/^(#{1,6}\s|>|```|\s*([-*+]|\d+\.)\s+)/.test(lines[i]!)
    ) {
      paragraph.push(lines[i++]!);
    }
    html += `<p>${inlineMarkdown(paragraph.join('\n'))}</p>`;
  }
  return html;
}

function listHtml(lines: string[]): string {
  const indentOf = (line: string) => /^\s*/.exec(line)![0].length;
  const base = indentOf(lines[0]!);
  const ordered = /^\s*\d+\./.test(lines[0]!);
  let html = ordered ? '<ol>' : '<ul>';
  let i = 0;
  while (i < lines.length) {
    const text = lines[i]!.replace(/^\s*([-*+]|\d+\.)\s+/, '');
    i++;
    const nested: string[] = [];
    while (i < lines.length && indentOf(lines[i]!) > base) nested.push(lines[i++]!);
    html += `<li>${inlineMarkdown(text.trim())}${nested.length ? listHtml(nested) : ''}</li>`;
  }
  return html + (ordered ? '</ol>' : '</ul>');
}

/** Reads `value` in the output format as the editor's HTML. */
export function richTextToHtml(value: string | null | undefined, output: RichTextOutput): string {
  if (output !== 'markdown') return sanitizeRichText(value);
  const html = markdownToHtml(value);
  // markdownToHtml is pure string work; where there's a DOM, sanitize it too.
  return typeof DOMParser === 'undefined' ? html : sanitizeRichText(html);
}

/** Writes the editor's HTML as `value` in the output format. */
export function richTextFromHtml(html: string, output: RichTextOutput): string {
  const clean = sanitizeRichText(html);
  return output === 'markdown' ? htmlToMarkdown(clean) : clean;
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts

/** The command a key combination runs, or `null`. Mod is Ctrl, or ⌘ on Apple platforms. */
export function shortcutCommand(event: KeyboardEvent): RichTextCommand | null {
  if (!(event.ctrlKey || event.metaKey) || event.altKey) return null;
  const key = event.key.toLowerCase();
  if (!event.shiftKey) {
    return (
      ({ b: 'bold', i: 'italic', u: 'underline', k: 'link' } as Record<string, RichTextCommand>)[
        key
      ] ?? null
    );
  }
  return (
    (
      {
        x: 'strike',
        '7': 'orderedList',
        '&': 'orderedList',
        '8': 'bulletList',
        '*': 'bulletList',
      } as Record<string, RichTextCommand>
    )[key] ?? null
  );
}

/** Markdown shortcuts typed at the start of a block, and the command each runs. */
export const MARKDOWN_SHORTCUTS: Readonly<Record<string, RichTextCommand>> = {
  '##': 'heading2',
  '###': 'heading3',
  '-': 'bulletList',
  '*': 'bulletList',
  '1.': 'orderedList',
  '>': 'quote',
};

// ---------------------------------------------------------------------------
// The contentEditable engine

/** What a toolbar run passes along: a URL for a link, a URL and alt for an image. */
export type RichTextCommandValue = string | { src: string; alt: string } | undefined;

export interface RichTextSurfaceOptions {
  /** Called with the sanitized HTML after every edit. */
  onChange?: (html: string) => void;
  /** Called when the formats at the caret may have changed. */
  onSelectionChange?: () => void;
  /** Called for Mod+K, so the caller can ask for a URL. */
  onLinkShortcut?: () => void;
  /** Whether Markdown shortcuts run. */
  markdownShortcuts?: boolean;
  /** Whether the content can be edited now (not disabled or read-only). Defaults to true. */
  canEdit?: () => boolean;
  /** The most characters allowed now, if any. Typing, pasting and dropping stop there. */
  maxLength?: () => number | null | undefined;
}

const BLOCKS = 'p,h2,h3,h4,li,blockquote,pre,div';

/**
 * Editing on a contentEditable element through the browser's editing
 * commands. Keeps the last selection inside the element, so a toolbar button
 * that takes focus still formats what was selected.
 */
export class RichTextSurface {
  private range: Range | null = null;

  private readonly cleanups: (() => void)[] = [];

  constructor(
    readonly root: HTMLElement,
    private readonly options: RichTextSurfaceOptions = {},
  ) {
    const doc = root.ownerDocument;
    const on = <K extends keyof HTMLElementEventMap>(
      target: HTMLElement | Document,
      type: K,
      listener: (event: HTMLElementEventMap[K]) => void,
    ) => {
      target.addEventListener(type, listener as EventListener);
      this.cleanups.push(() => target.removeEventListener(type, listener as EventListener));
    };
    on(root, 'input', (event) => this.handleInput(event as InputEvent));
    on(root, 'keydown', (event) => this.handleKeydown(event));
    on(root, 'paste', (event) => this.handlePaste(event));
    on(root, 'beforeinput', (event) => this.handleBeforeInput(event as InputEvent));
    on(doc, 'selectionchange', () => {
      const selection = doc.getSelection();
      if (selection?.rangeCount && root.contains(selection.anchorNode)) {
        this.range = selection.getRangeAt(0).cloneRange();
        this.options.onSelectionChange?.();
      }
    });
  }

  /** The content as sanitized HTML; `''` when it holds no text or images. */
  getHtml(): string {
    if (!this.root.textContent?.trim() && !this.root.querySelector('img,hr')) return '';
    return sanitizeRichText(this.root.innerHTML);
  }

  /** Replaces the content, sanitized, without reporting a change. */
  setHtml(html: string): void {
    const clean = sanitizeRichText(html);
    if (sanitizeRichText(this.root.innerHTML) !== clean) this.root.innerHTML = clean;
  }

  /** The commands active at the caret or selection. */
  active(): Set<RichTextCommand> {
    const active = new Set<RichTextCommand>();
    const selection = this.root.ownerDocument.getSelection();
    if (!selection?.rangeCount || !this.root.contains(selection.anchorNode)) return active;
    const doc = this.root.ownerDocument;
    const states: [string, RichTextCommand][] = [
      ['bold', 'bold'],
      ['italic', 'italic'],
      ['underline', 'underline'],
      ['strikeThrough', 'strike'],
      ['insertUnorderedList', 'bulletList'],
      ['insertOrderedList', 'orderedList'],
    ];
    for (const [state, command] of states) {
      try {
        if (doc.queryCommandState(state)) active.add(command);
      } catch {
        // An engine without the command reports nothing.
      }
    }
    const closest = (selector: string) => {
      const node = selection.anchorNode;
      const element = node?.nodeType === 1 ? (node as Element) : node?.parentElement;
      const match = element?.closest(selector);
      return match && this.root.contains(match) && match !== this.root;
    };
    if (closest('h2')) active.add('heading2');
    if (closest('h3')) active.add('heading3');
    if (closest('blockquote')) active.add('quote');
    if (closest('code')) active.add('code');
    if (closest('a')) active.add('link');
    return active;
  }

  /** Runs a command on the last selection inside the element. */
  run(command: RichTextCommand, value?: RichTextCommandValue): void {
    if (!this.editable()) return;
    this.restore();
    const doc = this.root.ownerDocument;
    const exec = (name: string, arg?: string) => {
      try {
        doc.execCommand(name, false, arg);
      } catch {
        // Unsupported commands are ignored.
      }
    };
    try {
      doc.execCommand('styleWithCSS', false, 'false');
    } catch {
      // Older engines don't know styleWithCSS.
    }
    const active = this.active();
    const block = (tag: string, on: boolean) => exec('formatBlock', on ? '<p>' : `<${tag}>`);
    switch (command) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'undo':
      case 'redo':
        exec(command);
        break;
      case 'strike':
        exec('strikeThrough');
        break;
      case 'heading2':
        block('h2', active.has('heading2'));
        break;
      case 'heading3':
        block('h3', active.has('heading3'));
        break;
      case 'quote':
        block('blockquote', active.has('quote'));
        break;
      case 'bulletList':
        exec('insertUnorderedList');
        break;
      case 'orderedList':
        exec('insertOrderedList');
        break;
      case 'code':
        this.toggleCode(active.has('code'));
        break;
      case 'link': {
        const url = safeLinkUrl(typeof value === 'string' ? value : null);
        if (!url) {
          if (active.has('link')) exec('unlink');
          break;
        }
        const selection = doc.getSelection();
        if (selection && !selection.isCollapsed) exec('createLink', url);
        else exec('insertHTML', `<a href="${escapeAttribute(url)}">${escapeText(url)}</a>`);
        break;
      }
      case 'image': {
        const image = typeof value === 'object' ? value : { src: value ?? '', alt: '' };
        const src = safeImageUrl(image.src);
        if (src) {
          exec(
            'insertHTML',
            `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(image.alt)}">`,
          );
        }
        break;
      }
    }
    this.emit();
    this.options.onSelectionChange?.();
  }

  /** Removes the listeners. */
  destroy(): void {
    for (const cleanup of this.cleanups.splice(0)) cleanup();
  }

  private restore(): void {
    const selection = this.root.ownerDocument.getSelection();
    if (this.root.ownerDocument.activeElement !== this.root)
      this.root.focus({ preventScroll: true });
    if (this.range && selection) {
      selection.removeAllRanges();
      selection.addRange(this.range);
    }
  }

  private toggleCode(on: boolean): void {
    const selection = this.root.ownerDocument.getSelection();
    if (!selection?.rangeCount) return;
    if (on) {
      const node = selection.anchorNode;
      const code = (node?.nodeType === 1 ? (node as Element) : node?.parentElement)?.closest(
        'code',
      );
      if (code && this.root.contains(code)) code.replaceWith(...Array.from(code.childNodes));
      return;
    }
    if (selection.isCollapsed) return;
    this.root.ownerDocument.execCommand(
      'insertHTML',
      false,
      `<code>${escapeText(selection.toString())}</code>`,
    );
  }

  private emit(): void {
    this.options.onChange?.(this.getHtml());
  }

  private handleInput(event: InputEvent): void {
    if (
      this.options.markdownShortcuts !== false &&
      event.inputType === 'insertText' &&
      event.data === ' '
    ) {
      this.markdownShortcut();
    }
    this.emit();
  }

  private markdownShortcut(): void {
    const selection = this.root.ownerDocument.getSelection();
    const node = selection?.anchorNode;
    if (!selection?.isCollapsed || !node || node.nodeType !== 3 || !this.root.contains(node))
      return;
    const before = (node.textContent ?? '').slice(0, selection.anchorOffset);
    const match = /^(#{2,3}|[-*]|1\.|>)[\s\u00a0]$/.exec(before);
    if (!match) return;
    const blockElement = node.parentElement?.closest(BLOCKS);
    const block = blockElement && this.root.contains(blockElement) ? blockElement : this.root;
    if (!(block.textContent ?? '').startsWith(before)) return;
    const command = MARKDOWN_SHORTCUTS[match[1]!];
    if (!command) return;
    const range = this.root.ownerDocument.createRange();
    range.setStart(node, 0);
    range.setEnd(node, selection.anchorOffset);
    selection.removeAllRanges();
    selection.addRange(range);
    this.root.ownerDocument.execCommand('delete');
    this.range = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    this.run(command);
  }

  private editable(): boolean {
    return this.options.canEdit?.() ?? true;
  }

  /** Characters that still fit under maxLength, counting the selection as replaced; Infinity without one. */
  private room(): number {
    const max = this.options.maxLength?.();
    if (!max) return Infinity;
    const selection = this.root.ownerDocument.getSelection();
    const selected =
      selection?.rangeCount && this.root.contains(selection.anchorNode)
        ? Array.from(selection.toString()).length
        : 0;
    return Math.max(0, max - Array.from(this.root.textContent ?? '').length + selected);
  }

  private handleBeforeInput(event: InputEvent): void {
    if (!event.inputType.startsWith('insert') || event.inputType === 'insertParagraph') return;
    if (event.inputType === 'insertLineBreak') return;
    const room = this.room();
    if (room === Infinity) return;
    const text = event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
    const adding = Array.from(text).length || 1;
    if (adding > room) event.preventDefault();
  }

  private handleKeydown(event: KeyboardEvent): void {
    const command = shortcutCommand(event);
    if (!command || !this.editable()) return;
    event.preventDefault();
    if (command === 'link') {
      this.options.onLinkShortcut?.();
      return;
    }
    this.run(command);
  }

  private handlePaste(event: ClipboardEvent): void {
    if (!this.editable()) return;
    const html = event.clipboardData?.getData('text/html');
    const text = event.clipboardData?.getData('text/plain') ?? '';
    const room = this.room();
    const plainLength = Array.from(
      html ? (new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '') : text,
    ).length;
    if (plainLength > room) {
      // Too long for maxLength: paste the text that fits, without formatting.
      event.preventDefault();
      const fits = Array.from(text || '')
        .slice(0, room)
        .join('');
      if (fits) this.root.ownerDocument.execCommand('insertText', false, fits);
      return;
    }
    if (!html) return;
    event.preventDefault();
    this.root.ownerDocument.execCommand('insertHTML', false, sanitizeRichText(html));
  }
}
