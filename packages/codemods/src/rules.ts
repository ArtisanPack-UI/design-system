import data from '../generated/upgrade-rules.json';
import type { ComponentRule, Stack, StackRules, UpgradeRules } from './types';

/** The upgrade rules this package ships. */
export const upgradeRules = data as unknown as UpgradeRules;

/** One stack's rules. */
export function rulesFor(stack: Stack, rules: UpgradeRules = upgradeRules): StackRules {
  return rules.stacks[stack];
}

/** `leadingIcon` → `leading-icon`. */
export function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** `leading-icon` → `leadingIcon`. */
export function camel(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

/** Whether a component rule changes anything. */
export function hasChanges(name: string, rule: ComponentRule): boolean {
  return (
    rule.to !== name ||
    Boolean(rule.add?.length) ||
    [rule.props, rule.slots, rule.events].some((group) => group && Object.keys(group).length > 0)
  );
}
