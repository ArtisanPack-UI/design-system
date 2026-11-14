/**
 * Code (#65): the lines a read-only code block renders, the same in every
 * stack. There is no syntax highlighting (the spec has none). Livewire UI
 * Components ports `codeLines` to PHP (`Code::lines()`); keep them in step.
 */

/** The scrollable region's name when there is neither a label nor a file name. */
export const CODE_LABEL = 'Code';

/**
 * The code's lines. Any line ending splits (`\r\n`, `\r`, `\n`); one final
 * line ending doesn't add an empty last line. Tabs and spaces stay as they are.
 */
export function codeLines(code: string | null | undefined): string[] {
  if (code === null || code === undefined || code === '') return [];
  const lines = String(code).split(/\r\n|\r|\n/);
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** The highlighted line numbers (1-based) as a set; anything that isn't a whole number is skipped. */
export function codeHighlights(highlight: readonly unknown[] | null | undefined): Set<number> {
  const lines = new Set<number>();
  for (const value of highlight ?? []) {
    const line = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
    if (typeof line === 'number' && Number.isInteger(line) && line > 0) lines.add(line);
  }
  return lines;
}

/** The scrollable region's accessible name: the label, else the file name, else the language, else "Code". */
export function codeLabel(
  label: string | null | undefined,
  fileName: string | null | undefined,
  language: string | null | undefined,
  fallback: string = CODE_LABEL,
): string {
  for (const value of [label, fileName, language]) {
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return fallback;
}

/**
 * The text a rendered Code block holds, read back from its line parts and
 * joined with `\n`: what its copy button copies when the code isn't at hand
 * (the Alpine component reads the server-rendered lines).
 */
export function codeText(root: ParentNode): string {
  return Array.from(
    root.querySelectorAll('[data-scope="code"][data-part="line"]'),
    (line) => line.textContent ?? '',
  ).join('\n');
}
