/**
 * Build configuration shared by the loader and the output formats.
 */

/** Prefix for every custom property (D-002). */
export const PREFIX = 'apui';

/** The cascade layer the CSS output sits in (D-002, #21). */
export const LAYER = 'apui.tokens';

/** Tiers, in dependency order: a tier may only reference its own tier or earlier ones. */
export const TIERS = ['primitive', 'semantic', 'component'];

/**
 * Mode axes. Each axis is a directory under `tokens/modes/` holding one file
 * per mode, and an attribute that switches it on any element. The default mode
 * also applies at `:root`.
 */
export const AXES = {
  theme: {
    attribute: 'data-theme',
    default: 'light',
    modes: ['light', 'dark', 'high-contrast'],
  },
  density: {
    attribute: 'data-density',
    default: 'default',
    modes: ['compact', 'default', 'comfortable'],
  },
};
