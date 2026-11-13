/**
 * The JavaScript and TypeScript half of the codemods: finds what a file
 * imports from an ArtisanPack UI package, renames the imports that changed and
 * every reference to them, and rewrites props on JSX elements. Edits go into a
 * MagicString, so formatting and comments stay as written.
 */
import type MagicString from 'magic-string';
import ts from 'typescript';

import type { AttributeValue } from './plan';
import { planAttribute } from './plan';
import type { ComponentRule, Finding, FindingKind, StackRules } from './types';

/** Turns an offset in the whole file into a 1-based line and column. */
export type Locate = (offset: number) => { line: number; column: number };

export function locator(source: string): Locate {
  const starts = [0];
  for (let i = 0; i < source.length; i++) if (source[i] === '\n') starts.push(i + 1);
  return (offset) => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (starts[mid]! <= offset) low = mid;
      else high = mid - 1;
    }
    return { line: low + 1, column: offset - starts[low]! + 1 };
  };
}

export interface ScriptOptions {
  /** The script's text. */
  code: string;
  fileName: string;
  /** Where `code` starts in the file `magic` edits (a Vue `<script>` block). */
  offset: number;
  magic: MagicString;
  rules: StackRules;
  /** Matches the module specifiers to migrate. */
  packages: RegExp;
  findings: Finding[];
  locate: Locate;
  /** Whether to rewrite props on JSX elements. */
  jsx: boolean;
  /**
   * `{ Modal }` becomes `{ Dialog }` when `rename` (Vue's `components` option
   * wants the new key) and `{ Modal: Dialog }` when `expand`.
   */
  shorthand: 'rename' | 'expand';
}

/** A 2.x component a file uses, by the name the file calls it. */
export interface Binding {
  /** The 2.x export. */
  component: string;
  rule: ComponentRule;
}

export interface ScriptResult {
  /** Components by local name, as written before any rename. */
  bindings: Map<string, Binding>;
  /** Local names of `import * as UI` from the package. */
  namespaces: Set<string>;
}

function scriptKind(fileName: string): ts.ScriptKind {
  if (/\.tsx$/.test(fileName)) return ts.ScriptKind.TSX;
  if (/\.jsx?$/.test(fileName)) return ts.ScriptKind.JSX;
  return ts.ScriptKind.TS;
}

/** Whether an identifier names a value, and isn't a key or a member name. */
function isReference(node: ts.Identifier): boolean {
  const parent = node.parent;
  if (ts.isPropertyAccessExpression(parent)) return parent.expression === node;
  if (ts.isQualifiedName(parent)) return parent.left === node;
  if (ts.isPropertyAssignment(parent)) return parent.initializer === node;
  if (ts.isBindingElement(parent)) return parent.propertyName !== node;
  if (ts.isImportSpecifier(parent) || ts.isExportSpecifier(parent)) return false;
  if (
    ts.isJsxAttribute(parent) ||
    ts.isPropertySignature(parent) ||
    ts.isPropertyDeclaration(parent) ||
    ts.isMethodDeclaration(parent) ||
    ts.isMethodSignature(parent) ||
    ts.isEnumMember(parent) ||
    ts.isLabeledStatement(parent) ||
    ts.isJsxNamespacedName(parent)
  ) {
    return (parent as { name?: ts.Node }).name !== node;
  }
  return true;
}

