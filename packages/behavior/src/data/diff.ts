/**
 * The Diff component's line and word diff (#61), shared by React and Vue so
 * both emit the same rows. Livewire UI Components ports it to PHP
 * (`DiffBuilder`) with the same tie-breaking; keep the two in step.
 *
 * Lines are compared by a longest common subsequence, after the common
 * prefix and suffix: within a change, deletions come before additions. A
 * change too big for the table (`DIFF_MAX_CELLS`) deletes every old line,
 * then adds every new one. Hunks keep `context` unchanged lines
 * around each change. With word-level marks, the n-th deleted line of a
 * change pairs with its n-th added line, and their differing words are
 * marked, unless the two lines share nothing.
 */

/** A row's kind: unchanged context, an addition or a deletion. */
export type DiffLineType = 'ctx' | 'add' | 'del';

/** A run of text in a line; `changed` runs render as `<ins>` or `<del>`. */
export interface DiffSegment {
  text: string;
  changed: boolean;
}

/** One line of a unified diff. */
export interface DiffLine {
  type: DiffLineType;
  oldNumber: number | null;
  newNumber: number | null;
  segments: DiffSegment[];
}

/** A hunk: its `@@ -a,b +c,d @@` header and lines. */
export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

/** The diff of two texts. */
export interface DiffResult {
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
}

/** One side of a split row; `empty` fills the side a line doesn't have. */
export interface DiffSide {
  type: DiffLineType | 'empty';
  number: number | null;
  segments: DiffSegment[];
}

/** A split-view row: the old side and the new side. */
export interface DiffSplitRow {
  old: DiffSide;
  new: DiffSide;
}

/** Options for {@link diffText}. */
export interface DiffOptions {
  /** Unchanged lines kept around each change. @defaultValue 3 */
  context?: number;
  /** Mark the changed words in paired lines. @defaultValue true */
  wordLevel?: boolean;
}

/** The default label for the change counts. */
export const DIFF_COUNTS_LABEL = '{additions} additions, {deletions} deletions';
/** The default text when the two versions are the same. */
export const DIFF_EMPTY_LABEL = 'No changes';

const TOKEN = /[\p{L}\p{N}_]+|\s+|[^\p{L}\p{N}_\s]/gu;

/** The text's lines, with `\r\n` normalized and no empty line after a final newline. */
export function diffLinesOf(text: string | null | undefined): string[] {
  const normalized = (text ?? '').replace(/\r\n?/g, '\n');
  if (normalized === '') return [];
  const lines = normalized.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

type Op = { type: DiffLineType; a: number; b: number };

/**
 * The most cells the longest-common-subsequence table may have, after the
 * common prefix and suffix are taken off. A bigger change is shown as every
 * old line deleted, then every new line added. Keep it equal to
 * `DiffBuilder::MAX_CELLS` in PHP.
 */
export const DIFF_MAX_CELLS = 1_000_000;

/**
 * The edit script turning `a` into `b`, by longest common subsequence. The
 * common prefix and suffix are matched first, so the table only spans the
 * part that changed.
 */
function editScript<T>(a: readonly T[], b: readonly T[]): Op[] {
  let prefix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix++;
  let suffix = 0;
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  )
    suffix++;

  const ops: Op[] = [];
  for (let k = 0; k < prefix; k++) ops.push({ type: 'ctx', a: k, b: k });

  const n = a.length - prefix - suffix;
  const m = b.length - prefix - suffix;
  if (n * m > DIFF_MAX_CELLS) {
    for (let k = 0; k < n; k++) ops.push({ type: 'del', a: prefix + k, b: prefix });
    for (let k = 0; k < m; k++) ops.push({ type: 'add', a: prefix + n, b: prefix + k });
  } else {
    const table: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        table[i]![j] =
          a[prefix + i] === b[prefix + j]
            ? table[i + 1]![j + 1]! + 1
            : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
      }
    }
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[prefix + i] === b[prefix + j]) {
        ops.push({ type: 'ctx', a: prefix + i++, b: prefix + j++ });
      } else if (j >= m || (i < n && table[i + 1]![j]! >= table[i]![j + 1]!)) {
        ops.push({ type: 'del', a: prefix + i++, b: prefix + j });
      } else {
        ops.push({ type: 'add', a: prefix + i, b: prefix + j++ });
      }
    }
  }

  for (let k = suffix; k > 0; k--) {
    ops.push({ type: 'ctx', a: a.length - k, b: b.length - k });
  }
  return ops;
}

/** The words, spaces and punctuation of a line. */
export function diffTokens(line: string): string[] {
  return line.match(TOKEN) ?? [];
}

