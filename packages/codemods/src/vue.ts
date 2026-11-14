import { parse } from '@vue/compiler-sfc';
import MagicString from 'magic-string';

import type { AttributeValue } from './plan';
import { planAttribute } from './plan';
import { camel, kebab, rulesFor, upgradeRules } from './rules';
import type { Binding } from './script';
import { locator, transformScript } from './script';
import type {
  ComponentRule,
  Finding,
  FindingKind,
  MemberRule,
  TransformResult,
  UpgradeRules,
} from './types';

/** `@artisanpack-ui/vue` and its entry points. */
export const VUE_PACKAGES = /^@artisanpack-ui\/vue(?:\/[\w-]+)?$/;

export interface VueTransformOptions {
  /** The rules to apply; the ones this package ships by default. */
  rules?: UpgradeRules;
  /**
   * Treat every tag named like a 2.x component as one, imported or not. For
   * apps that register the components globally.
   */
  global?: boolean;
}

// The template AST's node and prop types (@vue/compiler-core NodeTypes).
const ELEMENT = 1;
const ATTRIBUTE = 6;
const DIRECTIVE = 7;

interface Loc {
  start: { offset: number };
  end: { offset: number };
  source: string;
}
interface TemplateProp {
  type: number;
  name: string;
  rawName?: string;
  loc: Loc;
  nameLoc?: Loc;
  value?: { content: string; loc: Loc };
  arg?: { content: string; isStatic: boolean; loc: Loc };
  exp?: { content: string; loc: Loc };
}
interface TemplateNode {
  type: number;
  tag: string;
  loc: Loc;
  isSelfClosing?: boolean;
  props: TemplateProp[];
  children?: TemplateNode[];
}

