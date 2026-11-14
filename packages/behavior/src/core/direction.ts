/**
 * The text direction a React or Vue widget renders in. The hooks compute part
 * props before the elements exist, so their first render reads `<html dir>`
 * (`direction()` in options.ts); after mount the adapters measure the
 * direction the widget actually sits in with `measureDirection()` and hand
 * it to the machine, so `<div dir="rtl">` around a widget works like
 * `<html dir="rtl">`: its parts get `dir="rtl"` and arrow keys follow it. An
 * explicit `dir` option always wins. Alpine reads its element's direction
 * directly (`directionOf`).
 */
import type { Direction } from '../positioning';

/** Quotes a value for an attribute selector. */
const quoted = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;

/**
 * The computed direction around a widget's rendered parts when it differs
 * from `<html dir>`; undefined when it's the same, before the parts exist,
 * or without a DOM. The parts are found by the author's
 * string ids, else by the machine id in Zag's default ids
 * (`dialog:<id>:content`); the first in document order wins, so an in-place
 * part beats one portalled to the body. Zag writes `dir` on every part, so
 * the measurement is taken outside the widget's own parts.
 */
export function measureDirection(id: string, ids?: unknown): Direction | undefined {
  if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') return undefined;
  const found = new Set<Element>();
  if (ids && typeof ids === 'object') {
    for (const value of Object.values(ids as Record<string, unknown>)) {
      const el = typeof value === 'string' && value ? document.getElementById(value) : null;
      if (el) found.add(el);
    }
  }
  const selector = `[id*=${quoted(`:${id}:`)}], [id$=${quoted(`:${id}`)}]`;
  document.querySelectorAll(selector).forEach((el) => found.add(el));
  const first = [...found].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )[0];
  if (!first) return undefined;
  let node: Element | null = first.parentElement;
  // Skip parts of this or an enclosing widget that carry a written `dir`.
  while (node && node.hasAttribute('data-scope') && node.hasAttribute('dir')) {
    node = node.parentElement;
  }
  const measured =
    getComputedStyle(node ?? document.documentElement).direction === 'rtl' ? 'rtl' : 'ltr';
  // The same as `<html dir>` changes nothing: the machine keeps the props it
  // had (and parts without a written `dir`, as Alpine renders them).
  return measured === documentDirection() ? undefined : measured;
}

/** `<html dir>`, as the hooks read it before mount. */
function documentDirection(): Direction {
  return document.documentElement.getAttribute('dir')?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
}
