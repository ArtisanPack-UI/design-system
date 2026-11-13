import MagicString from 'magic-string';

import { rulesFor, upgradeRules } from './rules';
import { locator, transformScript } from './script';
import type { Finding, TransformResult, UpgradeRules } from './types';

/** `@artisanpack-ui/react` and its entry points (`/form`, `/layout`, …). */
export const REACT_PACKAGES = /^@artisanpack-ui\/react(?:\/[\w-]+)?$/;

export interface TransformOptions {
  /** The rules to apply; the ones this package ships by default. */
  rules?: UpgradeRules;
}

/**
 * Migrates one React file (`.tsx`, `.jsx`, `.ts` or `.js`) to the next major
 * of `@artisanpack-ui/react`: renamed imports and components, renamed props
 * and events, values that moved to another prop. What it can't decide is left
 * alone and reported as `manual`.
 */
export function transformReact(
  source: string,
  fileName: string,
  options: TransformOptions = {},
): TransformResult {
  const findings: Finding[] = [];
  if (!source.includes('@artisanpack-ui/react')) return { code: source, changed: false, findings };

  const magic = new MagicString(source);
  transformScript({
    code: source,
    fileName,
    offset: 0,
    magic,
    rules: rulesFor('react', options.rules ?? upgradeRules),
    packages: REACT_PACKAGES,
    findings,
    locate: locator(source),
    jsx: true,
    shorthand: 'expand',
  });

  const code = magic.toString();
  findings.sort((a, b) => a.line - b.line || a.column - b.column);
  return { code, changed: code !== source, findings };
}
