/**
 * Stylelint rules for the design system's CSS conventions (#21, D-002, D-004).
 *
 * - apui/layer: every rule sits inside one of the four apui cascade layers.
 * - apui/mirror-safe-shorthand: box shorthands must not set different
 *   left and right values, which would not flip under dir="rtl".
 */
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

export const LAYERS = ['apui.reset', 'apui.tokens', 'apui.components', 'apui.utilities'];

/** Splits a value on top-level whitespace, keeping calc(), var() and friends whole. */
export function splitValue(value) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of value.trim()) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (/\s/.test(char) && depth === 0) {
      if (current) parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);
  return parts;
}

const layerName = 'apui/layer';
const layerMessages = ruleMessages(layerName, {
  outside: (what) => `${what} must be inside an @layer ${LAYERS.join(' | ')} block`,
  unknown: (name) => `Unknown layer "${name}". Use one of ${LAYERS.join(', ')}`,
  nested: () => 'Do not nest @layer inside an apui layer',
});

const layerRule = (primary) => (root, result) => {
  if (!validateOptions(result, layerName, { actual: primary })) return;

  root.each((node) => {
    if (node.type === 'comment') return;
    if (node.type === 'atrule' && node.name === 'import') return;
    if (node.type === 'atrule' && node.name === 'layer') {
      const names = node.params.split(',').map((name) => name.trim());
      for (const name of names) {
        if (!LAYERS.includes(name)) {
          report({ result, ruleName: layerName, node, message: layerMessages.unknown(name) });
        }
      }
      if (node.nodes && names.length !== 1) {
        report({ result, ruleName: layerName, node, message: layerMessages.unknown(node.params) });
      }
      node.walkAtRules('layer', (inner) => {
        report({ result, ruleName: layerName, node: inner, message: layerMessages.nested() });
      });
      return;
    }
    const what = node.type === 'rule' ? `"${node.selector}"` : node.type === 'atrule' ? `@${node.name}` : 'This declaration';
    report({ result, ruleName: layerName, node, message: layerMessages.outside(what) });
  });
};
layerRule.ruleName = layerName;
layerRule.messages = layerMessages;

const mirrorName = 'apui/mirror-safe-shorthand';
const mirrorMessages = ruleMessages(mirrorName, {
  rejected: (prop) =>
    `"${prop}" sets different left and right values, which do not flip under dir="rtl". Use the -inline-start and -inline-end longhands (D-004)`,
});

const BOX = /^(margin|padding|inset|scroll-margin|scroll-padding|border-width|border-style|border-color)$/;

/** True when a 4-value box shorthand sets the right side differently from the left. */
export function asymmetricBox(value) {
  const parts = splitValue(value);
  return parts.length === 4 && parts[1] !== parts[3];
}

/** True when a border-radius differs between the left and right corners. */
export function asymmetricRadius(value) {
  return value.split('/').some((axis) => {
    const [a, b = a, c = a, d = b] = splitValue(axis);
    return a !== b || c !== d;
  });
}

const mirrorRule = (primary) => (root, result) => {
  if (!validateOptions(result, mirrorName, { actual: primary })) return;

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    const bad = (BOX.test(prop) && asymmetricBox(decl.value)) || (prop === 'border-radius' && asymmetricRadius(decl.value));
    if (bad) report({ result, ruleName: mirrorName, node: decl, message: mirrorMessages.rejected(prop) });
  });
};
mirrorRule.ruleName = mirrorName;
mirrorRule.messages = mirrorMessages;

export default [createPlugin(layerName, layerRule), createPlugin(mirrorName, mirrorRule)];
