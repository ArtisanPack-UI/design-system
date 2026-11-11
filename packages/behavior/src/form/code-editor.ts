/**
 * The CodeEditor's shared pieces (#53): indentation with Tab, the
 * Escape-then-Tab way out, the caret's line and column, line counts, and
 * the built-in strings. The editor is a native textarea (D-018), so these
 * work on it directly in every stack.
 */
import { definedLabels } from './labels';

/** A problem reported against a line. */
export interface CodeDiagnostic {
  /** The 1-based line. */
  line: number;
  /** The 1-based column, when known. */
  column?: number;
  message: string;
  severity?: 'error' | 'warning' | 'info';
}

/** A file tab. */
export interface CodeEditorTab {
  value: string;
  label: string;
}

/** A language option. */
export interface CodeEditorLanguage {
  value: string;
  label: string;
}

/** The built-in strings. Livewire passes them through `__()`; React and Vue take `translations`. */
export const CODE_EDITOR_TRANSLATIONS = {
  tabs: 'Open files',
  language: 'Language',
  position: 'Ln :line, Col :column',
  spaces: 'Spaces: :count',
  error: ':count error',
  errors: ':count errors',
  warning: ':count warning',
  warnings: ':count warnings',
  problems: 'Problems',
  line: 'Line :line',
  severityError: 'Error',
  severityWarning: 'Warning',
  severityInfo: 'Info',
  instructions: 'Tab inserts indentation. To leave the editor, press Escape, then Tab.',
};

/** The CodeEditor's strings. */
export type CodeEditorTranslations = typeof CODE_EDITOR_TRANSLATIONS;

/** The built-in strings with the caller's overrides. */
export function codeEditorTranslations(
  overrides: Partial<CodeEditorTranslations> | null | undefined,
): CodeEditorTranslations {
  return { ...CODE_EDITOR_TRANSLATIONS, ...definedLabels(overrides) };
}

/** Lists options given as strings or `{ value, label }`. */
export function normalizeOptions(
  options: readonly (string | { value: string; label?: string })[] | null | undefined,
): { value: string; label: string }[] {
  return (options ?? []).map((option) =>
    typeof option === 'string'
      ? { value: option, label: option }
      : { value: option.value, label: option.label ?? option.value },
  );
}

/** The number of lines in a value (at least one). */
export function lineCount(value: string | null | undefined): number {
  return (value ?? '').split('\n').length;
}

/** The number of gutter lines: the value's lines, but never fewer than `rows`. */
export function gutterLines(value: string | null | undefined, rows: number): number {
  return Math.max(lineCount(value), Math.max(1, Math.floor(rows) || 1));
}

/** The 1-based line and column of an offset in a value. */
export function caretPosition(value: string, offset: number): { line: number; column: number } {
  const before = value.slice(0, Math.max(0, offset));
  const lines = before.split('\n');
  return { line: lines.length, column: Array.from(lines[lines.length - 1]!).length + 1 };
}

/** Diagnostics by line, the most severe first: what the gutter marks. */
export function severityByLine(
  diagnostics: readonly CodeDiagnostic[] | null | undefined,
): Map<number, 'error' | 'warning' | 'info'> {
  const rank = { error: 3, warning: 2, info: 1 } as const;
  const lines = new Map<number, 'error' | 'warning' | 'info'>();
  for (const diagnostic of diagnostics ?? []) {
    const severity = diagnostic.severity ?? 'error';
    const current = lines.get(diagnostic.line);
    if (!current || rank[severity] > rank[current]) lines.set(diagnostic.line, severity);
  }
  return lines;
}

/** The status bar's problem count, e.g. "1 error · 2 warnings", or `''` with none. */
export function problemsLabel(
  diagnostics: readonly CodeDiagnostic[] | null | undefined,
  translations: CodeEditorTranslations,
): string {
  const fill = (text: string, count: number) => text.split(':count').join(String(count));
  const errors = (diagnostics ?? []).filter((d) => (d.severity ?? 'error') === 'error').length;
  const warnings = (diagnostics ?? []).filter((d) => d.severity === 'warning').length;
  const parts: string[] = [];
  if (errors) parts.push(fill(errors === 1 ? translations.error : translations.errors, errors));
  if (warnings) {
    parts.push(fill(warnings === 1 ? translations.warning : translations.warnings, warnings));
  }
  return parts.join(' · ');
}

/** The caret's position as the status bar shows it. */
export function positionLabel(
  value: string,
  offset: number,
  translations: CodeEditorTranslations,
): string {
  const { line, column } = caretPosition(value, offset);
  return translations.position
    .split(':line')
    .join(String(line))
    .split(':column')
    .join(String(column));
}

/**
 * Replaces a textarea's selection through the editing commands, so the
 * browser's undo stack keeps it and an `input` event fires (which is what
 * `wire:model`, `v-model` and `onChange` listen to).
 */
function replaceSelection(textarea: HTMLTextAreaElement, text: string): void {
  const doc = textarea.ownerDocument;
  let done: boolean;
  try {
    done = doc.execCommand('insertText', false, text);
  } catch {
    done = false;
  }
  if (!done) {
    textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/** Whether Tab moves focus out on its next press, per textarea. */
const leaving = new WeakSet<HTMLTextAreaElement>();

/**
 * Tab and Shift+Tab indent and outdent, a line or every selected line, by
 * `tabSize` spaces. Escape arms the way out: the next Tab moves focus as
 * usual. Returns whether the key was handled.
 */
export function codeEditorKeydown(
  event: KeyboardEvent,
  textarea: HTMLTextAreaElement,
  tabSize = 2,
): boolean {
  if (event.key === 'Escape') {
    leaving.add(textarea);
    return false;
  }
  if (event.key !== 'Tab' || event.ctrlKey || event.metaKey || event.altKey) {
    leaving.delete(textarea);
    return false;
  }
  if (leaving.has(textarea) || textarea.readOnly || textarea.disabled) {
    leaving.delete(textarea);
    return false;
  }
  event.preventDefault();
  const indent = ' '.repeat(Math.max(1, tabSize));
  const { value, selectionStart: start, selectionEnd: end } = textarea;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const multiline = value.slice(start, end).includes('\n');
  if (!event.shiftKey && !multiline) {
    replaceSelection(textarea, indent);
    return true;
  }
  // Indent or outdent every line the selection touches.
  const blockEnd = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const lineEnd = value.indexOf('\n', blockEnd);
  const blockStop = lineEnd === -1 ? value.length : lineEnd;
  const lines = value.slice(lineStart, blockStop).split('\n');
  const changed = lines.map((line) => {
    if (!event.shiftKey) return indent + line;
    const spaces = /^ */.exec(line)![0].length;
    return line.slice(Math.min(spaces, indent.length));
  });
  const replacement = changed.join('\n');
  if (replacement === lines.join('\n')) return true;
  textarea.setSelectionRange(lineStart, blockStop);
  replaceSelection(textarea, replacement);
  const firstDelta = changed[0]!.length - lines[0]!.length;
  textarea.setSelectionRange(
    Math.max(lineStart, start + firstDelta),
    lineStart + replacement.length,
  );
  return true;
}
