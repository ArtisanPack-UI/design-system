/**
 * The states a component's fixtures render (#39, #40), derived from its
 * manifest so every stack renders the same matrix.
 */
import type { ComponentManifest } from './types';

/** Interaction states the gates force with the DevTools protocol, not with props. */
export const PSEUDO_STATES = ['hover', 'focus-visible', 'active'] as const;

/** Boolean props that are visual states. A fixture renders each one set to `true`. */
export const STATE_PROPS = [
  'disabled',
  'loading',
  'invalid',
  'readonly',
  'checked',
  'indeterminate',
  'selected',
  'open',
] as const;

/** Elements a keyboard or pointer user operates. */
export const INTERACTIVE_ELEMENTS = ['a', 'button', 'input', 'select', 'textarea', 'summary'];

/** ARIA widget roles: a component with one of these is operable. */
export const INTERACTIVE_ROLES = [
  'button',
  'checkbox',
  'combobox',
  'gridcell',
  'link',
  'listbox',
  'menu',
  'menubar',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'radiogroup',
  'scrollbar',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'tablist',
  'textbox',
  'tree',
  'treegrid',
  'treeitem',
];

/** Whether people operate the component, so it has hover, focus and active states. */
export function isInteractive(manifest: ComponentManifest): boolean {
  const { element, role } = manifest.a11y;
  return (
    (element !== undefined && INTERACTIVE_ELEMENTS.includes(element)) ||
    (role !== undefined && INTERACTIVE_ROLES.includes(role))
  );
}

/**
 * The states the fixtures render, after `default`: the manifest's
 * `fixture.states`, or the pseudo-states for interactive components plus every
 * state prop the component has.
 */
export function fixtureStates(manifest: ComponentManifest): string[] {
  if (manifest.fixture?.states) return [...manifest.fixture.states];
  const pseudo = isInteractive(manifest) ? [...PSEUDO_STATES] : [];
  const props = STATE_PROPS.filter((name) =>
    manifest.props.some((prop) => prop.name === name && prop.type === 'boolean'),
  );
  return [...pseudo, ...props];
}
