/** A small unified diff, for `--dry-run`. */

interface Op {
  type: ' ' | '-' | '+';
  line: string;
}

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

  const table: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i]![j] =
        a[i] === b[j] ? table[i + 1]![j + 1]! + 1 : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
    }
  }

  const ops: Op[] = before.slice(0, head).map((line) => ({ type: ' ', line }));
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
  for (const line of before.slice(before.length - tail)) ops.push({ type: ' ', line });
  return ops;
}

/** A unified diff of two versions of a file, with `context` lines around each change. */
export function unifiedDiff(file: string, before: string, after: string, context = 3): string {
  if (before === after) return '';
  const ops = operations(before.split('\n'), after.split('\n'));
  const out = [`--- a/${file}`, `+++ b/${file}`];
  let index = 0;
  let oldLine = 1;
  let newLine = 1;

  while (index < ops.length) {
    if (ops[index]!.type === ' ') {
      index++;
      oldLine++;
      newLine++;
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
    out.push(`@@ -${oldLine - back},${removed} +${newLine - back},${added} @@`);
    for (const op of hunk) out.push(`${op.type}${op.line}`);
    for (const op of ops.slice(index, end + 1)) {
      if (op.type !== '+') oldLine++;
      if (op.type !== '-') newLine++;
    }
    index = end + 1;
  }
  return `${out.join('\n')}\n`;
}
