/**
 * The runner end to end on the reference Probe: every stack renders the same
 * pixels, axe and the manifest checks pass, and real drift is caught.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { chromium } from 'playwright';

import { checkManifestA11y } from '../src/a11y';
import { runAxe } from '../src/axe';
import { openSheet, screenshotSheet } from '../src/capture';
import { compareImages } from '../src/diff';
import { a11yChecklist } from '../src/checklist';
import { fixtureSheets } from '../src/fixtures';
import { bundleHost, type GatesConfig, readConfig, runGates } from '../src/run';
import { hasBlade, probe, reference } from './helpers';

const css = [join(__dirname, '../../css/dist/index.css'), join(reference, 'probe.css')];
const tmp = () => mkdtempSync(join(tmpdir(), 'apui-gates-'));

function config(out: string, stacks: GatesConfig['stacks']): GatesConfig {
  return {
    components: ['Probe'],
    manifests: join(reference, 'manifests'),
    css,
    stacks,
    baselines: join(out, 'baselines'),
    out,
  };
}

/** Renders the Blade fixtures with the PHP host into `out`. */
function renderBlade(out: string): string {
  const fixtures = join(out, 'fixtures');
  execFileSync('node', [
    join(__dirname, '../bin/apui-gates.mjs'),
    'fixtures',
    'Probe',
    '--manifests',
    join(reference, 'manifests'),
    '--out',
    fixtures,
  ]);
  const html = join(out, 'html');
  execFileSync('php', [join(reference, 'render-blade.php'), fixtures, html]);
  return html;
}

describe('runGates', () => {
  it('renders the same pixels in every stack, with axe and the manifest checks clean', async () => {
    const out = tmp();
    const stacks: GatesConfig['stacks'] = {
      react: { host: join(reference, 'react/host.tsx') },
      vue: { host: join(reference, 'vue/host.ts') },
    };
    if (hasBlade) stacks.livewire = { html: renderBlade(out) };

    const first = await runGates(config(out, stacks), { update: true });
    expect(first.problems).toEqual([]);
    expect(first.ok).toBe(true);
    expect(first.sheets.map((s) => s.baseline)).toContain('updated');
    expect(first.cross.length).toBeGreaterThan(0);
    expect(first.cross.every((c) => c.match)).toBe(true);
    for (const sheet of first.sheets) {
      expect(sheet.axe).toEqual([]);
      expect(sheet.a11y).toEqual([]);
      expect(sheet.errors).toEqual([]);
    }

    const second = await runGates(config(out, stacks));
    expect(second.ok).toBe(true);
    expect(second.sheets.every((s) => s.baseline === 'match')).toBe(true);
    expect(JSON.parse(readFileSync(join(out, 'report.json'), 'utf8')).ok).toBe(true);
    expect(readFileSync(join(out, 'report.md'), 'utf8')).toContain('## Quality gates: passed');
  });

  it('fails on a missing baseline, a baseline diff and a cross-stack diff, and writes the diffs', async () => {
    const out = tmp();
    const broken = join(out, 'broken-host.tsx');
    writeFileSync(
      broken,
      `import { registerReactHost } from ${JSON.stringify(join(__dirname, '../src/hosts/react'))};
import { BrokenProbe } from ${JSON.stringify(join(reference, 'react/Probe'))};
registerReactHost({ Probe: BrokenProbe });`,
    );
    const missing = await runGates(config(out, { react: { host: broken } }));
    expect(missing.ok).toBe(false);
    expect(missing.sheets.every((s) => s.baseline === 'missing')).toBe(true);

    await runGates(config(out, { vue: { host: join(reference, 'vue/host.ts') } }), {
      update: true,
    });
    const report = await runGates(
      config(out, { react: { host: broken }, vue: { host: join(reference, 'vue/host.ts') } }),
    );
    expect(report.ok).toBe(false);
    const react = report.sheets.filter((s) => s.stack === 'react');
    expect(react.every((s) => s.baseline === 'diff' && s.diff && existsSync(s.diff))).toBe(true);
    const vue = report.sheets.filter((s) => s.stack === 'vue');
    expect(vue.map((s) => `${s.sheet}: ${s.baseline} (${s.diffPixels} px)`)).toEqual(
      vue.map((s) => `${s.sheet}: match (0 px)`),
    );
    expect(report.cross.every((c) => !c.match && c.diff && existsSync(c.diff))).toBe(true);
    expect(readFileSync(join(out, 'report.md'), 'utf8')).toContain('react vs vue differ by');
  });

  it('records a sheet that fails to render and still writes the report', async () => {
    const out = tmp();
    const unregistered = join(out, 'unregistered-host.tsx');
    writeFileSync(
      unregistered,
      `import { registerReactHost } from ${JSON.stringify(join(__dirname, '../src/hosts/react'))};
registerReactHost({});`,
    );
    const report = await runGates(
      config(out, { react: { host: unregistered }, vue: { host: join(reference, 'vue/host.ts') } }),
    );
    expect(report.ok).toBe(false);
    expect(report.sheets.filter((s) => s.stack === 'react')).toEqual([]);
    expect(report.sheets.filter((s) => s.stack === 'vue').length).toBeGreaterThan(0);
    expect(report.problems).toEqual(
      expect.arrayContaining([expect.stringMatching(/^Probe react light: .*Probe/)]),
    );
    expect(existsSync(join(out, 'report.json'))).toBe(true);
  });

  it('reports a stack it cannot render', async () => {
    const out = tmp();
    const report = await runGates(
      config(out, { livewire: { html: join(out, 'nowhere') }, vue: {} }),
    );
    expect(report.ok).toBe(false);
    expect(report.problems).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Render the Blade fixtures first'),
        'vue: set "host" to the fixture entry',
      ]),
    );
  });

  it('skips stacks the component does not ship in (D-003)', async () => {
    const out = tmp();
    const manifests = join(out, 'manifests');
    mkdirSync(manifests, { recursive: true });
    // ThemePreview is a D-003 exception, so a Livewire-only copy of the Probe validates.
    const m = probe();
    m.name = 'ThemePreview';
    m.rootClass = 'apui-theme-preview';
    m.stacks = { livewire: { name: 'theme-preview' }, react: false, vue: false };
    writeFileSync(join(manifests, 'ThemePreview.json'), JSON.stringify(m));
    const report = await runGates({
      ...config(out, { react: { host: join(reference, 'react/host.tsx') } }),
      components: ['ThemePreview'],
      manifests,
    });
    expect(report.sheets.filter((sheet) => sheet.stack === 'react')).toEqual([]);
    expect(report.problems).toEqual([
      'ThemePreview: nothing rendered. Configure a stack it ships in (livewire).',
    ]);
  });

  it('fails when nothing renders: a misspelled stack, no stack it ships in, or no components', async () => {
    const out = tmp();
    const misspelled = await runGates(
      config(out, { blade: { html: out } } as GatesConfig['stacks']),
    );
    expect(misspelled.ok).toBe(false);
    expect(misspelled.problems).toEqual([
      'stacks: "blade" is not a stack (livewire, react, vue)',
      'Probe: nothing rendered. Configure a stack it ships in (livewire, react, vue).',
    ]);

    const empty = await runGates({ ...config(out, {}), components: [] });
    expect(empty.ok).toBe(false);
    expect(empty.problems).toEqual(['components: list at least one component']);
  });

  it('reads a config relative to its file', () => {
    const resolved = readConfig(join(reference, 'apui-gates.config.json'));
    expect(resolved.stacks.react!.host).toBe(join(reference, 'react/host.tsx'));
    expect(resolved.baselines).toBe(join(reference, '../baselines'));
  });
});

