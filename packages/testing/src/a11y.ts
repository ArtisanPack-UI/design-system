/**
 * The manifest's machine-checkable accessibility requirements (#40): the root
 * element and role every case renders, checked in the browser through the
 * accessibility tree. The rest becomes the keyboard and screen-reader
 * checklist, which people complete.
 */
import type { ComponentManifest } from '@artisanpack-ui/manifest';
import type { Page } from 'playwright';

/** A value from CDP's flat `[name, value, name, value]` attribute list. */
function attribute(list: string[], name: string): string | undefined {
  for (let i = 0; i < list.length; i += 2) if (list[i] === name) return list[i + 1];
  return undefined;
}

/** Elements whose implicit role is the same as their name. */
const IMPLICIT_ROLES: Record<string, string> = {
  a: 'link',
  button: 'button',
  dialog: 'dialog',
  nav: 'navigation',
  table: 'table',
  ul: 'list',
  ol: 'list',
};

/**
 * Problems with the rendered roots: a tag outside the root part's elements, or
 * an accessibility role other than the manifest's (`role`, or one of `roles`).
 */
export async function checkManifestA11y(
  page: Page,
  manifest: ComponentManifest,
): Promise<string[]> {
  const rootPart = manifest.parts.find((part) => part.name === 'root');
  const elements = rootPart?.element?.split('|').map((element) => element.trim()) ?? [];
  const role =
    manifest.a11y.role ??
    (manifest.a11y.element ? IMPLICIT_ROLES[manifest.a11y.element] : undefined);
  const problems = new Set<string>();
  const session = await page.context().newCDPSession(page);
  await session.send('DOM.enable');
  await session.send('Accessibility.enable');
  const { root } = await session.send('DOM.getDocument', { depth: -1 });
  const { nodeIds: caseIds } = await session.send('DOM.querySelectorAll', {
    nodeId: root.nodeId,
    selector: '[data-apui-case]',
  });

  for (const caseId of caseIds) {
    const attributes = await session.send('DOM.getAttributes', { nodeId: caseId });
    const id = attribute(attributes.attributes, 'data-apui-case') ?? '';
    const { nodeId } = await session.send('DOM.querySelector', {
      nodeId: caseId,
      selector: `.${manifest.rootClass}`,
    });
    if (!nodeId) {
      problems.add(`${id}: no element with class "${manifest.rootClass}"`);
      continue;
    }
    const { node } = await session.send('DOM.describeNode', { nodeId });
    const tag = node.localName;
    if (elements.length && !elements.includes(tag)) {
      problems.add(`${id}: renders <${tag}>, expected ${elements.join(' | ')}`);
      continue;
    }
    // An anchor root (a Button with href) is a link by design.
    const href = attribute(node.attributes ?? [], 'href') !== undefined;
    if (!role || (tag === 'a' && href && role !== 'link')) continue;
    const { nodes } = await session.send('Accessibility.getPartialAXTree', {
      nodeId,
      fetchRelatives: false,
    });
    const actual = nodes[0]?.role?.value;
    const allowed = [role, ...(manifest.a11y.roles ?? [])];
    if (actual !== undefined && !allowed.includes(String(actual))) {
      problems.add(`${id}: has role "${String(actual)}", expected "${allowed.join('" or "')}"`);
    }
  }
  await session.detach();
  return [...problems];
}
