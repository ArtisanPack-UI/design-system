/**
 * Vitest helper for React (#41): renders a component on the server and checks
 * it against its manifest.
 *
 * ```ts
 * import { expectReactParity } from '@artisanpack-ui/testing/react';
 * import { Button } from '../src';
 *
 * it('matches the manifest', () => expectReactParity(Button, 'Button'));
 * ```
 */
import { type ComponentManifest, loadManifest } from '@artisanpack-ui/manifest';
import { type ComponentType, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { checkParity, ParityError, type ParityOptions } from './parity';

export interface ReactParityOptions extends ParityOptions {
  /** A manifests directory other than the package's. */
  manifests?: string;
}

const resolve = (manifest: ComponentManifest | string, dir?: string) =>
  typeof manifest === 'string' ? loadManifest(manifest, dir) : manifest;

/** The problems with a React component, empty when it matches (or doesn't ship in React). */
export function checkReactParity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any component
  component: ComponentType<any>,
  manifest: ComponentManifest | string,
  options: ReactParityOptions = {},
): Promise<string[]> {
  const resolved = resolve(manifest, options.manifests);
  return checkParity(
    resolved,
    'react',
    (props, content) => renderToStaticMarkup(createElement(component, props, content ?? undefined)),
    options,
  );
}

/** Throws a {@link ParityError} listing every drift from the manifest. */
export async function expectReactParity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any component
  component: ComponentType<any>,
  manifest: ComponentManifest | string,
  options: ReactParityOptions = {},
): Promise<void> {
  const resolved = resolve(manifest, options.manifests);
  const problems = await checkReactParity(component, resolved, options);
  if (problems.length) throw new ParityError(resolved.name, 'react', problems);
}
