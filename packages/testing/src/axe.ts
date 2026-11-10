/**
 * axe in the fixture runs (#40): every sheet, in every stack, with the
 * pseudo-states forced, against WCAG 2.2 A and AA.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import type { Page } from 'playwright';

import { FIXTURE_ROOT_ID } from './page';

const require = createRequire(import.meta.url);

/** The axe tags the gate runs: WCAG 2.0 to 2.2, levels A and AA. */
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export interface AxeViolation {
  id: string;
  impact: string | null;
  help: string;
  helpUrl: string;
  nodes: { target: string; summary: string }[];
}

let source: string | undefined;

/** Runs axe on the fixture root and returns its violations. */
export async function runAxe(
  page: Page,
  selector = `#${FIXTURE_ROOT_ID}`,
): Promise<AxeViolation[]> {
  source ??= readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  await page.addScriptTag({ content: source });
  return page.evaluate(
    async ([context, tags]) => {
      const axe = (
        window as unknown as {
          axe: {
            run(
              context: string,
              options: object,
            ): Promise<{
              violations: {
                id: string;
                impact?: string | null;
                help: string;
                helpUrl: string;
                nodes: { target: unknown[]; failureSummary?: string }[];
              }[];
            }>;
          };
        }
      ).axe;
      const result = await axe.run(context as string, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations'],
      });
      return result.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact ?? null,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node) => ({
          target: node.target.map(String).join(' '),
          summary: node.failureSummary ?? '',
        })),
      }));
    },
    [selector, AXE_TAGS] as const,
  );
}
