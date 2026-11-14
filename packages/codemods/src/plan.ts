/**
 * Decides what one attribute becomes under a rule. Shared by the React and
 * Vue codemods (the Blade command in Livewire UI Components applies the same
 * rules in PHP), so every stack rewrites the same way.
 */
import type { MemberRule } from './types';

/** An attribute as a codemod sees it. */
export interface AttributeValue {
  /**
   * `flag` is a bare attribute (`<Tabs vertical>`). `literal` is a string,
   * boolean or number the codemod can read. `dynamic` is any other expression.
   */
  type: 'flag' | 'literal' | 'dynamic';
  /** The literal: a string's text, or `true`, `false` or a number as written. */
  value?: string;
  /** Whether a literal is a string (`"x"`) and not `true`, `false` or a number. */
  string?: boolean;
}

export type Plan =
  | { type: 'none' }
  /** Rename the attribute; `value` replaces a string literal's text. */
  | { type: 'rename'; to: string; value?: string }
  /** Replace the attribute with `to="value"`. */
  | { type: 'set'; to: string; value: string }
  /** Replace the attribute with the boolean `to` set to `value`. */
  | { type: 'boolean'; to: string; value: boolean }
  /** Rename and negate a dynamic expression. */
  | { type: 'negate'; to: string }
  /** Replace the attribute with the number `to` bound to `value`. */
  | { type: 'number'; to: string; value: number }
  | { type: 'part-class'; part: string }
  | { type: 'remove' };

export interface Planned {
  plan: Plan;
  /** Why a person should look, when the plan can't finish the job. */
  manual?: string;
  /** Whether the change is worth a second look even though it was made. */
  review?: string;
}

/** `250ms`, `1s` or `250` in milliseconds, or null when it isn't a duration. */
export function durationMs(text: string): number | null {
  const match = /^\s*(\d+(?:\.\d+)?)\s*(ms|s)?\s*$/i.exec(text);
  if (!match) return null;
  return Math.round(Number(match[1]) * (match[2]?.toLowerCase() === 's' ? 1000 : 1));
}

const isTrue = (attr: AttributeValue) =>
  attr.type === 'flag' || (attr.type === 'literal' && !attr.string && attr.value === 'true');
const isFalse = (attr: AttributeValue) =>
  attr.type === 'literal' && !attr.string && attr.value === 'false';

/** What `name` becomes under `rule`, given how it was written. */
export function planAttribute(name: string, rule: MemberRule, attr: AttributeValue): Planned {
  const note = rule.note ? ` ${rule.note}` : '';

  switch (rule.kind) {
    case 'rename': {
      if (attr.type === 'literal' && attr.string && rule.keep?.includes(attr.value ?? '')) {
        return { plan: { type: 'none' } };
      }
      const review = rule.review ? (rule.note ?? 'Check this change.') : undefined;
      if (!rule.values) return { plan: { type: 'rename', to: rule.to }, review };
      if (attr.type === 'literal' && attr.string) {
        const value = rule.values[attr.value ?? ''];
        return { plan: { type: 'rename', to: rule.to, value }, review };
      }
      const pairs = Object.entries(rule.values)
        .map(([from, to]) => `\`${from}\` is now \`${to}\``)
        .join(', ');
      return {
        plan: { type: 'rename', to: rule.to },
        review: attr.type === 'dynamic' ? `Check the value: ${pairs}.` : review,
      };
    }

    case 'value':
      if (isTrue(attr)) return { plan: { type: 'set', to: rule.to, value: rule.value } };
      if (isFalse(attr)) return { plan: { type: 'remove' } };
      return {
        plan: { type: 'none' },
        manual: `\`${name}\` is now \`${rule.to}="${rule.value}"\`; set \`${rule.to}\` from this expression.${note}`,
      };

    case 'split': {
      if (attr.type === 'literal' && attr.string) {
        const hit = rule.cases.find((item) => item.values.includes(attr.value ?? ''));
        if (hit) return { plan: { type: 'rename', to: hit.to } };
        if (rule.keep?.includes(attr.value ?? '')) return { plan: { type: 'none' } };
      }
      const targets = rule.cases.map((item) => `\`${item.to}\``).join(' or ');
      return {
        plan: { type: 'none' },
        manual: `\`${name}\` may now be ${targets}, depending on its value.${note}`,
      };
    }

    case 'invert':
      if (isTrue(attr)) return { plan: { type: 'boolean', to: rule.to, value: false } };
      if (isFalse(attr)) return { plan: { type: 'boolean', to: rule.to, value: true } };
      if (attr.type === 'dynamic') return { plan: { type: 'negate', to: rule.to } };
      return {
        plan: { type: 'none' },
        manual: `\`${name}\` is now \`${rule.to}\`, with the opposite meaning.`,
      };

    case 'part-class':
      return { plan: { type: 'part-class', part: rule.part } };

    case 'duration': {
      const ms = attr.type === 'literal' ? durationMs(attr.value ?? '') : null;
      if (ms !== null) return { plan: { type: 'number', to: rule.to, value: ms } };
      return {
        plan: { type: 'none' },
        manual: `\`${name}\` is now integer milliseconds on \`${rule.to}\`; convert this value.${note}`,
      };
    }

    case 'keep':
      return { plan: { type: 'none' } };

    case 'remove':
      return { plan: { type: 'remove' } };

    case 'wrap':
    case 'content':
    case 'manual':
      return { plan: { type: 'none' }, manual: rule.note ?? `\`${name}\` changed.` };
  }
}
