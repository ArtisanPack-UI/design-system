/**
 * Keeping client state through a server morph (#34).
 *
 * Machines write some state outside their part props, from effects: a modal
 * dialog marks everything else `aria-hidden` (or `inert`) and gives its layer
 * inline `pointer-events` and stacking variables. A morph (Livewire, htmx's
 * idiomorph, Turbo) resets every element to the server's HTML, which has none
 * of that, so the page behind an open modal would become readable to screen
 * readers again and the dialog would stop taking clicks.
 *
 * A widget re-applies its own part props after a morph, but it can't tell a
 * morph from the machine's own cleanup by watching the DOM. So the morph
 * itself copies the state across: call `keepClientState(el, toEl)` before each
 * element is patched. The Alpine adapter does this for Livewire.
 */

/** Markers the machines' `aria-hidden` and `inert` helpers set, with the attribute each one guards. */
const MARKERS: Record<string, string> = {
  'data-aria-hidden': 'aria-hidden',
  'data-inerted': 'inert',
  'data-suppressed': 'aria-hidden',
};

/**
 * Copies the client-owned state of `from` onto `to`, the incoming server
 * version of the same element, so the morph keeps it:
 *
 * - `aria-hidden` and `inert` that a machine set, with their markers.
 * - On behavior parts (`data-scope`), the inline styles machine effects
 *   write (see `isEffectStyle`), when the server didn't render them.
 *
 * The server's own attributes always win; only what's missing is copied.
 */
export function keepClientState(from: Element, to: Element): void {
  if (from.nodeType !== 1 || to.nodeType !== 1) return;

  for (const [marker, attribute] of Object.entries(MARKERS)) {
    if (!from.hasAttribute(marker)) continue;
    if (!to.hasAttribute(marker)) to.setAttribute(marker, from.getAttribute(marker) ?? '');
    const value = from.getAttribute(attribute);
    if (value !== null && !to.hasAttribute(attribute)) to.setAttribute(attribute, value);
  }

  if (from.hasAttribute('data-scope') && from.hasAttribute('style')) {
    const source = (from as HTMLElement).style;
    const target = (to as HTMLElement).style;
    if (!source || !target) return;
    for (const property of effectStyles(source)) {
      if (!target.getPropertyValue(property)) {
        target.setProperty(
          property,
          source.getPropertyValue(property),
          source.getPropertyPriority(property),
        );
      }
    }
  }
}

/**
 * Whether a machine's effects own an inline style property: `pointer-events`
 * (a dismissable layer) and custom properties (layer stacking, and the
 * positioner's `--x`, `--y`, `--reference-width` and friends). Only these are
 * carried through a morph or restored after one, so the server can still
 * change or remove its own inline styles, such as a `max-height`.
 */
export function isEffectStyle(property: string): boolean {
  return property === 'pointer-events' || property.startsWith('--');
}

/** The effect-owned properties in a style declaration. */
export function effectStyles(style: CSSStyleDeclaration): string[] {
  const properties: string[] = [];
  for (let i = 0; i < style.length; i++) {
    const property = style.item(i);
    if (isEffectStyle(property)) properties.push(property);
  }
  return properties;
}

interface LivewireLike {
  hook(name: string, callback: (payload: { el: Element; toEl: Element }) => void): void;
}

/**
 * Hooks `keepClientState` into Livewire's morph (3 and 4). Returns false when
 * Livewire isn't on the page.
 */
export function keepClientStateInLivewire(livewire: unknown): boolean {
  const lw = livewire as Partial<LivewireLike> | undefined;
  if (!lw || typeof lw.hook !== 'function') return false;
  lw.hook('morph.updating', ({ el, toEl }) => {
    if (el && toEl) keepClientState(el, toEl);
  });
  return true;
}
