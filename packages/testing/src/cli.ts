/**
 * apui-gates: the quality gates CLI.
 *
 *   apui-gates check --config apui-gates.config.json [--update]
 *   apui-gates fixtures [Name ...] [--manifests dir] [--out dir]
 *   apui-gates checklist Name [--manifests dir]
 */
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { loadManifest, loadManifests } from '@artisanpack-ui/manifest';

import { a11yChecklist } from './checklist';
import { componentFixtures } from './fixtures';
import { formatReport, readConfig, runGates } from './run';

const USAGE = `Usage:
  apui-gates check --config <file> [--update]
  apui-gates fixtures [Name ...] [--manifests <dir>] [--out <dir>]
  apui-gates checklist <Name> [--manifests <dir>]`;

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
}

function positional(args: string[]): string[] {
  return args.filter((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'));
}

async function main(argv: string[]): Promise<number> {
  const [command, ...args] = argv;
  const manifests = flag(args, '--manifests');

  if (command === 'check') {
    const config = flag(args, '--config');
    if (!config) {
      console.error(USAGE);
      return 2;
    }
    const report = await runGates(readConfig(config), {
      update: args.includes('--update'),
      log: (line) => console.log(line),
    });
    const markdown = formatReport(report);
    console.log(`\n${markdown}`);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
    return report.ok ? 0 : 1;
  }

  if (command === 'fixtures') {
    const names = positional(args);
    const list = names.length
      ? names.map((name) => loadManifest(name, manifests))
      : loadManifests(manifests);
    const out = resolve(flag(args, '--out') ?? '.');
    mkdirSync(out, { recursive: true });
    for (const manifest of list) {
      writeFileSync(
        join(out, `${manifest.name}.json`),
        `${JSON.stringify(componentFixtures(manifest), null, 2)}\n`,
      );
      console.log(`wrote ${manifest.name}.json`);
    }
    return 0;
  }

  if (command === 'checklist') {
    const [name] = positional(args);
    if (!name) {
      console.error(USAGE);
      return 2;
    }
    console.log(a11yChecklist(loadManifest(name, manifests)));
    return 0;
  }

  console.error(USAGE);
  return 2;
}

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  },
);
