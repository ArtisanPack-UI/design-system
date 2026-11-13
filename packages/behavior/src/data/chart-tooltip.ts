/**
 * The Chart tooltip (#63): one small DOM controller every stack attaches to
 * the chart's root (Alpine's `apuiChart`, a React effect, a Vue mount hook),
 * so hover and keyboard focus behave the same everywhere. Not a Zag machine:
 * the marks are server- or framework-rendered SVG, and the controller only
 * listens on the root, so Livewire's morph and re-renders never detach it.
 *
 * Each mark (`[data-scope="chart"][data-part="mark"]`) is focusable, has an
 * accessible name, and carries `data-index`, `data-tooltip-title`,
 * `data-tooltip-body`, `data-anchor-x` and `data-anchor-y` (viewBox units).
 * Hovering or focusing one fills the tooltip part, places it above the
 * anchor, marks the mark `data-state="active"` and shows the line or area
 * chart's point (crosshair and dots) for that category. Escape, blur and
 * pointer leave hide it. The tooltip is `aria-hidden`: the mark's name
 * already says the same.
 */

const MARK = '[data-scope="chart"][data-part="mark"]';
const TOOLTIP = '[data-scope="chart"][data-part="tooltip"]';
const POINT = '[data-scope="chart"][data-part="point"]';

/**
 * The tooltip's top-left corner, relative to its containing block (the
 * chart's `body` part, which is `position: relative`).
 */
export interface ChartTooltipPosition {
  left: number;
  top: number;
  placement: 'top' | 'bottom';
}

/**
 * Where the tooltip goes: centered over the anchor and `gap` above it, kept
 * inside its containing block's width, or below the anchor when there's no
 * room above. The anchor is in the containing block's coordinates.
 */
export function chartTooltipPosition(
  anchor: { x: number; y: number },
  containerWidth: number,
  tip: { width: number; height: number },
  gap = 8,
): ChartTooltipPosition {
  const left = Math.min(
    Math.max(anchor.x - tip.width / 2, 0),
    Math.max(containerWidth - tip.width, 0),
  );
  const above = anchor.y - tip.height - gap;
  return above >= 0
    ? { left, top: above, placement: 'top' }
    : { left, top: anchor.y + gap, placement: 'bottom' };
}

/** Attaches the tooltip to a chart's root. Returns the cleanup. */
export function attachChartTooltip(root: HTMLElement): () => void {
  let active: Element | null = null;

  const markOf = (target: EventTarget | null): Element | null =>
    target instanceof Element ? target.closest(MARK) : null;

  /**
   * The box the tooltip's `left` and `top` are measured from: the padding box
   * of its offset parent (the `body` part), or the root when it has none.
   */
  const containerOf = (tooltip: HTMLElement): { left: number; top: number; width: number } => {
    const container = tooltip.offsetParent instanceof HTMLElement ? tooltip.offsetParent : root;
    const box = container.getBoundingClientRect();
    return {
      left: box.left + container.clientLeft,
      top: box.top + container.clientTop,
      width: container.clientWidth || box.width,
    };
  };

  const anchorOf = (
    mark: Element,
    container: { left: number; top: number },
  ): { x: number; y: number } => {
    const svg = mark.closest('svg');
    const x = Number(mark.getAttribute('data-anchor-x') ?? 0);
    const y = Number(mark.getAttribute('data-anchor-y') ?? 0);
    if (!svg) return { x, y };
    const box = svg.getBoundingClientRect();
    const view = svg.viewBox?.baseVal;
    const scaleX = view && view.width ? box.width / view.width : 1;
    const scaleY = view && view.height ? box.height / view.height : 1;
    return {
      x: box.left - container.left + x * scaleX,
      y: box.top - container.top + y * scaleY,
    };
  };

  const setPoints = (index: string | null) => {
    for (const point of Array.from(root.querySelectorAll(POINT))) {
      point.setAttribute(
        'visibility',
        index !== null && point.getAttribute('data-index') === index ? 'visible' : 'hidden',
      );
    }
  };

  const hide = () => {
    active?.removeAttribute('data-state');
    active = null;
    setPoints(null);
    const tooltip = root.querySelector<HTMLElement>(TOOLTIP);
    if (tooltip) {
      tooltip.hidden = true;
      tooltip.removeAttribute('data-placement');
    }
  };

  const show = (mark: Element) => {
    if (active === mark) return;
    active?.removeAttribute('data-state');
    active = mark;
    mark.setAttribute('data-state', 'active');
    setPoints(mark.getAttribute('data-index'));
    const tooltip = root.querySelector<HTMLElement>(TOOLTIP);
    if (!tooltip) return;
    const title = document.createElement('strong');
    title.textContent = mark.getAttribute('data-tooltip-title') ?? '';
    tooltip.replaceChildren(
      title,
      document.createTextNode(mark.getAttribute('data-tooltip-body') ?? ''),
    );
    tooltip.hidden = false;
    const tipBox = tooltip.getBoundingClientRect();
    const container = containerOf(tooltip);
    const position = chartTooltipPosition(anchorOf(mark, container), container.width, {
      width: tipBox.width,
      height: tipBox.height,
    });
    tooltip.style.left = `${position.left}px`;
    tooltip.style.top = `${position.top}px`;
    tooltip.setAttribute('data-placement', position.placement);
  };

  const onOver = (event: Event) => {
    const mark = markOf(event.target);
    if (mark) show(mark);
  };
  const onOut = (event: Event) => {
    const mark = markOf(event.target);
    const next = markOf((event as MouseEvent | FocusEvent).relatedTarget);
    if (mark && mark === active && next !== mark) {
      if (next) show(next);
      else hide();
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && active) hide();
  };

  root.addEventListener('mouseover', onOver);
  root.addEventListener('mouseout', onOut);
  root.addEventListener('focusin', onOver);
  root.addEventListener('focusout', onOut);
  root.addEventListener('keydown', onKey);
  return () => {
    root.removeEventListener('mouseover', onOver);
    root.removeEventListener('mouseout', onOut);
    root.removeEventListener('focusin', onOver);
    root.removeEventListener('focusout', onOut);
    root.removeEventListener('keydown', onKey);
  };
}
