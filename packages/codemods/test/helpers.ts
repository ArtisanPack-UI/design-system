import type { ComponentRule, MemberRule, Stack } from '../src';
import { rulesFor } from '../src';

export interface RuleCase {
  component: string;
  rule: ComponentRule;
  group: 'props' | 'slots' | 'events';
  member: string;
  memberRule: MemberRule;
}

/** Every member rule of a stack, one test case each. */
export function ruleCases(stack: Stack): RuleCase[] {
  return Object.entries(rulesFor(stack).components).flatMap(([component, rule]) =>
    (['props', 'slots', 'events'] as const).flatMap((group) =>
      Object.entries(rule[group] ?? {}).map(([member, memberRule]) => ({
        component,
        rule,
        group,
        member,
        memberRule,
      })),
    ),
  );
}

export const label = (item: RuleCase) =>
  `${item.component} ${item.member} (${item.memberRule.kind})`;
