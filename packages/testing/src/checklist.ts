/**
 * The keyboard and screen-reader checklist (#40), filled in from a manifest.
 * People complete it in the component's PR; the template is
 * `.github/ISSUE_TEMPLATE/component-accessibility-checklist.md`.
 */
import { type ComponentManifest, shipsIn, STACKS, type Stack } from '@artisanpack-ui/manifest';

const STACK_LABELS: Record<Stack, string> = { livewire: 'Livewire', react: 'React', vue: 'Vue' };

/** The checklist as Markdown, one column per stack the component ships in (D-003). */
export function a11yChecklist(manifest: ComponentManifest): string {
  const stacks = STACKS.filter((stack) => shipsIn(manifest, stack));
  const header = `| Check | ${stacks.map((s) => STACK_LABELS[s]).join(' | ')} |`;
  const rule = `|---|${stacks.map(() => '---').join('|')}|`;
  const row = (check: string) => `| ${check} | ${stacks.map(() => '☐').join(' | ')} |`;

  const keyboard = (manifest.a11y.keyboard ?? []).map((entry) =>
    row(`**${entry.keys}**: ${entry.action}`),
  );
  const horizontal = (manifest.a11y.keyboard ?? []).some((entry) =>
    /Arrow(Left|Right)/.test(entry.keys),
  );
  const rtl = horizontal
    ? [
        row(
          'RTL (`dir="rtl"`): ArrowRight moves toward the start and ArrowLeft toward the end, following the text',
        ),
        row('RTL: Home and End go to the visual start and end'),
      ]
    : [];

  return `## Accessibility checklist: ${manifest.name}

Automated: axe runs on every fixture in every stack, and the manifest requirements are checked by \`apui-gates check\`. Complete the rest by hand in each stack, with a keyboard and with a screen reader (VoiceOver + Safari, and NVDA + Firefox or Chrome).

### Keyboard

${header}
${rule}
${row('Every interactive part is reachable with Tab, in a logical order')}
${row('The focus ring is visible on `:focus-visible` in light, dark and high-contrast')}
${keyboard.join('\n')}${keyboard.length ? '\n' : ''}${rtl.join('\n')}${rtl.length ? '\n' : ''}${row('No keyboard trap, except a modal that returns focus when it closes')}

### Screen reader

${header}
${rule}
${row(`Announced with the right role${manifest.a11y.role ? ` (\`${manifest.a11y.role}\`)` : manifest.a11y.element ? ` (native \`<${manifest.a11y.element}>\`)` : ''} and an accessible name`)}
${row('State changes are announced (expanded, selected, checked, busy, invalid, as they apply)')}
${row('Decorative icons are hidden; meaningful ones have a text alternative')}
${row('Every user-facing string is translatable, including the hidden ones')}

### Requirements from the manifest

${header}
${rule}
${manifest.a11y.requirements.map(row).join('\n')}

WCAG 2.2 criteria: ${(manifest.a11y.wcag ?? []).join(', ') || 'none listed'}.
`;
}
