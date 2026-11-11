/**
 * The gate runner (#39, #40): renders every fixture sheet in every stack,
 * runs axe and the manifest's accessibility checks, and diffs each screenshot
 * against the baseline and against the other stacks.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import {
  type ComponentManifest,
  loadManifest,
  shipsIn,
  type Stack,
} from '@artisanpack-ui/manifest';
import { build, type Plugin } from 'esbuild';
import { type Browser, chromium, type Page } from 'playwright';

import { checkManifestA11y } from './a11y';
import { type AxeViolation, runAxe } from './axe';
import { openSheet, screenshotSheet, type SheetSource } from './capture';
import { compareImages } from './diff';
import { fixtureSheets } from './fixtures';
import type { FixtureSheet } from './types';

export interface StackConfig {
  /** React and Vue: the fixture entry that calls `registerReactHost` or `registerVueHost`. */
  host?: string;
  /** Livewire: the directory the Blade host wrote `<Component>/<sheet>.html` into. */
  html?: string;
  /** Extra stylesheets for this stack. */
  css?: string[];
  /** Classic scripts loaded before the cases, such as the Alpine adapter. */
  scripts?: string[];
}

export interface GatesConfig {
  /** Component names, such as `Button`. */
  components: string[];
  /** A manifests directory other than `@artisanpack-ui/manifest`'s. */
  manifests?: string;
  /** Stylesheets for every stack, such as `@artisanpack-ui/css`'s `dist/index.css`. */
  css: string[];
  stacks: Partial<Record<Stack, StackConfig>>;
  /** Where `<Component>/<sheet>.png` baselines live. */
  baselines: string;
  /** Where screenshots, diffs and the report go. */
  out: string;
  /** Per-pixel tolerance, 0 to 1. Default 0.02 (`DEFAULT_THRESHOLD`). */
  threshold?: number;
  /** Share of pixels allowed to differ. Default 0. */
  maxDiffRatio?: number;
  /** Run axe. Default true. */
  axe?: boolean;
}

export interface RunOptions {
  /** Write missing or changed baselines instead of failing. */
  update?: boolean;
  /** Log progress. */
  log?: (line: string) => void;
}

export type BaselineStatus = 'match' | 'diff' | 'missing' | 'updated';

export interface SheetResult {
  component: string;
  stack: Stack;
  sheet: string;
  screenshot: string;
  baseline: BaselineStatus;
  diffPixels: number;
  diff?: string;
  axe: AxeViolation[];
  a11y: string[];
  errors: string[];
}

export interface CrossStackResult {
  component: string;
  sheet: string;
  stacks: [Stack, Stack];
  match: boolean;
  diffPixels: number;
  diff?: string;
}

export interface GatesReport {
  ok: boolean;
  sheets: SheetResult[];
  cross: CrossStackResult[];
  /** Components or stacks that couldn't run, such as a missing host. */
  problems: string[];
}

const STACK_ORDER: Stack[] = ['livewire', 'react', 'vue'];

/** Reads a config file; its relative paths resolve against the file's directory. */
export function readConfig(file: string): GatesConfig {
  const config = JSON.parse(readFileSync(file, 'utf8')) as GatesConfig;
  return resolveConfig(config, dirname(resolve(file)));
}

/** Resolves a config's relative paths against `base`. */
export function resolveConfig(config: GatesConfig, base: string): GatesConfig {
  const at = (path: string) => (isAbsolute(path) ? path : resolve(base, path));
  const stacks: GatesConfig['stacks'] = {};
  for (const [stack, entry] of Object.entries(config.stacks) as [Stack, StackConfig][]) {
    stacks[stack] = {
      ...entry,
      ...(entry.host ? { host: at(entry.host) } : {}),
      ...(entry.html ? { html: at(entry.html) } : {}),
      css: (entry.css ?? []).map(at),
      scripts: (entry.scripts ?? []).map(at),
    };
  }
  return {
    ...config,
    ...(config.manifests ? { manifests: at(config.manifests) } : {}),
    css: config.css.map(at),
    stacks,
    baselines: at(config.baselines),
    out: at(config.out),
  };
}

/**
 * Chromium flags that make a render repeatable: software raster in one pass,
 * sRGB, and grayscale text. Without them, Linux renders of the same page
 * differ by a few anti-aliased pixels from run to run (the corners of a
 * focus ring at a subpixel offset), which a zero-tolerance gate reads as a
 * regression.
 */
export const RENDER_ARGS = Object.freeze([
  '--disable-gpu',
  '--disable-gpu-rasterization',
  '--disable-partial-raster',
  '--disable-skia-runtime-opts',
  '--disable-lcd-text',
  '--force-color-profile=srgb',
  '--font-render-hinting=none',
]);

/** Framework packages a host and its components must share one copy of. */
const FRAMEWORK = /^(react|react-dom|vue)(\/.*)?$/;

