/**
 * The data-display helpers (#61): Sparkline geometry, matching the spec's
 * preview coordinates, and the Diff component's line and word diff. The PHP
 * ports in Livewire UI Components are tested against the same expectations.
 */
import {
  DIFF_MAX_CELLS,
  diffCountsLabel,
  diffLinesOf,
  diffText,
  splitRows,
  wordDiff,
} from '../src/data/diff';
import { sparklineGeometry, sparklineLabel } from '../src/data/sparkline';

const SPEC = [8, 12, 10, 16, 15, 19, 23, 22, 26];

describe('sparkline geometry', () => {
  it('draws the spec preview line, with a dot on the latest value', () => {
    const geometry = sparklineGeometry([2, 4, 3, 7, 6, 9, 12, 11, 14], 'line', 96, 28);
    expect(geometry.line).toBe(
      'M2.0,25.0 L13.5,21.3 L25.0,23.2 L36.5,15.8 L48.0,17.7 L59.5,12.2 L71.0,6.7 L82.5,8.5 L94.0,3.0',
    );
    expect(geometry.area).toBe('');
    expect(geometry.dot).toEqual({ cx: '94.0', cy: '3.0' });
    expect(geometry.bars).toEqual([]);
    expect(geometry.baseline).toBeNull();
  });

  it('closes the area to the bottom edge', () => {
    const geometry = sparklineGeometry(SPEC, 'area', 96, 36);
    expect(geometry.area.endsWith('L94.0,36 L2.0,36 Z')).toBe(true);
    expect(geometry.area.startsWith(geometry.line)).toBe(true);
  });

  it('draws one bar per value from the bottom edge', () => {
    const { bars, line, dot } = sparklineGeometry([2, 6, 4, 7, 5, 8, 10, 7, 12], 'bar', 96, 28);
    expect(line).toBe('');
    expect(dot).toBeNull();
    expect(bars).toHaveLength(9);
    expect(bars[0]).toEqual({ x: '4.0', y: '25.0', width: '6.1', height: '3.0' });
    expect(bars[8]).toEqual({ x: '85.8', y: '3.0', width: '6.1', height: '25.0' });
  });

  it('marks zero when the values cross it, and grows bars from there', () => {
    const geometry = sparklineGeometry([-4, 4], 'bar', 96, 28);
    expect(geometry.baseline).toBe('14.0');
    expect(geometry.bars[0]).toEqual({ x: '11.2', y: '14.0', width: '27.6', height: '11.0' });
    expect(geometry.bars[1]!.y).toBe('3.0');
  });

  it('centers flat and single values, and skips what is not a number', () => {
    expect(sparklineGeometry([5, 5], 'line', 96, 28).line).toBe('M2.0,14.0 L94.0,14.0');
    expect(sparklineGeometry([5], 'line', 96, 28).dot).toEqual({ cx: '48.0', cy: '14.0' });
    expect(sparklineGeometry([], 'area').line).toBe('');
    expect(sparklineGeometry(['x', Number.NaN, 3] as unknown[], 'line').dot).not.toBeNull();
  });

  it('fills the label template', () => {
    expect(sparklineLabel('Trend from {first} to {latest}', SPEC)).toBe('Trend from 8 to 26');
    expect(sparklineLabel('{count} weeks, {min} to {max}', SPEC)).toBe('9 weeks, 8 to 26');
  });
});

const OLD = `{
  price: 220000,
  rent: 1600,
  currency: "USD",
  available: "2027-01-01",
}
`;
const NEW = `{
  price: 220000,
  rent: 1650,
  deposit: 3300,
  currency: "USD",
  available: "2027-01-15",
}
`;