describe('forced states', () => {
  it('change the pixels, so a broken forceStates cannot pass unnoticed', async () => {
    const browser = await chromium.launch();
    try {
      const sheet = fixtureSheets(probe())[0]!;
      const pick = (state: string) =>
        sheet.cases.find((c) => c.id === `variant=solid size=md state=${state}`)!;
      const shots: Buffer[] = [];
      for (const state of ['default', 'hover', 'focus-visible']) {
        const { page } = await openSheet(browser, {
          sheet: { ...sheet, cases: [pick(state)] },
          source: {
            kind: 'host',
            script: await bundleHost(join(reference, 'react/host.tsx')),
            component: 'Probe',
          },
          css: css.map((file) => readFileSync(file, 'utf8')),
          rootClass: 'apui-probe',
        });
        shots.push(await screenshotSheet(page));
        await page.close();
      }
      expect(compareImages(shots[0]!, shots[1]!).match).toBe(false);
      expect(compareImages(shots[0]!, shots[2]!).match).toBe(false);
    } finally {
      await browser.close();
    }
  });
});

describe('axe and the manifest checks', () => {
  it('reports contrast violations and the wrong root element', async () => {
    const browser = await chromium.launch();
    try {
      const sheet = fixtureSheets(probe())[0]!;
      const fixtureCase = sheet.cases[0]!;
      const { page } = await openSheet(browser, {
        sheet: { ...sheet, cases: [fixtureCase] },
        source: {
          kind: 'html',
          html: `<div data-apui-case="${fixtureCase.id}" data-apui-state="default"><div class="apui-probe" style="color:#bbb;background:#fff">Probe</div></div>`,
        },
        css: css.map((file) => readFileSync(file, 'utf8')),
        rootClass: 'apui-probe',
      });
      expect((await runAxe(page)).map((v) => v.id)).toContain('color-contrast');
      expect(await checkManifestA11y(page, probe())).toEqual([
        'variant=solid size=sm state=default: renders <div>, expected button',
      ]);
      await page.close();
    } finally {
      await browser.close();
    }
  });
});

describe('a11yChecklist', () => {
  it('lists the manifest keyboard rows per shipping stack', () => {
    const text = a11yChecklist(probe());
    expect(text).toContain('| Check | Livewire | React | Vue |');
    expect(text).toContain('| **Enter**: Presses it. | ☐ | ☐ | ☐ |');
    expect(text).not.toContain('RTL (`dir="rtl"`)');
  });

  it('adds the RTL arrow-key rows when ArrowLeft or ArrowRight do something', () => {
    const m = probe();
    m.a11y.keyboard!.push({ keys: 'ArrowLeft / ArrowRight', action: 'Moves.' });
    m.stacks.vue = false;
    const text = a11yChecklist(m);
    expect(text).toContain('| Check | Livewire | React |');
    expect(text).toContain('ArrowRight moves toward the start');
  });
});
