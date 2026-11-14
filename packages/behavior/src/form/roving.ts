/**
 * Roving focus for a horizontal row of controls: a toolbar's buttons or a
 * tablist's tabs. One item is in the tab order; the arrow keys, Home and End
 * move between the rest. ArrowLeft and ArrowRight follow the text direction
 * (D-004): under RTL, ArrowLeft moves to the next item.
 */
import { directionOf } from '../positioning';

/** The enabled items of a row, in DOM order. */
export function rovingItems(container: Element, selector: string): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (item) =>
      !item.hasAttribute('disabled') &&
      item.getAttribute('aria-disabled') !== 'true' &&
      !item.hidden,
  );
}

/**
 * Puts one item in the tab order: `active`, else the current tab stop if it
 * still exists, else the first item.
 */
export function syncRovingTabIndex(
  container: Element,
  selector: string,
  active?: Element | null,
): void {
  const all = Array.from(container.querySelectorAll<HTMLElement>(selector));
  const items = rovingItems(container, selector);
  const stop =
    (active && items.includes(active as HTMLElement) ? (active as HTMLElement) : undefined) ??
    items.find((item) => item.tabIndex === 0) ??
    items[0];
  for (const item of all) item.tabIndex = item === stop ? 0 : -1;
}

/**
 * Handles an arrow, Home or End key on a row. Returns the item it focused,
 * or `null` when the key isn't one it handles.
 */
export function rovingKeydown(
  event: KeyboardEvent,
  container: Element,
  selector: string,
): HTMLElement | null {
  const items = rovingItems(container, selector);
  if (!items.length) return null;
  const current = items.indexOf(event.target as HTMLElement);
  const rtl = directionOf(container as HTMLElement) === 'rtl';
  let next: number;
  switch (event.key) {
    case 'ArrowRight':
      next = current + (rtl ? -1 : 1);
      break;
    case 'ArrowLeft':
      next = current + (rtl ? 1 : -1);
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = items.length - 1;
      break;
    default:
      return null;
  }
  event.preventDefault();
  const target = items[(next + items.length) % items.length]!;
  syncRovingTabIndex(container, selector, target);
  target.focus();
  return target;
}
