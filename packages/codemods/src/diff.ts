/** A small unified diff, for `--dry-run`. */

interface Op {
  type: ' ' | '-' | '+';
  line: string;
}

/**
 * The most cells the comparison table may hold. Past it, the changed region
 * is shown as one block removed and one added, so a huge file can't exhaust
 * memory.
 */
const MAX_CELLS = 4_000_000;

function operations(before: string[], after: string[]): Op[] {
  // Trim what both sides share, so the table only covers what changed.
  let head = 0;
  while (head < before.length && head < after.length && before[head] === after[head]) head++;
  let tail = 0;
  while (
    tail < before.length - head &&
    tail < after.length - head &&
    before[before.length - 1 - tail] === after[after.length - 1 - tail]
  ) {
    tail++;
  }
  const a = before.slice(head, before.length - tail);
  const b = after.slice(head, after.length - tail);
  const ops: Op[] = before.slice(0, head).map((line) => ({ type: ' ', line }));

  if (a.length * b.length > MAX_CELLS) {
    for (const line of a) ops.push({ type: '-', line });
    for (const line of b) ops.push({ type: '+', line });
  } else {
    const table: number[][] = Array.from({ length: a.length + 1 }, () =>
      new Array<number>(b.length + 1).fill(0),
    );
    for (let i = a.length - 1; i >= 0; i--) {
      for (let j = b.length - 1; j >= 0; j--) {
        table[i]![j] =
          a[i] === b[j]
            ? table[i + 1]![j + 1]! + 1
            : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
      }
    }
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        ops.push({ type: ' ', line: a[i]! });
        i++;
        j++;
      } else if (table[i + 1]![j]! >= table[i]![j + 1]!) {
        ops.push({ type: '-', line: a[i++]! });
      } else {
        ops.push({ type: '+', line: b[j++]! });
      }
    }
    while (i < a.length) ops.push({ type: '-', line: a[i++]! });
    while (j < b.length) ops.push({ type: '+', line: b[j++]! });
  }

  for (const line of before.slice(before.length - tail)) ops.push({ type: ' ', line });
  return ops;
}

const NO_NEWLINE = '\\ No newline at end of file';

/** A file's lines, without the empty piece a final newline leaves behind. */
function lines(text: string): { lines: string[]; newline: boolean } {
  if (text === '') return { lines: [], newline: true };
  const newline = text.endsWith('\n');
  const parts = text.split('\n');
  if (newline) parts.pop();
  return { lines: parts, newline };
}

/** A unified diff of two versions of a file, with `context` lines around each change. */
export function unifiedDiff(file: string, before: string, after: string, context = 3): string {
  if (before === after) return '';
  const old = lines(before);
  const now = lines(after);
  // A final line that only one side ends with a newline is a changed line.
  const mark = (side: typeof old, other: typeof old) =>
    side.newline === other.newline
      ? side.lines
      : side.lines.map((line, index) =>
          index === side.lines.length - 1 ? `${line}${side.newline ? '\n' : ''}` : line,
        );
  const ops = operations(mark(old, now), mark(now, old));
  const out = [`--- a/${file}`, `+++ b/${file}`];
  let index = 0;
  let oldLine = 1;
  let newLine = 1;
  let oldSeen = 0;
  let newSeen = 0;

  while (index < ops.length) {
    if (ops[index]!.type === ' ') {
      index++;
      oldLine++;
      newLine++;
      oldSeen++;
      newSeen++;
      continue;
    }
    const start = Math.max(0, index - context);
    let end = index;
    let quiet = 0;
    // A hunk runs until `context * 2` unchanged lines separate it from the next change.
    for (let k = index; k < ops.length; k++) {
      if (ops[k]!.type === ' ') {
        if (++quiet > context * 2) break;
      } else {
        quiet = 0;
        end = k;
      }
    }
    end = Math.min(ops.length - 1, end + context);
    const hunk = ops.slice(start, end + 1);
    const back = index - start;
    const removed = hunk.filter((op) => op.type !== '+').length;
    const added = hunk.filter((op) => op.type !== '-').length;
    // An empty side starts at line 0, as `diff -u` writes it.
    const from = (line: number, count: number) => (count === 0 ? line - 1 : line);
    out.push(
      `@@ -${from(oldLine - back, removed)},${removed} +${from(newLine - back, added)},${added} @@`,
    );
    oldSeen -= back;
    newSeen -= back;
    for (const op of hunk) {
      out.push(`${op.type}${op.line.replace(/\n$/, '')}`);
      if (op.type !== '+') oldSeen++;
      if (op.type !== '-') newSeen++;
      const lastOld = op.type !== '+' && oldSeen === old.lines.length && !old.newline;
      const lastNew = op.type !== '-' && newSeen === now.lines.length && !now.newline;
      if (lastOld || lastNew) out.push(NO_NEWLINE);
    }
    for (const op of ops.slice(index, end + 1)) {
      if (op.type !== '+') oldLine++;
      if (op.type !== '-') newLine++;
    }
    index = end + 1;
  }
  return `${out.join('\n')}\n`;
}
