/**
 * Types for the upgrade rules in `generated/upgrade-rules.json` and for what
 * a codemod reports.
 *
 * @packageDocumentation
 */

export type Stack = 'livewire' | 'react' | 'vue';

/** What happens to one 2.x prop, slot or event. */
export type MemberRule =
  /** Same meaning, new name. `values` maps literal values that changed too. */
  | { kind: 'rename'; to: string; values?: Record<string, string>; review?: boolean; note?: string }
  /** A flag becomes `to="value"`. */
  | { kind: 'value'; to: string; value: string; note?: string }
  /** The literal value decides the new name; values in `keep` stay as they are. */
  | {
      kind: 'split';
      cases: { values: string[]; to: string }[];
      keep?: string[];
      note?: string;
    }
  /** A negative flag becomes `to={false}`. */
  | { kind: 'invert'; to: string; note?: string }
  /** A per-part class prop joins the `classes` object under `part`. */
  | { kind: 'part-class'; to: string; part: string; note?: string }
  /**
   * Livewire only: the attribute moves to a component wrapped around the
   * element (`tooltip="…"` becomes a Tooltip with `content`).
   */
  | {
      kind: 'wrap';
      tag: string;
      to?: string;
      values?: Record<string, string>;
      set?: Record<string, string>;
      primary?: boolean;
      note?: string;
    }
  /** Livewire only: the attribute's text becomes the default slot of a self-closing tag. */
  | { kind: 'content'; note?: string }
  /** Deleted. */
  | { kind: 'remove'; note?: string }
  /** Left alone and reported: a person decides. */
  | { kind: 'manual'; note?: string };

/** An attribute a renamed component needs, such as `multiple` on a Combobox that was Tags. */
export interface AddedAttribute {
  name: string;
  /** Omitted for a boolean flag. */
  value?: string;
  /** Skipped when the element has this 2.x attribute. */
  unless?: string;
}

/** The rules for one 2.x component. */
export interface ComponentRule {
  /** The manifest it maps to. */
  canonical: string;
  /** Its name in the next major; the same name when only members changed. */
  to: string;
  /** The name stands, but every use needs a person: see `note`. */
  manual?: boolean;
  add?: AddedAttribute[];
  note?: string;
  props?: Record<string, MemberRule>;
  slots?: Record<string, MemberRule>;
  events?: Record<string, MemberRule>;
}

export interface StackRules {
  package: string;
  from: string;
  to: string;
  /** Keyed by the 2.x name: a Blade tag without `x-artisanpack-`, or a React or Vue export. */
  components: Record<string, ComponentRule>;
}

/** The raw DaisyUI classes to report, from the Phase 0 scanner. */
export interface ClassRules {
  /** Roots whose bare name and `root-*` modifiers are DaisyUI's. */
  component: string[];
  /** Roots that are also Tailwind utilities or common class names: warn only. */
  ambiguous: string[];
  /** Regular-expression sources. */
  patterns: Record<
    'lookalike' | 'themeBase' | 'themeContent' | 'themeSemantic' | 'themeVariable' | 'config',
    string
  >;
  rewrites: { pattern: string; attribute?: string; to?: string; note?: string }[];
}

export interface UpgradeRules {
  version: number;
  snapshot: Record<Stack, string>;
  stacks: Record<Stack, StackRules>;
  classes: ClassRules;
}

/**
 * - `rewrote`: changed, nothing to do.
 * - `review`: changed, and worth a look (an event's payload, a mapped value).
 * - `removed`: an attribute was deleted.
 * - `manual`: left alone; a person has to migrate it.
 * - `class`: a raw DaisyUI class or theme reference.
 */
export type FindingKind = 'rewrote' | 'review' | 'removed' | 'manual' | 'class';

/** One thing a codemod did or found. */
export interface Finding {
  kind: FindingKind;
  /** 1-based. */
  line: number;
  /** 1-based. */
  column: number;
  /** The 2.x component, when the finding is about one. */
  component?: string;
  /** The prop, slot, event or class. */
  member?: string;
  message: string;
}

/** The result of transforming one file. */
export interface TransformResult {
  /** The new source; the input when nothing changed. */
  code: string;
  changed: boolean;
  findings: Finding[];
}