/** Reads a bound expression that is really a literal: `'x'`, `true`, `3`. */
function expressionValue(expression: string | undefined): AttributeValue {
  const text = (expression ?? '').trim();
  const string = /^(['"`])((?:(?!\1)[^\\$])*)\1$/.exec(text);
  if (string) return { type: 'literal', value: string[2], string: true };
  if (/^(?:true|false|-?\d+(?:\.\d+)?)$/.test(text)) {
    return { type: 'literal', value: text, string: false };
  }
  return { type: 'dynamic' };
}

/** Writes a name the way its neighbour was written: `leading-icon` or `leadingIcon`. */
const styled = (name: string, like: string) => (/[A-Z]/.test(like) ? name : kebab(name));

/**
 * Migrates one Vue single-file component to the next major of
 * `@artisanpack-ui/vue`: imports and references in `<script>`, and tags,
 * props, events, `v-model` arguments and slots in `<template>`. Other file
 * types go through {@link transformVueScript}.
 */
export function transformVue(
  source: string,
  fileName: string,
  options: VueTransformOptions = {},
): TransformResult {
  const findings: Finding[] = [];
  const rules = rulesFor('vue', options.rules ?? upgradeRules);
  const { descriptor, errors } = parse(source, { filename: fileName, sourceMap: false });
  if (errors.length) {
    findings.push({
      kind: 'manual',
      line: 1,
      column: 1,
      message: `Could not parse the file: ${errors[0]!.message}`,
    });
    return { code: source, changed: false, findings };
  }

  const magic = new MagicString(source);
  const locate = locator(source);
  const bindings = new Map<string, Binding>();
  /** Imports the script renamed. An import aliased on a collision keeps its tag. */
  const renamed = new Map<string, string>();

  for (const block of [descriptor.script, descriptor.scriptSetup]) {
    if (!block || block.src) continue;
    const lang = block.lang ?? 'js';
    const result = transformScript({
      code: block.content,
      fileName: `${fileName}.${lang}`,
      offset: block.loc.start.offset,
      magic,
      rules,
      packages: VUE_PACKAGES,
      findings,
      locate,
      jsx: /x$/.test(lang),
      shorthand: 'rename',
    });
    for (const [local, binding] of result.bindings) bindings.set(local, binding);
    for (const [local, to] of result.renames) renamed.set(local, to);
  }

  const template = descriptor.template;
  const ast = template?.ast as unknown as TemplateNode | undefined;
  if (template && ast && !template.src && (!template.lang || template.lang === 'html')) {
    /** The component a tag names: `<Modal>`, `<modal>` or, globally, any 2.x name. */
    const resolve = (tag: string): Binding | null => {
      for (const [local, binding] of bindings) {
        if (tag === local || tag === kebab(local)) return binding;
      }
      if (!options.global) return null;
      for (const [name, rule] of Object.entries(rules.components)) {
        if (tag === name || tag === kebab(name)) return { component: name, rule };
      }
      return null;
    };

    const report = (kind: FindingKind, loc: Loc, message: string, extra: Partial<Finding> = {}) =>
      findings.push({ kind, ...locate(loc.start.offset), message, ...extra });

    const walk = (node: TemplateNode, parent: Binding | null) => {
      let binding: Binding | null = null;
      if (node.type === ELEMENT) {
        binding = resolve(node.tag);
        if (binding) element(node, binding);
        else if (node.tag === 'template' && parent) slot(node, parent);
      }
      for (const child of node.children ?? []) walk(child, binding ?? null);
    };

    /** Renames `<template #actions>` when the parent's slot moved. */
    const slot = (node: TemplateNode, { component, rule }: Binding) => {
      for (const prop of node.props) {
        if (prop.type === DIRECTIVE && prop.name === 'slot') slotDirective(prop, component, rule);
      }
    };

    const slotDirective = (prop: TemplateProp, component: string, rule: ComponentRule) => {
      if (!prop.arg?.isStatic) return;
      const name = prop.arg.content;
      const member = rule.slots?.[name] ?? rule.slots?.[camel(name)];
      if (!member) return;
      const where = { component, member: name };
      if (member.kind === 'rename') {
        magic.overwrite(
          prop.arg.loc.start.offset,
          prop.arg.loc.end.offset,
          styled(member.to, name),
        );
        report('rewrote', prop.loc, `The \`${name}\` slot is now \`${member.to}\`.`, where);
      } else {
        report('manual', prop.loc, member.note ?? `The \`${name}\` slot changed.`, where);
      }
    };

    const element = (node: TemplateNode, { component, rule }: Binding) => {
      if (
        rule.manual &&
        options.global &&
        ![...bindings.values()].some((b) => b.component === component)
      ) {
        report('manual', node.loc, `\`${component}\` changed. ${rule.note ?? ''}`.trim(), {
          component,
        });
      }
      // The tag, in the case it was written in.
      if (rule.to !== component) {
        const pascal = node.tag === component || /[A-Z]/.test(node.tag);
        const local = [...bindings].find(([, item]) => item.component === component)?.[0];
        // An aliased import (`Modal as Sheet`, or `Dialog as Modal` on a collision) keeps its tag.
        if (!local || renamed.get(local) === rule.to) {
          // A one-word kebab-case name would be a native element (`<dialog>`), which Vue never
          // resolves to a component.
          const to = pascal || !kebab(rule.to).includes('-') ? rule.to : kebab(rule.to);
          const open = node.loc.start.offset + 1;
          magic.overwrite(open, open + node.tag.length, to);
          const close = node.loc.source.lastIndexOf(`</${node.tag}`);
          if (!node.isSelfClosing && close > 0) {
            const start = node.loc.start.offset + close + 2;
            magic.overwrite(start, start + node.tag.length, to);
          }
          if (options.global && !local) {
            report('rewrote', node.loc, `\`${component}\` is now \`${rule.to}\`.`, { component });
          }
        }
      }

      const names = new Set(
        node.props.map((prop) =>
          prop.type === ATTRIBUTE ? camel(prop.name) : camel(prop.arg?.content ?? ''),
        ),
      );
      const taken = new Set(names);
      const partClasses: { prop: TemplateProp; part: string; value: string; name: string }[] = [];

      for (const prop of node.props) {
        if (prop.type === DIRECTIVE && prop.name === 'slot') {
          slotDirective(prop, component, rule);
          continue;
        }
        if (prop.type === DIRECTIVE && prop.name === 'bind' && !prop.arg) {
          if (rule.props && Object.keys(rule.props).length) {
            report(
              'manual',
              prop.loc,
              `Props are bound onto \`${component}\` with \`v-bind\`. Check the object for props that changed.`,
              { component },
            );
          }
          continue;
        }

        // Events: `@close`, `v-on:update:open`.
        if (prop.type === DIRECTIVE && prop.name === 'on') {
          if (!prop.arg?.isStatic) continue;
          const name = prop.arg.content;
          const member = rule.events?.[name] ?? rule.events?.[camel(name)];
          if (!member) continue;
          const where = { component, member: name };
          if (member.kind === 'rename') {
            magic.overwrite(prop.arg.loc.start.offset, prop.arg.loc.end.offset, member.to);
            report(
              'review',
              prop.loc,
              `The \`${name}\` event is now \`${member.to}\`. ${member.note ?? 'Check the handler.'}`,
              where,
            );
          } else {
            report('manual', prop.loc, member.note ?? `The \`${name}\` event changed.`, where);
          }
          continue;
        }

        // `v-model` binds `modelValue`; `v-model:open` binds `open`.
        if (prop.type === DIRECTIVE && prop.name === 'model') {
          if (prop.arg && !prop.arg.isStatic) continue;
          const name = prop.arg?.content ?? 'modelValue';
          const member = rule.props?.[camel(name)];
          if (!member) continue;
          const where = { component, member: name };
          if (member.kind === 'rename') {
            if (prop.arg) {
              magic.overwrite(
                prop.arg.loc.start.offset,
                prop.arg.loc.end.offset,
                styled(member.to, name),
              );
            } else {
              const start = prop.loc.start.offset;
              magic.overwrite(start, start + 'v-model'.length, `v-model:${member.to}`);
            }
            report('rewrote', prop.loc, `\`v-model\` now binds \`${member.to}\`.`, where);
          } else {
            report('manual', prop.loc, member.note ?? `\`${name}\` changed.`, where);
          }
          continue;
        }

        const bound = prop.type === DIRECTIVE && prop.name === 'bind';
        if (prop.type !== ATTRIBUTE && !bound) continue;
        if (bound && !prop.arg?.isStatic) continue;
        const written = bound ? prop.arg!.content : prop.name;
        const name = camel(written);
        const member: MemberRule | undefined = rule.props?.[name];
        if (!member) continue;

        const value: AttributeValue = bound
          ? expressionValue(prop.exp?.content)
          : prop.value
            ? { type: 'literal', value: prop.value.content, string: true }
            : { type: 'flag' };
        const { plan, manual, review } = planAttribute(name, member, value);
        const where = { component, member: written };
        const start = prop.loc.start.offset;
        const end = prop.loc.end.offset;
        const nameLoc = bound ? prop.arg!.loc : (prop.nameLoc ?? prop.loc);
        const as = (to: string) => styled(to, written);
        /** Removes the attribute and the whitespace before it. */
        const remove = () => {
          let from = start;
          while (from > 0 && /\s/.test(source[from - 1]!)) from--;
          magic.remove(from, end);
        };

        if (manual) report('manual', prop.loc, manual, where);
        // Never write a prop the element already has.
        if ('to' in plan && plan.to !== name && taken.has(plan.to)) {
          report(
            'manual',
            prop.loc,
            `\`${written}\` is now \`${as(plan.to)}\`, which is already set.`,
            where,
          );
          continue;
        }
        if ('to' in plan) taken.add(plan.to);
        switch (plan.type) {
          case 'none':
            continue;
          case 'rename': {
            magic.overwrite(
              nameLoc.start.offset,
              nameLoc.start.offset + written.length,
              as(plan.to),
            );
            if (plan.value !== undefined) {
              if (bound && prop.exp) {
                const quote = prop.exp.content.trim()[0];
                magic.overwrite(
                  prop.exp.loc.start.offset,
                  prop.exp.loc.end.offset,
                  `${quote}${plan.value}${quote}`,
                );
              } else if (prop.value) {
                const loc = prop.value.loc;
                magic.overwrite(loc.start.offset + 1, loc.end.offset - 1, plan.value);
              }
            }
            break;
          }
          case 'set':
            magic.overwrite(start, end, `${as(plan.to)}="${plan.value}"`);
            break;
          case 'boolean':
            magic.overwrite(start, end, plan.value ? as(plan.to) : `:${as(plan.to)}="false"`);
            break;
          case 'number':
            magic.overwrite(start, end, `:${as(plan.to)}="${plan.value}"`);
            break;
          case 'negate':
            magic.overwrite(start, end, `:${as(plan.to)}="!(${prop.exp?.content ?? ''})"`);
            break;
          case 'remove':
            remove();
            report(
              'removed',
              prop.loc,
              `Removed \`${written}\`.${member.note ? ` ${member.note}` : ''}`,
              where,
            );
            continue;
          case 'part-class':
            if (value.type === 'flag') continue;
            // The object goes in a double-quoted attribute, so the value can't hold a quote of its own.
            if (/["\\]/.test(bound ? (prop.exp?.content ?? '') : (prop.value?.content ?? ''))) {
              report(
                'manual',
                prop.loc,
                `\`${written}\` is now \`classes.${plan.part}\`. Move it by hand.`,
                where,
              );
              continue;
            }
            partClasses.push({
              prop,
              name: written,
              part: plan.part,
              value: bound
                ? (prop.exp?.content ?? "''")
                : `'${(prop.value?.content ?? '').replace(/'/g, "\\'")}'`,
            });
            continue;
        }
        const to =
          plan.type === 'set'
            ? `${as(plan.to)}="${plan.value}"`
            : plan.type === 'number'
              ? `:${as(plan.to)}="${plan.value}"`
              : 'to' in plan
              ? as(plan.to)
              : written;
        report(
          review ? 'review' : 'rewrote',
          prop.loc,
          review
            ? `\`${written}\` is now \`${to}\`. ${review}`
            : `\`${written}\` is now \`${to}\`.`,
          where,
        );
      }

      if (partClasses.length) {
        if (names.has('classes')) {
          for (const { prop, part, name } of partClasses) {
            report(
              'manual',
              prop.loc,
              `\`${name}\` is now \`classes.${part}\`. Merge it into the \`classes\` prop.`,
              { component, member: name },
            );
          }
        } else {
          const [first, ...rest] = partClasses;
          const object = partClasses.map(({ part, value }) => `${part}: ${value}`).join(', ');
          magic.overwrite(
            first!.prop.loc.start.offset,
            first!.prop.loc.end.offset,
            `:classes="{ ${object} }"`,
          );
          for (const { prop } of rest) {
            let from = prop.loc.start.offset;
            while (from > 0 && /\s/.test(source[from - 1]!)) from--;
            magic.remove(from, prop.loc.end.offset);
          }
          for (const { prop, part, name } of partClasses) {
            report('rewrote', prop.loc, `\`${name}\` is now \`classes.${part}\`.`, {
              component,
              member: name,
            });
          }
        }
      }

      const added = (rule.add ?? []).filter(
        (item) => !names.has(item.name) && !(item.unless && names.has(item.unless)),
      );
      if (added.length) {
        const text = added
          .map((item) =>
            item.value === undefined
              ? ` ${kebab(item.name)}`
              : ` ${kebab(item.name)}="${item.value}"`,
          )
          .join('');
        magic.appendRight(node.loc.start.offset + 1 + node.tag.length, text);
        report(
          'rewrote',
          node.loc,
          `Added ${added.map((item) => `\`${kebab(item.name)}\``).join(' and ')}${rule.note ? `. ${rule.note}` : '.'}`,
          { component },
        );
      }
    };

    walk(ast, null);
  }

  const code = magic.toString();
  findings.sort((a, b) => a.line - b.line || a.column - b.column);
  return { code, changed: code !== source, findings };
}

/**
 * Migrates a plain script in a Vue app (`.ts`, `.js`, `.tsx`, `.jsx`):
 * imports from `@artisanpack-ui/vue` and references to renamed components.
 */
export function transformVueScript(
  source: string,
  fileName: string,
  options: VueTransformOptions = {},
): TransformResult {
  const findings: Finding[] = [];
  if (!source.includes('@artisanpack-ui/vue')) return { code: source, changed: false, findings };
  const magic = new MagicString(source);
  transformScript({
    code: source,
    fileName,
    offset: 0,
    magic,
    rules: rulesFor('vue', options.rules ?? upgradeRules),
    packages: VUE_PACKAGES,
    findings,
    locate: locator(source),
    jsx: /x$/.test(fileName),
    shorthand: 'rename',
  });
  const code = magic.toString();
  findings.sort((a, b) => a.line - b.line || a.column - b.column);
  return { code, changed: code !== source, findings };
}
