/**
 * The `apuiChart` Alpine component (#63): attaches the Chart tooltip to the
 * chart's root, for Livewire's server-rendered SVG.
 *
 *   <div class="apui-card apui-chart" x-data="apuiChart">…</div>
 *
 * The controller listens on the root only, so Livewire's morph redrawing the
 * marks (`wire:poll`, new data) keeps it working.
 */
import { attachChartTooltip } from '../data/chart-tooltip';

/** The Alpine data for a chart's root. */
export function chartComponent() {
  let detach: (() => void) | null = null;
  return {
    init(this: { $el: HTMLElement }) {
      detach = attachChartTooltip(this.$el);
    },
    destroy() {
      detach?.();
      detach = null;
    },
  };
}