/**
 * Resolves React, ReactDOM and Vue from the host entry's directory, wherever
 * they're imported from. Without it, a linked `@artisanpack-ui/testing`
 * (`file:` or a workspace symlink) bundles its own copy next to the
 * component repo's, and hooks fail with "Cannot read properties of null".
 */
function frameworkFromEntry(entry: string): Plugin {
  return {
    name: 'apui-framework-from-entry',
    setup(pluginBuild) {
      pluginBuild.onResolve({ filter: FRAMEWORK }, async (args) => {
        if (args.pluginData === 'apui-framework') return undefined;
        const resolved = await pluginBuild.resolve(args.path, {
          kind: args.kind,
          resolveDir: dirname(resolve(entry)),
          pluginData: 'apui-framework',
        });
        return resolved.errors.length ? undefined : { path: resolved.path };
      });
    },
  };
}

/** Bundles a React or Vue fixture entry into one classic script. */
export async function bundleHost(entry: string): Promise<string> {
  const result = await build({
    entryPoints: [entry],
    plugins: [frameworkFromEntry(entry)],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    jsx: 'automatic',
    write: false,
    logLevel: 'silent',
    define: {
      'process.env.NODE_ENV': '"production"',
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  });
  return result.outputFiles[0]!.text;
}

const write = (file: string, data: Buffer | string) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
};