/** The two lines as segments, marking the tokens that differ. */
export function wordDiff(
  oldLine: string,
  newLine: string,
): { old: DiffSegment[]; new: DiffSegment[] } | null {
  const a = diffTokens(oldLine);
  const b = diffTokens(newLine);
  const ops = editScript(a, b);
  if (!ops.some((op) => op.type === 'ctx')) return null;
  const build = (side: 'old' | 'new'): DiffSegment[] => {
    const segments: DiffSegment[] = [];
    for (const op of ops) {
      if (side === 'old' ? op.type === 'add' : op.type === 'del') continue;
      const text = side === 'old' ? a[op.a]! : b[op.b]!;
      const changed = op.type !== 'ctx';
      const last = segments[segments.length - 1];
      if (last && last.changed === changed) last.text += text;
      else segments.push({ text, changed });
    }
    return segments;
  };
  return { old: build('old'), new: build('new') };
}

const range = (start: number, count: number): string =>
  count === 1 ? String(start) : `${start},${count}`;

/** The unified diff of two texts, as hunks of lines. */
export function diffText(
  oldText: string | null | undefined,
  newText: string | null | undefined,
  options: DiffOptions = {},
): DiffResult {
  const context = Math.max(0, Math.floor(options.context ?? 3));
  const wordLevel = options.wordLevel ?? true;
  const a = diffLinesOf(oldText);
  const b = diffLinesOf(newText);
  const ops = editScript(a, b);

  const lines: DiffLine[] = ops.map((op) => ({
    type: op.type,
    oldNumber: op.type === 'add' ? null : op.a + 1,
    newNumber: op.type === 'del' ? null : op.b + 1,
    segments: [{ text: op.type === 'add' ? b[op.b]! : a[op.a]!, changed: false }],
  }));

  if (wordLevel) {
    let index = 0;
    while (index < lines.length) {
      if (lines[index]!.type !== 'del') {
        index++;
        continue;
      }
      const delStart = index;
      while (index < lines.length && lines[index]!.type === 'del') index++;
      const addStart = index;
      while (index < lines.length && lines[index]!.type === 'add') index++;
      const pairs = Math.min(addStart - delStart, index - addStart);
      for (let k = 0; k < pairs; k++) {
        const removed = lines[delStart + k]!;
        const added = lines[addStart + k]!;
        const words = wordDiff(removed.segments[0]!.text, added.segments[0]!.text);
        if (words) {
          removed.segments = words.old;
          added.segments = words.new;
        }
      }
    }
  }

  const changes = lines.flatMap((line, index) => (line.type === 'ctx' ? [] : [index]));
  const ranges: [number, number][] = [];
  for (const index of changes) {
    const start = Math.max(0, index - context);
    const end = Math.min(lines.length - 1, index + context);
    const previous = ranges[ranges.length - 1];
    if (previous && start <= previous[1] + 1) previous[1] = Math.max(previous[1], end);
    else ranges.push([start, end]);
  }

  const hunks = ranges.map(([start, end]) => {
    const slice = lines.slice(start, end + 1);
    const oldBefore = lines.slice(0, start).filter((line) => line.type !== 'add').length;
    const newBefore = lines.slice(0, start).filter((line) => line.type !== 'del').length;
    const oldCount = slice.filter((line) => line.type !== 'add').length;
    const newCount = slice.filter((line) => line.type !== 'del').length;
    const oldStart = oldCount === 0 ? oldBefore : oldBefore + 1;
    const newStart = newCount === 0 ? newBefore : newBefore + 1;
    return {
      header: `@@ -${range(oldStart, oldCount)} +${range(newStart, newCount)} @@`,
      lines: slice,
    };
  });

  return {
    hunks,
    additions: lines.filter((line) => line.type === 'add').length,
    deletions: lines.filter((line) => line.type === 'del').length,
  };
}

const EMPTY_SIDE: DiffSide = { type: 'empty', number: null, segments: [] };

/** A hunk's lines as split-view rows: changes pair deletions with additions. */
export function splitRows(lines: readonly DiffLine[]): DiffSplitRow[] {
  const rows: DiffSplitRow[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]!;
    if (line.type === 'ctx') {
      rows.push({
        old: { type: 'ctx', number: line.oldNumber, segments: line.segments },
        new: { type: 'ctx', number: line.newNumber, segments: line.segments },
      });
      index++;
      continue;
    }
    const removed: DiffLine[] = [];
    const added: DiffLine[] = [];
    while (index < lines.length && lines[index]!.type === 'del') removed.push(lines[index++]!);
    while (index < lines.length && lines[index]!.type === 'add') added.push(lines[index++]!);
    for (let k = 0; k < Math.max(removed.length, added.length); k++) {
      const oldLine = removed[k];
      const newLine = added[k];
      rows.push({
        old: oldLine
          ? { type: 'del', number: oldLine.oldNumber, segments: oldLine.segments }
          : EMPTY_SIDE,
        new: newLine
          ? { type: 'add', number: newLine.newNumber, segments: newLine.segments }
          : EMPTY_SIDE,
      });
    }
  }
  return rows;
}

/** The counts label with `{additions}` and `{deletions}` filled in. */
export function diffCountsLabel(template: string, additions: number, deletions: number): string {
  return template
    .replace(/\{additions\}/g, String(additions))
    .replace(/\{deletions\}/g, String(deletions));
}
