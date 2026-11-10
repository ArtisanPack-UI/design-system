/**
 * The React fixture host. A component repo's fixture entry registers its
 * components; the gate runner bundles that entry into the fixture page.
 *
 * ```tsx
 * import { registerReactHost } from '@artisanpack-ui/testing/react-host';
 * import * as components from '../src';
 * registerReactHost(components);
 * ```
 */
import { type ComponentType, createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import type { FixtureHost, FixtureSheet } from '../types';

declare global {
  interface Window {
    apuiFixture?: FixtureHost;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- components take any props
export type ComponentRegistry = Record<string, ComponentType<any> | unknown>;

let root: Root | undefined;

/** Registers the components by their React name, such as `Button`. */
export function registerReactHost(components: ComponentRegistry): void {
  window.apuiFixture = {
    render(sheet: FixtureSheet, name: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see ComponentRegistry
      const component = components[name] as ComponentType<any> | undefined;
      if (!component) throw new Error(`No React component "${name}" is registered`);
      const container = document.getElementById('apui-fixture');
      if (!container) throw new Error('The fixture page has no #apui-fixture');
      root ??= createRoot(container);
      flushSync(() =>
        root!.render(
          sheet.cases.map((fixtureCase) =>
            createElement(
              'div',
              {
                key: fixtureCase.id,
                'data-apui-case': fixtureCase.id,
                'data-apui-state': fixtureCase.state,
              },
              createElement(component, fixtureCase.props, fixtureCase.content ?? undefined),
            ),
          ),
        ),
      );
    },
  };
}

export type { FixtureHost, FixtureSheet } from '../types';
