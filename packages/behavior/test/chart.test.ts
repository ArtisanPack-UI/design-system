/**
 * Chart (#63): the geometry against the shared vectors (Livewire UI
 * Components' ChartGeometryTest reads a copy of the same file, so Blade, React
 * and Vue draw identical numbers), nice-number ticks and value formatting,
 * and the tooltip on hover and keyboard focus through the Alpine adapter.
 */
import vectors from './fixtures/chart-vectors.json';
import {
  chartGeometry,
  chartPointLabels,
  chartSeries,
  chartTicks,
  formatChartTicks,
  formatChartValue,
  niceNumber,
  type ChartOptions,
} from '../src/data/chart';
import { chartTooltipPosition } from '../src/data/chart-tooltip';
import { close, open, settle } from './browser';

afterAll(close);

describe('chart geometry', () => {
  it.each(vectors.geometry.map((vector) => [vector.name, vector] as const))(
    'matches the shared vector: %s',
    (_, vector) => {
      expect(chartGeometry(vector.series, vector.options as ChartOptions)).toEqual(vector.expected);
    },
  );

  it.each(vectors.ticks.map((vector) => [vector.min, vector.max, vector.expected] as const))(
    'ticks %s to %s',
    (min, max, expected) => {
      expect(chartTicks(min, max)).toEqual(expected);
    },
  );

  it.each(vectors.values.map((vector) => [vector.value, vector] as const))(
    'formats %s',
    (_, vector) => {
      expect(formatChartValue(vector.value, vector.options as ChartOptions)).toBe(vector.expected);
    },
  );

  it.each(vectors.tickLabels.map((vector) => [vector.ticks.join(', '), vector] as const))(
    'labels the ticks %s',
    (_, vector) => {
      expect(formatChartTicks(vector.ticks, vector.options as ChartOptions)).toEqual(
        vector.expected,
      );
    },
  );

  it('prints small values and ticks with the decimals they need, not as 0', () => {
    expect(formatChartValue(0.0012)).toBe('0.0012');
    expect(formatChartValue(0.125, { suffix: '%' })).toBe('0.13%');
    expect(formatChartTicks([0, 0.001, 0.002])).toEqual(['0', '0.001', '0.002']);
  });

  it('gives any range a finite axis with distinct ends, never hanging or dividing by zero', () => {
    expect(chartTicks(0, Number.MAX_VALUE)).toEqual([0, 2e299, 4e299, 6e299, 8e299, 1e300]);
    expect(chartTicks(-Infinity, Infinity)).toEqual([-1e300, -5e299, 0, 5e299, 1e300]);
    expect(chartTicks(0, 1e-60)).toEqual([0, 1e-10]);
    expect(chartTicks(Number.NaN, Number.NaN)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
    const tiny = chartGeometry([{ name: 'A', data: [1e-60, -1e-300] }], { type: 'area' });
    expect(tiny.ticks.map((tick) => tick.label)).toEqual(['-0.0000000001', '0', '0.0000000001']);
    expect(JSON.stringify(tiny)).not.toMatch(/NaN|Infinity/);
  });

  it('prints values from 1e21 up in full, as PHP does, not in exponent notation', () => {
    expect(formatChartValue(2.5e21)).toBe('2,500,000,000,000,000,000,000');
    expect(formatChartValue(-1e21, { notation: 'compact' })).toBe('-1,000,000,000,000.0B');
  });

  it('falls back to the default viewBox when the size leaves no room inside the padding', () => {
    const size = (width: number, height: number) => {
      const geometry = chartGeometry([1, 2], { width, height });
      return [geometry.width, geometry.height];
    };
    expect(size(48, 36)).toEqual([520, 220]);
    expect(size(49, 37)).toEqual([49, 37]);
    expect(size(Infinity, Number.NaN)).toEqual([520, 220]);
  });

  it('steps the compact unit up when rounding reaches 1,000 of it', () => {
    expect(formatChartValue(999_950, { notation: 'compact' })).toBe('1.0M');
    expect(formatChartValue(999.996, { notation: 'compact' })).toBe('1.0k');
    expect(formatChartValue(999_949, { notation: 'compact' })).toBe('999.9k');
  });

  it('draws the spec preview grid, labeled best week and bar paths', () => {
    const geometry = chartGeometry(
      vectors.geometry[0]!.series,
      vectors.geometry[0]!.options as ChartOptions,
    );
    expect(geometry.ticks.map((tick) => [tick.y, tick.label])).toEqual([
      ['196.0', '$0k'],
      ['159.2', '$2k'],
      ['122.4', '$4k'],
      ['85.6', '$6k'],
      ['48.8', '$8k'],
      ['12.0', '$10k'],
    ]);
    expect(geometry.value).toEqual({ x: '205.2', y: '4.0', text: '$10.0k' });
    expect(geometry.marks).toHaveLength(10);
    expect(geometry.legend).toEqual([]);
  });

  it('picks Heckbert nice numbers', () => {
    expect([niceNumber(7.4, false), niceNumber(2.5, true), niceNumber(0.031, true)]).toEqual([
      10, 2, 0.05,
    ]);
    expect(niceNumber(0, true)).toBe(1);
  });

  it('shares one compact unit across the axis', () => {
    expect(formatChartTicks([0, 500, 1000, 1500], { notation: 'compact', prefix: '$' })).toEqual([
      '$0k',
      '$0.5k',
      '$1k',
      '$1.5k',
    ]);
  });

  it('reads plain values as one series named by the title, and skips non-numbers', () => {
    expect(chartSeries([1, 'x', '2.5', Number.NaN], 'Visits')).toEqual([
      { name: 'Visits', data: [1, null, 2.5, null] },
    ]);
    expect(chartSeries([{ data: [1] }, 4, { name: 'B', data: 'x' }])).toEqual([
      { name: '', data: [1] },
      { name: 'B', data: [] },
    ]);
    expect(chartSeries(null)).toEqual([]);
  });

  it('reads ApexCharts {x, y} and [x, y] points, labeling the categories by x', () => {
    expect(
      chartSeries([{ name: 'A', data: [{ x: 'a' }, [1, 2, 3], [null, 7], { x: 1, y: '2' }] }]),
    ).toEqual([{ name: 'A', data: [null, null, 7, 2] }]);
    expect(
      chartPointLabels([{ data: [1, 2] }, { data: [{ x: 'Jan', y: 1 }, 4, ['Mar', 2]] }]),
    ).toEqual(['Jan', '', 'Mar']);
    expect(chartPointLabels(null)).toEqual([]);
    const geometry = chartGeometry(
      [
        {
          name: 'V',
          data: [
            { x: 'Jan', y: 3 },
            { x: 'Feb', y: 5 },
          ],
        },
      ],
      {
        type: 'line',
        labels: [],
      },
    );
    expect(geometry.categories.map((category) => category.label)).toEqual(['Jan', 'Feb']);
  });

  it('falls back to a bar chart for an unknown type', () => {
    expect(chartGeometry([1, 2], { type: 'pie' as never }).type).toBe('bar');
  });
});

describe('chart tooltip position', () => {
  it('centers above the anchor, kept inside the root', () => {
    expect(chartTooltipPosition({ x: 100, y: 80 }, 400, { width: 60, height: 40 })).toEqual({
      left: 70,
      top: 32,
      placement: 'top',
    });
    expect(chartTooltipPosition({ x: 10, y: 80 }, 400, { width: 60, height: 40 }).left).toBe(0);
    expect(chartTooltipPosition({ x: 395, y: 80 }, 400, { width: 60, height: 40 }).left).toBe(340);
  });

  it('flips below when there is no room above', () => {
    expect(chartTooltipPosition({ x: 100, y: 20 }, 400, { width: 60, height: 40 })).toEqual({
      left: 70,
      top: 28,
      placement: 'bottom',
    });
  });
});

// The real markup's shape: a padded card root, the header, then the body part
// (position: relative) holding the plot and the tooltip, so the tooltip's
// containing block is the body, not the root.
const chartMarkup = `
<div id="chart" class="apui-card apui-chart" x-data="apuiChart" style="display: grid; gap: 12px; padding: 24px; border: 1px solid; width: 520px">
  <div data-scope="chart" data-part="header" style="height: 40px"><h3 data-scope="chart" data-part="title" style="margin: 0">Sales</h3></div>
  <div id="body" data-scope="chart" data-part="body" style="position: relative; min-inline-size: 0">
    <svg id="plot" data-scope="chart" data-part="plot" viewBox="0 0 520 220" style="display: block; width: 520px; height: 220px">
      <g data-scope="chart" data-part="point" data-index="0" visibility="hidden"><circle cx="40" cy="50" r="5" /></g>
      <g data-scope="chart" data-part="point" data-index="1" visibility="hidden"><circle cx="300" cy="80" r="5" /></g>
      <rect id="m0" data-scope="chart" data-part="mark" data-index="0" tabindex="0" role="img" aria-label="Q1: 4" data-tooltip-title="Q1" data-tooltip-body="4" data-anchor-x="40" data-anchor-y="50" x="0" y="0" width="200" height="220" />
      <rect id="m1" data-scope="chart" data-part="mark" data-index="1" tabindex="0" role="img" aria-label="Q2: 8" data-tooltip-title="Q2" data-tooltip-body="8" data-anchor-x="300" data-anchor-y="80" x="200" y="0" width="200" height="220" />
      <rect id="m2" data-scope="chart" data-part="mark" data-index="2" tabindex="0" role="img" aria-label="Q3: 9" data-tooltip-title="Q3" data-tooltip-body="9" data-anchor-x="515" data-anchor-y="10" x="400" y="0" width="120" height="220" />
    </svg>
    <div id="tip" data-scope="chart" data-part="tooltip" aria-hidden="true" hidden style="position: absolute; white-space: nowrap; padding: 8px 10px"></div>
  </div>
</div>
<button id="after">After</button>`;

const tip = (page: import('playwright').Page) =>
  page.$eval('#tip', (el) => ({
    hidden: (el as HTMLElement).hidden,
    html: el.innerHTML,
    placement: el.getAttribute('data-placement'),
  }));

describe('chart tooltip (Alpine)', () => {
  it('opens on keyboard focus, follows focus between marks and closes on Escape and blur', async () => {
    const { page, errors } = await open(chartMarkup);
    expect((await tip(page)).hidden).toBe(true);

    await page.focus('#m0');
    await settle(page);
    expect(await tip(page)).toEqual({
      hidden: false,
      html: '<strong>Q1</strong>4',
      placement: 'top',
    });
    expect(await page.getAttribute('#m0', 'data-state')).toBe('active');
    expect(await page.getAttribute('[data-index="0"][data-part="point"]', 'visibility')).toBe(
      'visible',
    );

    await page.keyboard.press('Tab');
    await settle(page);
    expect((await tip(page)).html).toBe('<strong>Q2</strong>8');
    expect(await page.getAttribute('#m0', 'data-state')).toBeNull();
    expect(await page.getAttribute('[data-index="0"][data-part="point"]', 'visibility')).toBe(
      'hidden',
    );
    expect(await page.getAttribute('[data-index="1"][data-part="point"]', 'visibility')).toBe(
      'visible',
    );

    await page.keyboard.press('Escape');
    expect((await tip(page)).hidden).toBe(true);

    await page.focus('#m2');
    await page.keyboard.press('Tab');
    expect((await tip(page)).hidden).toBe(true);
    expect(errors).toEqual([]);
  });

  it('opens on hover above the anchor and closes when the pointer leaves', async () => {
    const { page } = await open(chartMarkup);
    await page.hover('#m1');
    await settle(page);
    const shown = await tip(page);
    expect(shown.hidden).toBe(false);
    // On screen, the tooltip is centered over the anchor (the plot's x 300)
    // and its bottom sits 8px above the anchor's y 80, whatever the card's
    // padding and header height.
    const placed = await page.evaluate(() => {
      const plot = document.getElementById('plot')!.getBoundingClientRect();
      const tooltip = document.getElementById('tip')!.getBoundingClientRect();
      return {
        centerX: tooltip.left + tooltip.width / 2 - plot.left,
        bottom: tooltip.bottom - plot.top,
      };
    });
    expect(placed.centerX).toBeCloseTo(300, 0);
    expect(placed.bottom).toBeCloseTo(72, 0);

    await page.mouse.move(600, 400);
    await settle(page);
    expect((await tip(page)).hidden).toBe(true);
  });

  it('clamps to the body width and flips below near the top, measured in the body', async () => {
    const { page } = await open(chartMarkup);
    await page.focus('#m2');
    await settle(page);
    expect((await tip(page)).placement).toBe('bottom');
    const placed = await page.evaluate(() => {
      const body = document.getElementById('body')!.getBoundingClientRect();
      const plot = document.getElementById('plot')!.getBoundingClientRect();
      const tooltip = document.getElementById('tip')!.getBoundingClientRect();
      return { right: tooltip.right - body.right, top: tooltip.top - plot.top };
    });
    expect(placed.right).toBeCloseTo(0, 0);
    expect(placed.top).toBeCloseTo(18, 0);
  });
});
