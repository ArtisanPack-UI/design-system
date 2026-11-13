/**
 * apui-codemod: migrates a React or Vue app to the next major of ArtisanPack UI.
 *
 *   apui-codemod react [paths...]   Migrate @artisanpack-ui/react usage.
 *   apui-codemod vue [paths...]     Migrate @artisanpack-ui/vue usage.
 *
 * Paths default to `src`. See USAGE for the options.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { run } from './run';
import type { CodemodStack, FileResult } from './run';
import type { FindingKind } from './types';

const USAGE = `Usage: apui-codemod <react|vue> [paths...] [options]

Migrates an app to the next major of @artisanpack-ui/react or @artisanpack-ui/vue.
Paths are files or directories and default to "src".

Options:
  --dry-run      Show the changes as a diff without writing any file.
  --no-classes   Don't report raw DaisyUI classes and theme references.
  --global       Vue: also migrate tags of globally registered components.
  --json         Print the report as JSON.
  --help         Show this message.`;

const LABELS: Record<FindingKind, string> = {
  rewrote: 'rewrote',
  review: 'review',
  removed: 'removed',
  manual: 'manual',
  class: 'class',
};

function summary(files: FileResult[], scanned: number, dryRun: boolean): string {
  const count = (kind: FindingKind) =>
    files.reduce((sum, file) => sum + file.findings.filter((f) => f.kind === kind).length, 0);
  const changed = files.filter((file) => file.changed).length;
  const lines = [
    `${scanned} file${scanned === 1 ? '' : 's'} scanned, ${changed} ${dryRun ? 'would change' : 'changed'}.`,
    `  ${count('rewrote') + count('review')} rewrites (${count('review')} to review), ${count('removed')} attributes removed`,
    `  ${count('manual')} to migrate by hand`,
    `  ${count('class')} DaisyUI classes and theme references`,
  ];
  return lines.join('\n');
}

export function main(argv: string[]): number {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')));
  const [stack, ...paths] = argv.filter((arg) => !arg.startsWith('--'));
  const known = ['--dry-run', '--no-classes', '--global', '--json', '--help'];
  const unknown = [...flags].filter((flag) => !known.includes(flag));

  if (flags.has('--help')) {
    console.log(USAGE);
    return 0;
  }
  if ((stack !== 'react' && stack !== 'vue') || unknown.length) {
    if (unknown.length) console.error(`Unknown option: ${unknown.join(', ')}`);
    console.error(USAGE);
    return 2;
  }

  const targets = paths.length ? paths : ['src'];
  const missing = targets.filter((path) => !existsSync(join(process.cwd(), path)));
  if (missing.length) {
    console.error(`No such file or directory: ${missing.join(', ')}`);
    return 2;
  }

  const dryRun = flags.has('--dry-run');
  const result = run({
    stack: stack as CodemodStack,
    paths: targets,
    dryRun,
    classes: !flags.has('--no-classes'),
    global: flags.has('--global'),
  });

  if (flags.has('--json')) {
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  for (const file of result.files) {
    if (dryRun && file.diff) console.log(file.diff);
  }
  for (const file of result.files) {
    // Plain rewrites show in the diff; the report lists what needs a person.
    const notable = file.findings.filter((finding) => finding.kind !== 'rewrote');
    if (!notable.length) continue;
    console.log(file.file);
    for (const finding of notable) {
      console.log(
        `  ${finding.line}:${finding.column}  ${LABELS[finding.kind].padEnd(8)}${finding.message}`,
      );
    }
    console.log('');
  }
  console.log(summary(result.files, result.scanned, dryRun));
  return 0;
}

process.exitCode = main(process.argv.slice(2));
