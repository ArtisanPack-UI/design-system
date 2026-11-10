/**
 * The optional Tailwind v4 preset (#24): maps the design tokens into a
 * Tailwind `@theme`, generated from the token map so nothing is maintained
 * twice. Adding a semantic token to a mapped group adds its utility.
 *
 * `@theme inline` makes each utility read the `--apui-*` custom property
 * itself, so utilities follow data-theme, data-density and data-preset at
 * runtime like the components do.
 *
 * The preset only adds theme variables. It never redefines one of Tailwind's
 * defaults (the tests check against tailwindcss/theme.css), so importing it
 * changes nothing that is already on the page.
 */
import { tokens } from '@artisanpack-ui/tokens';

/**
 * Mapping rules: `[type, path pattern, Tailwind theme variable]`. A token maps
 * through the first rule whose type and pattern both match, or not at all.
 * Only semantic tokens are mapped: components read semantic and component
 * tokens, and primitives stay out of app code too.
 */
const RULES = [
  // bg-primary, text-primary-text, border-primary-border, bg-primary-soft …
  ['color', /^color\.(.+)$/, (m) => `--color-${m[1]}`],
  // bg-surface-raised, bg-surface-page …
  ['color', /^surface\.(.+)$/, (m) => `--color-surface-${m[1]}`],
  // text-default, text-muted, text-inverse …
  ['color', /^text\.(.+)$/, (m) => `--text-color-${m[1]}`],
  // border-muted, border-default, border-strong
  ['color', /^border\.(.+)$/, (m) => `--border-color-${m[1]}`],
  // ring-focus-ring, ring-offset-focus-ring-offset
  ['color', /^focus-ring\.color$/, () => '--color-focus-ring'],
  ['color', /^focus-ring\.offset-color$/, () => '--color-focus-ring-offset'],
  ['color', /^(state|selected|chart|syntax)\.(.+)$/, (m) => `--color-${m[1]}-${m[2]}`],
  ['color', /^backdrop$/, () => '--color-backdrop'],
  // rounded-control, rounded-field, rounded-surface, rounded-overlay
  ['dimension', /^radius\.(control|field|surface|overlay)$/, (m) => `--radius-${m[1]}`],
  // shadow-raised, shadow-overlay, shadow-glass
  ['shadow', /^elevation\.(.+)$/, (m) => `--shadow-${m[1]}`],
  // font-ui, font-code, font-display. Not font-sans and font-mono: the preset
  // only adds to Tailwind's theme, so it never changes an app's base font.
  ['fontFamily', /^font-family\.sans$/, () => '--font-ui'],
  ['fontFamily', /^font-family\.mono$/, () => '--font-code'],
  ['fontFamily', /^font-family\.(.+)$/, (m) => `--font-${m[1]}`],
  // text-body-md sets size, line height, weight and letter spacing together.
  ['dimension', /^type\.([^.]+)\.font-size$/, (m) => `--text-${m[1]}`],
  ['dimension', /^type\.([^.]+)\.line-height$/, (m) => `--text-${m[1]}--line-height`],
  ['fontWeight', /^type\.([^.]+)\.font-weight$/, (m) => `--text-${m[1]}--font-weight`],
  ['dimension', /^type\.([^.]+)\.letter-spacing$/, (m) => `--text-${m[1]}--letter-spacing`],
  // ease-standard, ease-enter, ease-exit
  ['cubicBezier', /^motion\.ease-(.+)$/, (m) => `--ease-${m[1]}`],
  // h-control-md, size-icon-sm …
  ['dimension', /^control-height\.(.+)$/, (m) => `--spacing-control-${m[1]}`],
  ['dimension', /^icon-size\.(.+)$/, (m) => `--spacing-icon-${m[1]}`],
  // p-panel-padding, gap-panel-gap, h-row-height, px-cell-padding-x, gap-field-gap
  [
    'dimension',
    /^(panel|row|cell|field)\.(padding|gap|height|padding-x)$/,
    (m) => `--spacing-${m[1]}-${m[2]}`,
  ],
  // max-w-content, max-w-measure
  ['dimension', /^content-max-width$/, () => '--container-content'],
  ['dimension', /^measure$/, () => '--container-measure'],
];

/** `[tailwindVariable, tokenPath, cssVar]` for every mapped token, in token order. */
export function tailwindMappings(map = tokens) {
  const mappings = [];
  for (const [path, token] of Object.entries(map)) {
    if (token.tier !== 'semantic') continue;
    for (const [type, pattern, name] of RULES) {
      const match = token.type === type && path.match(pattern);
      if (!match) continue;
      mappings.push([name(match), path, token.cssVar]);
      break;
    }
  }
  return mappings;
}

/** The preset stylesheet: one `@theme inline` block. */
export function formatTailwind(map = tokens) {
  const mappings = tailwindMappings(map);
  const seen = new Map();
  for (const [variable, path] of mappings) {
    if (seen.has(variable)) {
      throw new Error(`${path} and ${seen.get(variable)} both map to ${variable}`);
    }
    seen.set(variable, path);
  }
  const lines = mappings.map(([variable, , cssVar]) => `  ${variable}: var(${cssVar});`);
  return `/*
 * @artisanpack-ui/css/tailwind
 *
 * Optional Tailwind v4 preset, generated from @artisanpack-ui/tokens by
 * packages/css/build.mjs. Do not edit.
 *
 * It only adds utilities (bg-primary, text-muted, rounded-control, …) and
 * never redefines a Tailwind default. Import it after Tailwind and
 * @artisanpack-ui/css, and put the apui layer between Tailwind's base and
 * components so Preflight never restyles a component and utilities still win:
 *
 *   @layer theme, base, apui, components, utilities;
 *   @import 'tailwindcss';
 *   @import '@artisanpack-ui/css';
 *   @import '@artisanpack-ui/css/tailwind';
 */
@theme inline {
${lines.join('\n')}
}
`;
}