describe('diff', () => {
  it('splits lines without a phantom last line', () => {
    expect(diffLinesOf('a\r\nb\n')).toEqual(['a', 'b']);
    expect(diffLinesOf('')).toEqual([]);
  });

  it('builds hunks with counts and context, deletions before additions', () => {
    const result = diffText(OLD, NEW, { context: 1 });
    expect(result.additions).toBe(3);
    expect(result.deletions).toBe(2);
    expect(result.hunks).toHaveLength(1);
    const [hunk] = result.hunks;
    expect(hunk!.header).toBe('@@ -2,5 +2,6 @@');
    expect(hunk!.lines.map((line) => line.type)).toEqual([
      'ctx',
      'del',
      'add',
      'add',
      'ctx',
      'del',
      'add',
      'ctx',
    ]);
    expect(hunk!.lines[1]).toMatchObject({ oldNumber: 3, newNumber: null });
    expect(hunk!.lines[3]).toMatchObject({ oldNumber: null, newNumber: 4 });
  });

  it('marks changed words in paired lines', () => {
    const [hunk] = diffText(OLD, NEW).hunks;
    expect(hunk!.lines[2]!.segments).toEqual([
      { text: '  rent: ', changed: false },
      { text: '1600', changed: true },
      { text: ',', changed: false },
    ]);
    expect(hunk!.lines[3]!.segments).toEqual([
      { text: '  rent: ', changed: false },
      { text: '1650', changed: true },
      { text: ',', changed: false },
    ]);
    // The unpaired addition has no word marks.
    expect(hunk!.lines[4]!.segments).toEqual([{ text: '  deposit: 3300,', changed: false }]);
  });

  it('leaves lines that share nothing, or wordLevel off, unmarked', () => {
    expect(wordDiff('abc', 'xyz')).toBeNull();
    const [hunk] = diffText(OLD, NEW, { wordLevel: false }).hunks;
    expect(hunk!.lines.every((line) => line.segments.length === 1)).toBe(true);
  });

  it('separates distant changes into hunks', () => {
    const before = Array.from({ length: 20 }, (_, index) => `line ${index + 1}`).join('\n');
    const after = before.replace('line 2', 'line two').replace('line 18', 'line eighteen');
    const { hunks } = diffText(before, after, { context: 2 });
    expect(hunks.map((hunk) => hunk.header)).toEqual(['@@ -1,4 +1,4 @@', '@@ -16,5 +16,5 @@']);
  });

  it('reports no hunks for the same text, and counts pure insertions', () => {
    expect(diffText('a\nb', 'a\nb').hunks).toEqual([]);
    const { hunks } = diffText('', 'one');
    expect(hunks[0]!.header).toBe('@@ -0,0 +1 @@');
  });

  it('pairs deletions with additions for the split view', () => {
    const rows = splitRows(diffText(OLD, NEW).hunks[0]!.lines);
    expect(rows.map((row) => [row.old.type, row.new.type])).toEqual([
      ['ctx', 'ctx'],
      ['ctx', 'ctx'],
      ['del', 'add'],
      ['empty', 'add'],
      ['ctx', 'ctx'],
      ['del', 'add'],
      ['ctx', 'ctx'],
    ]);
    expect(rows[3]!.old.number).toBeNull();
    expect(rows[3]!.new.number).toBe(4);
  });

  it('matches the common suffix before the table, as DiffBuilder does', () => {
    const [hunk] = diffText('x\nb', 'b\ny\nb').hunks;
    expect(hunk!.header).toBe('@@ -1,2 +1,3 @@');
    expect(hunk!.lines.map((line) => [line.type, line.oldNumber, line.newNumber])).toEqual([
      ['del', 1, null],
      ['add', null, 1],
      ['add', null, 2],
      ['ctx', 2, 3],
    ]);
  });

  it('deletes all, then adds all, when the change is too big for the table', () => {
    // 1001 × 1001 changed lines is past DIFF_MAX_CELLS; the shared line in
    // the middle isn't matched, but the common head and tail still are.
    const side = (name: string) =>
      [
        'head',
        ...Array.from({ length: 500 }, (_, i) => `${name} ${i}`),
        'shared',
        ...Array.from({ length: 500 }, (_, i) => `${name} ${i + 500}`),
        'tail',
      ].join('\n');
    expect(1001 * 1001).toBeGreaterThan(DIFF_MAX_CELLS);
    const result = diffText(side('old'), side('new'));
    expect(result.additions).toBe(1001);
    expect(result.deletions).toBe(1001);
    expect(result.hunks).toHaveLength(1);
    const [hunk] = result.hunks;
    expect(hunk!.header).toBe('@@ -1,1003 +1,1003 @@');
    const types = hunk!.lines.map((line) => line.type);
    expect(types[0]).toBe('ctx');
    expect(types.slice(1, 1002).every((type) => type === 'del')).toBe(true);
    expect(types.slice(1002, 2003).every((type) => type === 'add')).toBe(true);
    expect(types[2003]).toBe('ctx');
    expect(hunk!.lines[1002]).toMatchObject({ oldNumber: null, newNumber: 2 });
    expect(hunk!.lines[2003]).toMatchObject({ oldNumber: 1003, newNumber: 1003 });
  });

  it('fills the counts label', () => {
    expect(diffCountsLabel('{additions} additions, {deletions} deletions', 3, 2)).toBe(
      '3 additions, 2 deletions',
    );
  });
});
