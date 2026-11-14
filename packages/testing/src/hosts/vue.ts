/**
 * The Vue fixture host. A component repo's fixture entry registers its
 * components; the gate runner bundles that entry into the fixture page.
 *
 * ```ts
 * import { registerVueHost } from '@artisanpack-ui/testing/vue-host';
 * import * as components from '../src';
 * registerVueHost(components);
 * ```
 */
import { type App, type Component, createApp, h, nextTick } from 'vue';

import type { FixtureHost, FixtureSheet } from '../types';

declare global {
  interface Window {
    apuiFixture?: FixtureHost;
  }
}

export type ComponentRegistry = Record<string, Component | unknown>;

let app: App | undefined;

/** The prop names a component declares, from its object or array `props` option. */
function declaredProps(component: Component): string[] {
  const props = (component as { props?: unknown }).props;
  if (Array.isArray(props)) return props.map(String);
  return props && typeof props === 'object' ? Object.keys(props) : [];
}

/**
 * A fixture's props as Vue binds them. The manifest's `value` is `modelValue`
 * on a component that declares it (as the parity checks read it), so the value
 * reaches the component instead of falling through to its root as an attribute.
 */
export function vueProps(
  component: Component,
  props: Record<string, unknown>,
): Record<string, unknown> {
  if (!('value' in props)) return props;
  const declared = declaredProps(component);
  if (!declared.includes('modelValue') || declared.includes('value')) return props;
  const { value, ...rest } = props;
  return { ...rest, modelValue: value };
}

/** Registers the components by their Vue name, such as `Button`. */
export function registerVueHost(components: ComponentRegistry): void {
  window.apuiFixture = {
    async render(sheet: FixtureSheet, name: string) {
      const component = components[name] as Component | undefined;
      if (!component) throw new Error(`No Vue component "${name}" is registered`);
      const container = document.getElementById('apui-fixture');
      if (!container) throw new Error('The fixture page has no #apui-fixture');
      app?.unmount();
      app = createApp({
        render: () =>
          sheet.cases.map((fixtureCase) =>
            h(
              'div',
              {
                key: fixtureCase.id,
                'data-apui-case': fixtureCase.id,
                'data-apui-state': fixtureCase.state,
              },
              [
                h(
                  component,
                  vueProps(component, fixtureCase.props),
                  fixtureCase.content === null ? undefined : { default: () => fixtureCase.content },
                ),
              ],
            ),
          ),
      });
      app.mount(container);
      await nextTick();
    },
  };
}

export type { FixtureHost, FixtureSheet } from '../types';
