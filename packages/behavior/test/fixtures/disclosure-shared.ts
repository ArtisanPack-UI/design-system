/** What the Accordion and Collapse fixtures (React, Vue) share with the Alpine tests. */
export interface DisclosureFixture {
  widget: 'accordion' | 'collapse';
  /** `controlled`: the parent owns the state. `uncontrolled`: `defaultValue` / `defaultOpen`. */
  mode: 'controlled' | 'uncontrolled';
  multiple?: boolean;
  /** Accordion: the open items at first. */
  initial?: string[];
  /** Collapse: open at first. */
  open?: boolean;
  variant?: 'section' | 'read-more';
}

/** [value, title, disabled] */
export const ITEMS: [string, string, boolean][] = [
  ['live', 'How long does a listing stay live?', false],
  ['owners', 'Can co-owners edit a listing?', false],
  ['files', 'Which file types can I upload?', true],
  ['fees', 'Are there any fees?', false],
];

export const ACCORDION_IDS = {
  root: 'faq',
  item: (value: string) => `item-${value}`,
  itemTrigger: (value: string) => `trigger-${value}`,
  itemContent: (value: string) => `content-${value}`,
};

export const COLLAPSE_IDS = { root: 'more', trigger: 'more-trigger', content: 'more-content' };

export interface DisclosureFixtureApi {
  mount(options: DisclosureFixture): void;
  /** Sets the parent's state, as a parent re-rendering with a new prop does. */
  set(value: string[] | boolean): void;
  /** The shown state. */
  value?: string[] | boolean;
  events: [string, unknown][];
}

export function installDisclosure(
  api: Pick<DisclosureFixtureApi, 'mount' | 'set'>,
): DisclosureFixtureApi {
  const fixture: DisclosureFixtureApi = { ...api, events: [] };
  (window as unknown as { disclosureFixture: DisclosureFixtureApi }).disclosureFixture = fixture;
  return fixture;
}
