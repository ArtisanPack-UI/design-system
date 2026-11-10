/**
 * Vitest helper for Vue (#41): renders a component on the server and checks
 * it against its manifest, including the props and emits it declares.
 *
 * ```ts
 * import { expectVueParity } from '@artisanpack-ui/testing/vue';
 * import { Button } from '../src';
 *
 * it('matches the manifest', () => expectVueParity(Button, 'Button'));
 * ```
 */
import { type ComponentManifest, loadManifest } from '@artisanpack-ui/manifest';
import { type Component, createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { checkParity, ParityError, type ParityOptions, stackPropName } from './parity';

export interface VueParityOptions extends ParityOptions {
  /** A manifests directory other than the package's. */
  manifests?: string;
}

const resolve = (manifest: ComponentManifest | string, dir?: string) =>
  typeof manifest === 'string' ? loadManifest(manifest, dir) : manifest;

/** The props and emits a component declares, from its options. */
export function declaredVueApi(component: Component): { props: string[]; events: string[] } {
  const options = component as { props?: unknown; emits?: unknown };
  const names = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.map(String)
      : value && typeof value === 'object'
        ? Object.keys(value)
        : [];
  return { props: names(options.props), events: names(options.emits) };
}

/** The problems with a Vue component, empty when it matches (or doesn't ship in Vue). */
export function checkVueParity(
  component: Component,
  manifest: ComponentManifest | string,
  options: VueParityOptions = {},
): Promise<string[]> {
  const resolved = resolve(manifest, options.manifests);
  return checkParity(
    resolved,
    'vue',
    (props, content) => {
      const bound = Object.fromEntries(
        Object.entries(props).map(([name, value]) => [stackPropName(name, 'vue'), value]),
      );
      const app = createSSRApp({
        render: () =>
          h(component, bound, content === null ? undefined : { default: () => content }),
      });
      return renderToString(app);
    },
    { ...options, declared: options.declared ?? declaredVueApi(component) },
  );
}

/** Throws a {@link ParityError} listing every drift from the manifest. */
export async function expectVueParity(
  component: Component,
  manifest: ComponentManifest | string,
  options: VueParityOptions = {},
): Promise<void> {
  const resolved = resolve(manifest, options.manifests);
  const problems = await checkVueParity(component, resolved, options);
  if (problems.length) throw new ParityError(resolved.name, 'vue', problems);
}