/** Runs the gates. Never throws for a failing gate: read `report.ok`. */
export async function runGates(
  config: GatesConfig,
  options: RunOptions = {},
): Promise<GatesReport> {
  const log = options.log ?? (() => {});
  const report: GatesReport = { ok: true, sheets: [], cross: [], problems: [] };
  const sharedCss = config.css.map((file) => readFileSync(file, 'utf8'));
  const hosts = new Map<Stack, string>();
  // A misspelled stack or an empty component list must fail, never pass by rendering nothing.
  for (const key of Object.keys(config.stacks)) {
    if (!(STACK_ORDER as string[]).includes(key)) {
      report.problems.push(`stacks: "${key}" is not a stack (${STACK_ORDER.join(', ')})`);
    }
  }
  if (!config.components.length) report.problems.push('components: list at least one component');
  const browser: Browser = await chromium.launch({ args: [...RENDER_ARGS] });

  try {
    for (const name of config.components) {
      let manifest: ComponentManifest;
      try {
        manifest = loadManifest(name, config.manifests);
      } catch (error) {
        report.problems.push((error as Error).message);
        continue;
      }
      const sheets = fixtureSheets(manifest);
      const shots = new Map<string, Map<Stack, Buffer>>();

      for (const stack of STACK_ORDER) {
        const stackConfig = config.stacks[stack];
        if (!stackConfig || !shipsIn(manifest, stack)) continue;
        const css = [...sharedCss, ...(stackConfig.css ?? []).map((f) => readFileSync(f, 'utf8'))];
        const scripts = (stackConfig.scripts ?? []).map((f) => readFileSync(f, 'utf8'));

        for (const sheet of sheets) {
          // One sheet that fails to bundle, render or check is a problem, not a crash:
          // the run goes on and still writes its report.
          let page: Page | undefined;
          try {
            const source = await sheetSource(stack, stackConfig, manifest, sheet, hosts);
            if (typeof source === 'string') {
              report.problems.push(source);
              continue;
            }
            log(`${manifest.name} ${stack} ${sheet.id}`);
            const opened = await openSheet(browser, {
              sheet,
              source,
              css,
              scripts,
              rootClass: manifest.rootClass,
            });
            page = opened.page;
            const axe = config.axe === false ? [] : await runAxe(page);
            const a11y = await checkManifestA11y(page, manifest);
            const png = await screenshotSheet(page);

            const screenshot = join(config.out, stack, manifest.name, `${sheet.id}.png`);
            write(screenshot, png);
            const result: SheetResult = {
              component: manifest.name,
              stack,
              sheet: sheet.id,
              screenshot,
              baseline: 'match',
              diffPixels: 0,
              axe,
              a11y,
              errors: opened.errors,
            };
            compareBaseline(result, png, config, options);
            report.sheets.push(result);
            if (!shots.has(sheet.id)) shots.set(sheet.id, new Map());
            shots.get(sheet.id)!.set(stack, png);
          } catch (error) {
            report.problems.push(
              `${manifest.name} ${stack} ${sheet.id}: ${(error as Error).message.split('\n')[0]}`,
            );
          } finally {
            await page?.close();
          }
        }
      }

      if (!shots.size) {
        report.problems.push(
          `${manifest.name}: nothing rendered. Configure a stack it ships in (${STACK_ORDER.filter((stack) => shipsIn(manifest, stack)).join(', ')}).`,
        );
      }

      for (const [sheet, byStack] of shots) {
        const stacks = [...byStack.keys()];
        for (let i = 0; i < stacks.length; i++) {
          for (let j = i + 1; j < stacks.length; j++) {
            const [a, b] = [stacks[i]!, stacks[j]!];
            const diff = compareImages(byStack.get(a)!, byStack.get(b)!, {
              threshold: config.threshold,
              maxDiffRatio: config.maxDiffRatio,
            });
            const result: CrossStackResult = {
              component: manifest.name,
              sheet,
              stacks: [a, b],
              match: diff.match,
              diffPixels: diff.diffPixels,
            };
            if (!diff.match) {
              result.diff = join(config.out, 'diff', manifest.name, `${sheet}.${a}-vs-${b}.png`);
              write(result.diff, diff.diff);
            }
            report.cross.push(result);
          }
        }
      }
    }
  } finally {
    await browser.close();
  }

  report.ok =
    report.problems.length === 0 &&
    report.cross.every((result) => result.match) &&
    report.sheets.every(
      (sheet) =>
        (sheet.baseline === 'match' || sheet.baseline === 'updated') &&
        sheet.axe.length === 0 &&
        sheet.a11y.length === 0 &&
        sheet.errors.length === 0,
    );
  write(join(config.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  write(join(config.out, 'report.md'), formatReport(report));
  return report;
}

async function sheetSource(
  stack: Stack,
  stackConfig: StackConfig,
  manifest: ComponentManifest,
  sheet: FixtureSheet,
  hosts: Map<Stack, string>,
): Promise<SheetSource | string> {
  if (stack === 'livewire') {
    if (!stackConfig.html) return 'livewire: set "html" to the directory the Blade host wrote';
    const file = join(stackConfig.html, manifest.name, `${sheet.id}.html`);
    if (!existsSync(file)) {
      return `livewire: ${file} is missing. Render the Blade fixtures first (BladeFixtureHost::write).`;
    }
    return { kind: 'html', html: readFileSync(file, 'utf8') };
  }
  if (!stackConfig.host) return `${stack}: set "host" to the fixture entry`;
  if (!hosts.has(stack)) hosts.set(stack, await bundleHost(stackConfig.host));
  const entry = manifest.stacks[stack];
  return { kind: 'host', script: hosts.get(stack)!, component: entry ? entry.name : manifest.name };
}

function compareBaseline(
  result: SheetResult,
  png: Buffer,
  config: GatesConfig,
  options: RunOptions,
): void {
  const file = join(config.baselines, result.component, `${result.sheet}.png`);
  if (!existsSync(file)) {
    if (options.update) {
      write(file, png);
      result.baseline = 'updated';
    } else {
      result.baseline = 'missing';
    }
    return;
  }
  const diff = compareImages(readFileSync(file), png, {
    threshold: config.threshold,
    maxDiffRatio: config.maxDiffRatio,
  });
  result.diffPixels = diff.diffPixels;
  if (diff.match) return;
  if (options.update) {
    write(file, png);
    result.baseline = 'updated';
    return;
  }
  result.baseline = 'diff';
  result.diff = join(
    config.out,
    'diff',
    result.component,
    `${result.sheet}.${result.stack}-vs-baseline.png`,
  );
  write(result.diff, diff.diff);
}

/** The report as Markdown, for a CI job summary. */
export function formatReport(report: GatesReport): string {
  const lines = [`## Quality gates: ${report.ok ? 'passed' : 'failed'}`, ''];
  for (const problem of report.problems) lines.push(`- ⚠️ ${problem}`);
  if (report.problems.length) lines.push('');
  lines.push('| Component | Stack | Sheet | Baseline | axe | Manifest a11y | Page errors |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const s of report.sheets) {
    const baseline = s.baseline === 'diff' ? `diff (${s.diffPixels} px)` : s.baseline;
    lines.push(
      `| ${s.component} | ${s.stack} | ${s.sheet} | ${baseline} | ${s.axe.length ? s.axe.map((v) => v.id).join(', ') : 'clean'} | ${s.a11y.length || 'ok'} | ${s.errors.length || 'none'} |`,
    );
  }
  const failures = report.cross.filter((c) => !c.match);
  lines.push(
    '',
    `Cross-stack: ${report.cross.length - failures.length} of ${report.cross.length} pairs match.`,
  );
  for (const c of failures) {
    lines.push(
      `- ${c.component} ${c.sheet}: ${c.stacks.join(' vs ')} differ by ${c.diffPixels} px`,
    );
  }
  for (const s of report.sheets) {
    for (const v of s.axe) {
      lines.push(
        `- axe ${v.id} (${s.component} ${s.stack} ${s.sheet}): ${v.help} — ${v.nodes.map((n) => n.target).join(', ')}`,
      );
    }
    for (const p of s.a11y)
      lines.push(`- manifest a11y (${s.component} ${s.stack} ${s.sheet}): ${p}`);
    for (const e of s.errors)
      lines.push(`- page error (${s.component} ${s.stack} ${s.sheet}): ${e}`);
  }
  return `${lines.join('\n')}\n`;
}
