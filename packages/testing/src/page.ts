/**
 * The fixture page every stack renders into, so the only difference between
 * stacks' screenshots is the component markup.
 */
import type { FixtureCase, FixtureSheet } from './types';

/** The element the cases render into and the gates screenshot. */
export const FIXTURE_ROOT_ID = 'apui-fixture';

/** Fixed width, so cases wrap the same in every stack. */
export const FIXTURE_WIDTH = 1200;

/**
 * Layout for the harness, outside the apui layers. Each case gets padding so
 * focus rings and shadows stay inside its box.
 *
 * Overlays (Dialog, DropdownMenu) render open and in place (`portal: false`,
 * D-019). Their positioner and backdrop are fixed to the viewport, or placed
 * by the machine with inline styles, so here they sit in the case instead: the
 * positioner in flow under its trigger, the backdrop behind it filling the
 * case, as the spec's previews show them. `!important` beats the machine's
 * inline styles; the rule is the harness's, identical in every stack.
 */
export const HARNESS_CSS = `
html, body { margin: 0; }
body { background: var(--apui-surface-page); color: var(--apui-text-default); font-family: var(--apui-font-family-sans); }
#${FIXTURE_ROOT_ID} { box-sizing: border-box; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; padding: 16px; inline-size: ${FIXTURE_WIDTH}px; }
[data-apui-case] { display: inline-flex; padding: 8px; }
*, *::before, *::after { caret-color: transparent; }
[data-apui-case]:has([data-part='positioner']) { position: relative; flex-direction: column; align-items: flex-start; gap: 8px; }
[data-apui-case] [data-part='positioner'] { position: relative !important; inset: auto !important; transform: none !important; z-index: auto !important; }
[data-apui-case] [data-part='backdrop'] { position: absolute !important; inset: 0 !important; z-index: auto !important; }
`;

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The wrapper attributes for one case, identical in every stack's host. */
export function caseAttributes(fixtureCase: FixtureCase): string {
  return `data-apui-case="${escapeAttribute(fixtureCase.id)}" data-apui-state="${escapeAttribute(fixtureCase.state)}"`;
}

export interface PageOptions {
  sheet: FixtureSheet;
  /** Stylesheets, in order. */
  css: string[];
  /** Classic scripts to run after the body, in order. */
  scripts: string[];
  /** Pre-rendered cases (Blade), or empty for a host that renders them. */
  body?: string;
}

/** The fixture page for one sheet. */
export function fixturePage({ sheet, css, scripts, body = '' }: PageOptions): string {
  const styles = css.map((text) => `<style>${text}</style>`).join('\n');
  const tags = scripts
    .map((text) => `<script>${text.replace(/<\/script/gi, '<\\/script')}</script>`)
    .join('\n');
  return `<!doctype html>
<html lang="en" dir="${sheet.dir}" data-theme="${escapeAttribute(sheet.theme)}" data-density="${escapeAttribute(sheet.density)}">
<head>
<meta charset="utf-8">
${styles}
<style>${HARNESS_CSS}</style>
</head>
<body>
<main id="${FIXTURE_ROOT_ID}">${body}</main>
${tags}
</body>
</html>`;
}
