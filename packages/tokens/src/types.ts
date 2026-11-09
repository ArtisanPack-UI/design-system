/**
 * Types for the generated token map.
 *
 * @packageDocumentation
 */

/** DTCG types the token source uses. */
export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow';

/** Token tiers. Components read semantic and component tokens, never primitives. */
export type TokenTier = 'primitive' | 'semantic' | 'component';

/** A mode axis, such as theme or density. */
export interface TokenAxisDefinition {
  /** The attribute that switches the axis on any element, such as `data-theme`. */
  readonly attribute: string;
  /** The mode that also applies at `:root`. */
  readonly default: string;
  /** Every mode, in output order. */
  readonly modes: readonly string[];
}

/** One token in the generated map. */
export interface TokenDefinition {
  /** The custom property, such as `--apui-color-primary`. */
  readonly cssVar: string;
  readonly type: TokenType;
  readonly tier: TokenTier;
  /** The axis whose mode files define this token, or `null` for a token with one value. */
  readonly axis: string | null;
  /** The axis this token's value varies by, directly or through an alias, or `null`. */
  readonly varies: string | null;
  /** CSS value with aliases as `var()`: one string, or one per mode of `axis`. */
  readonly value: string | Readonly<Record<string, string>>;
  /** Fully resolved CSS value: one string, or one per mode of `varies`. */
  readonly resolved: string | Readonly<Record<string, string>>;
}