/** Names a file declares itself, so a rename can't collide with them. */
function declaredNames(source: ts.SourceFile): Set<string> {
  const names = new Set<string>();
  const visit = (node: ts.Node) => {
    if (
      (ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isParameter(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isImportClause(node) ||
        ts.isNamespaceImport(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      names.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return names;
}

/** Reads how a JSX attribute's value was written. */
function jsxValue(
  attr: ts.JsxAttribute,
): AttributeValue & { text?: ts.Node; expression?: ts.Node } {
  const init = attr.initializer;
  if (!init) return { type: 'flag' };
  if (ts.isStringLiteral(init))
    return { type: 'literal', value: init.text, string: true, text: init };
  if (ts.isJsxExpression(init) && init.expression) {
    const expression = init.expression;
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      return {
        type: 'literal',
        value: expression.text,
        string: true,
        text: expression,
        expression,
      };
    }
    if (
      expression.kind === ts.SyntaxKind.TrueKeyword ||
      expression.kind === ts.SyntaxKind.FalseKeyword ||
      ts.isNumericLiteral(expression)
    ) {
      return { type: 'literal', value: expression.getText(), string: false, expression };
    }
    return { type: 'dynamic', expression };
  }
  return { type: 'dynamic' };
}

const quote = (text: string) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * Migrates one script: its imports from the package, references to renamed
 * components and, with `jsx`, the props on their elements.
 */
export function transformScript(options: ScriptOptions): ScriptResult {
  const { code, offset, magic, rules, findings, locate } = options;
  const source = ts.createSourceFile(
    options.fileName,
    code,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(options.fileName),
  );
  const at = (node: ts.Node) => offset + node.getStart(source);
  const report = (
    kind: FindingKind,
    node: ts.Node,
    message: string,
    extra: Partial<Finding> = {},
  ) => findings.push({ kind, ...locate(at(node)), message, ...extra });

  const bindings = new Map<string, Binding>();
  const namespaces = new Set<string>();
  /** Local names to rename everywhere, with the specifier that declares each. */
  const renames = new Map<string, string>();
  const declared = declaredNames(source);
  const imported = new Set<string>();
  const specifiers: { node: ts.ImportSpecifier; list: ts.NamedImports }[] = [];

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }
    const named = statement.importClause?.namedBindings;
    if (!options.packages.test(statement.moduleSpecifier.text)) {
      // Another package's `Dialog` would collide with a rename to `Dialog`.
      if (named && ts.isNamedImports(named)) {
        for (const node of named.elements) declared.add(node.name.text);
      }
      continue;
    }
    if (!named) continue;
    if (ts.isNamespaceImport(named)) {
      namespaces.add(named.name.text);
      continue;
    }
    for (const node of named.elements) {
      specifiers.push({ node, list: named });
      imported.add(node.name.text);
    }
  }

  const removed = new Set<ts.ImportSpecifier>();
  for (const { node, list } of specifiers) {
    const name = (node.propertyName ?? node.name).text;
    const local = node.name.text;
    const props = /^(\w+)Props$/.exec(name)?.[1];
    const rule = rules.components[props ?? name];
    if (!rule) continue;
    if (!props) bindings.set(local, { component: name, rule });
    if (rule.manual && !props) {
      report('manual', node, `\`${name}\` changed. ${rule.note ?? ''}`.trim(), { component: name });
    }
    if (rule.to === (props ?? name)) continue;

    const to = props ? `${rule.to}Props` : rule.to;
    const what = { component: props ?? name };
    if (node.propertyName) {
      // `Modal as Sheet`: only the imported name changes.
      magic.overwrite(at(node.propertyName), offset + node.propertyName.end, to);
      report('rewrote', node, `Import \`${name}\` is now \`${to}\`.`, what);
      continue;
    }
    if (imported.has(to)) {
      // Both names are imported (`Grid` and `StatGroup`): keep one.
      const index = list.elements.indexOf(node);
      const next = list.elements[index + 1];
      const previous = list.elements[index - 1];
      if (next) magic.remove(at(node), at(next));
      else if (previous) magic.remove(offset + previous.end, offset + node.end);
      else magic.remove(at(node), offset + node.end);
      removed.add(node);
      renames.set(local, to);
      report('rewrote', node, `\`${name}\` is now \`${to}\`, which is already imported.`, what);
      continue;
    }
    if (declared.has(to)) {
      magic.overwrite(at(node), offset + node.end, `${to} as ${local}`);
      report(
        'review',
        node,
        `\`${name}\` is now \`${to}\`. It is imported as \`${local}\` because this file already declares \`${to}\`.`,
        what,
      );
      continue;
    }
    magic.overwrite(at(node.name), offset + node.name.end, to);
    renames.set(local, to);
    imported.add(to);
    report('rewrote', node, `\`${name}\` is now \`${to}\`.`, what);
  }

  /** The component a JSX tag or a `UI.Modal` access names. */
  const resolve = (tag: ts.Node): (Binding & { rename?: ts.Identifier }) | null => {
    if (ts.isIdentifier(tag)) return bindings.get(tag.text) ?? null;
    if (
      ts.isPropertyAccessExpression(tag) &&
      ts.isIdentifier(tag.expression) &&
      namespaces.has(tag.expression.text) &&
      ts.isIdentifier(tag.name)
    ) {
      const rule = rules.components[tag.name.text];
      return rule ? { component: tag.name.text, rule, rename: tag.name } : null;
    }
    return null;
  };

  const visit = (node: ts.Node) => {
    if (ts.isIdentifier(node) && renames.has(node.text) && isReference(node)) {
      const to = renames.get(node.text)!;
      if (ts.isShorthandPropertyAssignment(node.parent) && options.shorthand === 'expand') {
        magic.overwrite(at(node), offset + node.end, `${node.text}: ${to}`);
      } else {
        magic.overwrite(at(node), offset + node.end, to);
      }
    } else if (ts.isPropertyAccessExpression(node)) {
      const hit = resolve(node);
      if (hit?.rename && hit.rule.to !== hit.component) {
        magic.overwrite(at(hit.rename), offset + hit.rename.end, hit.rule.to);
        if (!ts.isJsxClosingElement(node.parent)) {
          report('rewrote', node, `\`${hit.component}\` is now \`${hit.rule.to}\`.`, {
            component: hit.component,
          });
        }
      }
    }
    if (options.jsx && (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))) {
      const hit = resolve(node.tagName);
      if (hit) element(node, hit);
    }
    ts.forEachChild(node, visit);
  };

  const element = (node: ts.JsxOpeningLikeElement, { component, rule }: Binding) => {
    const attributes = node.attributes.properties;
    const names = new Set(
      attributes.filter(ts.isJsxAttribute).map((attr) => attr.name.getText(source)),
    );
    /** Names set on the element, including those this pass writes. */
    const taken = new Set(names);
    const partClasses: { attr: ts.JsxAttribute; part: string; value: string }[] = [];
    const has = (group?: Record<string, unknown>) => group && Object.keys(group).length > 0;

    for (const attr of attributes) {
      if (ts.isJsxSpreadAttribute(attr)) {
        if (has(rule.props) || has(rule.events)) {
          report(
            'manual',
            attr,
            `Props are spread onto \`${component}\`. Check the object for props that changed.`,
            { component },
          );
        }
        continue;
      }
      const name = attr.name.getText(source);
      const member = rule.props?.[name] ?? rule.events?.[name];
      if (!member) continue;
      const value = jsxValue(attr);
      const { plan, manual, review } = planAttribute(name, member, value);
      const where = { component, member: name };
      const start = at(attr);
      const end = offset + attr.end;

      if (manual) report('manual', attr, manual, where);
      // Never write a prop the element already has, or negate what isn't an expression.
      if ('to' in plan && plan.to !== name && taken.has(plan.to)) {
        report('manual', attr, `\`${name}\` is now \`${plan.to}\`, which is already set.`, where);
        continue;
      }
      if (plan.type === 'negate' && !value.expression) {
        report(
          'manual',
          attr,
          `\`${name}\` is now \`${plan.to}\`, with the opposite meaning.`,
          where,
        );
        continue;
      }
      if ('to' in plan) taken.add(plan.to);
      switch (plan.type) {
        case 'none':
          continue;
        case 'rename':
          magic.overwrite(at(attr.name), offset + attr.name.end, plan.to);
          if (plan.value !== undefined && value.text) {
            magic.overwrite(at(value.text) + 1, offset + value.text.end - 1, plan.value);
          }
          break;
        case 'set':
          magic.overwrite(start, end, `${plan.to}="${plan.value}"`);
          break;
        case 'boolean':
          magic.overwrite(start, end, plan.value ? plan.to : `${plan.to}={false}`);
          break;
        case 'negate':
          magic.overwrite(start, end, `${plan.to}={!(${value.expression!.getText(source)})}`);
          break;
        case 'remove':
          magic.remove(offset + attr.getFullStart(), end);
          report(
            'removed',
            attr,
            `Removed \`${name}\`.${member.note ? ` ${member.note}` : ''}`,
            where,
          );
          continue;
        case 'part-class':
          if (value.type === 'flag') continue;
          partClasses.push({
            attr,
            part: plan.part,
            value:
              value.type === 'literal' && value.string
                ? quote(value.value ?? '')
                : (value.expression?.getText(source) ?? "''"),
          });
          continue;
      }
      const to = plan.type === 'set' ? `${plan.to}="${plan.value}"` : 'to' in plan ? plan.to : name;
      report(
        review ? 'review' : 'rewrote',
        attr,
        review ? `\`${name}\` is now \`${to}\`. ${review}` : `\`${name}\` is now \`${to}\`.`,
        where,
      );
    }

    if (partClasses.length) {
      if (names.has('classes')) {
        for (const { attr, part } of partClasses) {
          report(
            'manual',
            attr,
            `\`${attr.name.getText(source)}\` is now \`classes.${part}\`. Merge it into the \`classes\` prop.`,
            { component, member: attr.name.getText(source) },
          );
        }
      } else {
        const [first, ...rest] = partClasses;
        const object = partClasses.map(({ part, value }) => `${part}: ${value}`).join(', ');
        magic.overwrite(at(first!.attr), offset + first!.attr.end, `classes={{ ${object} }}`);
        for (const { attr } of rest) magic.remove(offset + attr.getFullStart(), offset + attr.end);
        for (const { attr, part } of partClasses) {
          const name = attr.name.getText(source);
          report('rewrote', attr, `\`${name}\` is now \`classes.${part}\`.`, {
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
          item.value === undefined ? ` ${item.name}` : ` ${item.name}="${item.value}"`,
        )
        .join('');
      magic.appendRight(offset + node.tagName.end, text);
      report(
        'rewrote',
        node,
        `Added ${added.map((item) => `\`${item.name}\``).join(' and ')}${rule.note ? `. ${rule.note}` : '.'}`,
        { component },
      );
    }
  };

  visit(source);
  return { bindings, namespaces };
}
