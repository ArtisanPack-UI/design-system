/**
 * Finds raw DaisyUI classes and theme references. The codemods report them
 * and never rewrite them: a `btn` in app markup needs a person to pick the
 * component or utility that replaces it. The lists and patterns come from the
 * Phase 0 scanner, through the upgrade rules.
 */
import { upgradeRules } from './rules';
import { locator } from './script';
import type { ClassRules, Finding } from './types';

export type ClassKind =
  /** A DaisyUI component class, such as `btn` or `card-body`. */
  | 'component'
  /** Also a Tailwind utility or a common class name, such as `input` or `table`. */
  | 'ambiguous'
  /** `bg-base-200`, `text-base-content/60`. */
  | 'themeBase'
  /** `text-primary-content`. */
  | 'themeContent'
  /** `--color-base-100`, `var(--p)`. */
  | 'themeVariable'
  /** `@plugin "daisyui"`, `data-theme=`. */
  | 'config';

const VARIANTS = /^(?:[a-z0-9-]+:)*!?/;

/** Classifies one class token, variants and all (`hover:btn-sm`); null when it isn't DaisyUI's. */
export function classifyClass(
  token: string,
  rules: ClassRules = upgradeRules.classes,
): ClassKind | null {
  const name = token.replace(VARIANTS, '');
  if (!/^[a-z][a-z0-9/-]*$/.test(name)) return null;
  const matches = (roots: string[]) =>
    roots.some((root) => name === root || name.startsWith(`${root}-`));
  if (new RegExp(rules.patterns.themeBase).test(name)) return 'themeBase';
  if (new RegExp(rules.patterns.themeContent).test(name)) return 'themeContent';
  // `bg-primary` survives through the Tailwind preset, so it isn't reported.
  if (new RegExp(rules.patterns.themeSemantic).test(name)) return null;
  if (matches(rules.component)) return 'component';
  if (matches(rules.ambiguous) && !new RegExp(rules.patterns.lookalike).test(name)) {
    return 'ambiguous';
  }
  return null;
}

const CLASS_SOURCES = [
  // class="…", :class="…", className="…", className={'…'}
  /(?:^|[\s<"'(])(?::class|x-bind:class|class|className)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:`([^`]*)`|"([^"]*)"|'([^']*)')\s*\})/g,
  // @class([...]), cn(...), clsx(...)
  /@class\(\s*\[([\s\S]*?)\]\s*\)/g,
  /\b(?:cn|clsx|classNames|twMerge)\(([^;]*?)\)/g,
];

const MESSAGES: Record<ClassKind, (name: string) => string> = {
  component: (name) =>
    `\`${name}\` is a DaisyUI class. Use the component or an \`apui-\` class instead.`,
  ambiguous: (name) =>
    `\`${name}\` may be a DaisyUI class. Check whether it still has styles without DaisyUI.`,
  themeBase: (name) =>
    `\`${name}\` is a DaisyUI theme utility. Use a token, such as \`var(--apui-surface-page)\`, or the Tailwind preset's utilities.`,
  themeContent: (name) =>
    `\`${name}\` is a DaisyUI theme utility. Use the color's \`-foreground\` token.`,
  themeVariable: (name) => `\`${name}\` is a DaisyUI theme variable. Use an \`--apui-*\` token.`,
  config: (name) => `\`${name}\` configures DaisyUI. See the upgrade guide's CSS section.`,
};

/**
 * Lists the DaisyUI classes, theme variables and configuration in a file
 * (Blade, JSX, Vue, HTML or CSS), with the line and column of each.
 */
export function findClasses(source: string, rules: ClassRules = upgradeRules.classes): Finding[] {
  const findings: Finding[] = [];
  const locate = locator(source);
  const seen = new Set<string>();
  const add = (kind: ClassKind, name: string, offset: number) => {
    const key = `${offset}:${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({
      kind: 'class',
      ...locate(offset),
      member: name,
      message: MESSAGES[kind](name),
    });
  };

  for (const pattern of CLASS_SOURCES) {
    for (const match of source.matchAll(pattern)) {
      const text = match[0];
      // Tokens keep their place in the file, so each is reported where it is.
      for (const token of text.matchAll(/[A-Za-z0-9_:!/.[\]-]+/g)) {
        const kind = classifyClass(token[0], rules);
        if (kind) add(kind, token[0], match.index + token.index);
      }
    }
  }
  for (const [kind, pattern] of [
    ['themeVariable', rules.patterns.themeVariable],
    ['config', rules.patterns.config],
  ] as const) {
    for (const match of source.matchAll(new RegExp(pattern, 'g'))) {
      add(kind, match[0].trim(), match.index);
    }
  }

  return findings.sort((a, b) => a.line - b.line || a.column - b.column);
}
