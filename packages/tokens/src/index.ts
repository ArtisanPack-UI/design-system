/**
 * @artisanpack-ui/tokens
 *
 * Design tokens for the ArtisanPack UI Design System. The source is W3C DTCG
 * JSON in `tokens/`; this module is the typed map generated from it. The same
 * build writes the CSS custom properties (`@artisanpack-ui/tokens/css`) and a
 * PHP array (`@artisanpack-ui/tokens/php`).
 *
 * @packageDocumentation
 */
import { presetAttribute, presets } from './generated/presets';
import { axes, layer, prefix, tokens } from './generated/tokens';

export { axes, layer, prefix, presetAttribute, presets, tokens };
export type {
  PresetDefinition,
  PresetTokenDefinition,
  TokenAxisDefinition,
  TokenDefinition,
  TokenTier,
  TokenType,
} from './types';

/** A token path, such as `color.primary` or `space.4`. */
export type TokenPath = keyof typeof tokens;

/** A preset name, such as `ledger` or `harbor`. */
export type PresetName = keyof typeof presets;

/** A mode axis, such as `theme` or `density`. */
export type TokenAxis = keyof typeof axes;

/** The modes of an axis, such as `'light' | 'dark' | 'high-contrast'` for `theme`. */
export type TokenMode<A extends TokenAxis> = (typeof axes)[A]['modes'][number];

/**
 * Returns a `var()` reference to a token, for inline styles.
 *
 * @example cssVar('color.primary') // 'var(--apui-color-primary)'
 */
export function cssVar(path: TokenPath): string {
  return `var(${tokens[path].cssVar})`;
}
