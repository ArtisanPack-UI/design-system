/**
 * Stylelint for the design system's CSS (#21). Enforces the apui namespace and
 * cascade layers (D-002) and logical properties (D-004). See
 * contributing/css-conventions.md.
 *
 * A physical property needs a described exception, which stylelint checks:
 *   /* stylelint-disable-next-line property-disallowed-list -- why *\/
 */
const SIDES = '(left|right|top|bottom)';

export default {
  plugins: ['./tools/stylelint/apui-plugin.mjs'],
  reportDescriptionlessDisables: true,
  reportNeedlessDisables: true,
  reportInvalidScopeDisables: true,
  rules: {
    'apui/layer': true,
    'apui/mirror-safe-shorthand': true,
    'selector-class-pattern': [
      '^apui-[a-z0-9]+(-[a-z0-9]+)*$',
      {
        message: (selector) =>
          `Class "${selector}" must use the apui- prefix in kebab-case (D-002)`,
      },
    ],
    'custom-property-pattern': [
      '^apui-_?[a-z0-9]+(-[a-z0-9]+)*$',
      { message: (name) => `Custom property "--${name}" must use the --apui- prefix (D-002)` },
    ],
    'declaration-no-important': [
      true,
      { message: 'Do not use !important: the cascade layers make it unnecessary' },
    ],
    'property-disallowed-list': [
      [
        new RegExp(`^(margin|padding|scroll-margin|scroll-padding)-${SIDES}$`),
        new RegExp(`^border-${SIDES}(-(width|style|color))?$`),
        new RegExp('^border-(top|bottom)-(left|right)-radius$'),
        new RegExp(`^${SIDES}$`),
        /^overscroll-behavior-[xy]$/,
      ],
      { message: (prop) => `"${prop}" is physical. Use the logical property (D-004)` },
    ],
    'declaration-property-value-disallowed-list': [
      { '/^(float|clear|text-align|caption-side)$/': ['/\\b(left|right)\\b/'] },
      { message: (prop, value) => `"${prop}: ${value}" is physical. Use start or end (D-004)` },
    ],
  },
  overrides: [
    {
      // Dev apps such as the token playground (#29) are pages, not the
      // library: they keep logical properties but have their own class names
      // and no cascade layers.
      files: ['apps/**/*.css'],
      rules: {
        'apui/layer': null,
        'selector-class-pattern': [
          '^pg-[a-z0-9]+(-[a-z0-9]+)*$|^apui-[a-z0-9]+(-[a-z0-9]+)*$',
          {
            message: (selector) =>
              `Class "${selector}" must use the pg- or apui- prefix in kebab-case`,
          },
        ],
      },
    },
  ],
};
