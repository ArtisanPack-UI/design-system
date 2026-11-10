import { validateManifest, validateManifests } from '../src/validate';
import type { ComponentManifest } from '../src/types';
import { button } from './helpers';

const messages = (data: unknown) =>
  validateManifest(data).errors.map((e) => `${e.path}: ${e.message}`);

describe('validateManifest', () => {
  it('accepts the Button sample', () => {
    expect(validateManifest(button())).toEqual({ valid: true, errors: [] });
  });

  describe('schema', () => {
    it('rejects unknown properties', () => {
      expect(messages({ ...button(), colour: 'red' })).toContain(': unknown property "colour"');
    });

    it('requires the core fields', () => {
      const m: Partial<ComponentManifest> = button();
      delete m.a11y;
      expect(validateManifest(m).valid).toBe(false);
    });

    it('requires values on enum props, and only on enum props', () => {
      const m = button();
      delete m.props[0]!.values;
      m.props[3]!.values = ['a'];
      const result = validateManifest(m);
      expect(result.valid).toBe(false);
      expect(result.errors.map((e) => e.path)).toEqual(
        expect.arrayContaining(['/props/0', '/props/3']),
      );
    });

    it('rejects a non-kebab event name and a non-apui token', () => {
      const m = button();
      m.events = [{ name: 'rowClick', description: 'x' }];
      m.tokens = ['--ap-button-radius'];
      expect(messages(m)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^\/events\/0\/name/),
          expect.stringMatching(/^\/tokens\/0/),
        ]),
      );
    });

    it('requires at least one a11y requirement', () => {
      const m = button();
      m.a11y.requirements = [];
      expect(validateManifest(m).valid).toBe(false);
    });
  });

  describe('vocabulary', () => {
    const cases: [string, (m: ComponentManifest) => void, RegExp][] = [
      ['a color outside the eight', (m) => m.colors!.push('purple'), /^\/colors\/8: "purple"/],
      ['a size outside the scale', (m) => m.sizes!.push('xxl'), /^\/sizes\/5: "xxl"/],
      [
        'a root class that does not match the name',
        (m) => (m.rootClass = 'apui-btn'),
        /^\/rootClass/,
      ],
      [
        'a renamed standard part',
        (m) => (m.parts[1]!.name = 'leadingIcon'),
        /renames the standard part "icon"/,
      ],
      ['a missing root part', (m) => (m.parts = m.parts.slice(1)), /must include the "root" part/],
      [
        'a duplicate prop',
        (m) => m.props.push({ ...m.props[0]! }),
        /^\/props: "variant" is listed more than once/,
      ],
      [
        'an enum default outside its values',
        (m) => (m.props[0]!.default = 'filled'),
        /^\/props\/0\/default/,
      ],
      [
        'a non-boolean default on a boolean prop',
        (m) => (m.props[3]!.default = 'no'),
        /needs a boolean default/,
      ],
      [
        'a no* boolean',
        (m) => m.props.push({ name: 'noIcon', type: 'boolean', description: 'x' }),
        /"noIcon" must be a positive adjective/,
      ],
      [
        'a with* boolean',
        (m) => m.props.push({ name: 'withArrows', type: 'boolean', description: 'x' }),
        /"withArrows"/,
      ],
      [
        'a physical prop value',
        (m) =>
          m.props.push({
            name: 'iconPosition',
            type: 'enum',
            values: ['left', 'right'],
            description: 'x',
          }),
        /"left" is physical/,
      ],
      [
        'a component missing a stack',
        (m) => (m.stacks.vue = false),
        /must ship in livewire, react and vue/,
      ],
      [
        'a prop limited to a stack the component skips',
        (m) => {
          m.name = 'ThemePreview';
          m.rootClass = 'apui-theme-preview';
          m.stacks.react = false;
          m.stacks.vue = false;
          m.props[0]!.stacks = ['react'];
        },
        /does not ship in react/,
      ],
    ];

    it.each(cases)('rejects %s', (_label, mutate, pattern) => {
      const m = button();
      mutate(m);
      const found = messages(m);
      expect(found.some((message) => pattern.test(message))).toBe(true);
    });

    it('allows a hide* boolean', () => {
      const m = button();
      m.props.push({ name: 'hideLabel', type: 'boolean', description: 'x' });
      expect(validateManifest(m).valid).toBe(true);
    });

    it('allows the D-003 Livewire-only exceptions', () => {
      const m = button();
      Object.assign(m, { name: 'ImageLibrary', rootClass: 'apui-image-library' });
      m.stacks.react = false;
      m.stacks.vue = false;
      expect(validateManifest(m).valid).toBe(true);
      m.stacks.vue = { name: 'ImageLibrary' };
      expect(messages(m)).toContain('/stacks: ImageLibrary ships in livewire only (D-003)');
    });

    it('requires RichTextEditor to record its differences in every stack', () => {
      const m = button();
      Object.assign(m, { name: 'RichTextEditor', rootClass: 'apui-rich-text-editor' });
      m.stacks.livewire = { name: 'rich-text-editor', differences: ['TinyMCE'] };
      m.stacks.react = { name: 'RichTextEditor', differences: ['Lighter editor'] };
      m.stacks.vue = { name: 'RichTextEditor' };
      expect(messages(m)).toEqual([
        '/stacks/vue/differences: RichTextEditor must record its differences (D-003)',
      ]);
    });
  });
});

describe('top-level lists and their props', () => {
  it.each([
    ['variants', 'variant'],
    ['sizes', 'size'],
    ['colors', 'color'],
  ] as const)('rejects %s that differ from the %s prop', (list, propName) => {
    const manifest = button();
    manifest[list] = manifest[list]!.slice(1);
    expect(validateManifest(manifest).errors).toContainEqual({
      path: `/${list}`,
      message: `must list the same values as the "${propName}" prop`,
    });
  });

  it('accepts the same values in another order', () => {
    const manifest = button();
    manifest.sizes = [...manifest.sizes!].reverse();
    expect(validateManifest(manifest).valid).toBe(true);
  });
});

describe('validateManifests', () => {
  it('rejects duplicate names and file names that do not match', () => {
    const result = validateManifests([
      { data: button(), file: 'Button.json' },
      { data: button(), file: 'Btn.json' },
    ]);
    expect(result.errors).toEqual([
      { path: 'Btn.json', message: 'Button is also defined in Button.json' },
      { path: 'Btn.json', message: 'file must be named Button.json' },
    ]);
  });

  it('prefixes errors with the file', () => {
    const result = validateManifests([
      { data: { ...button(), sizes: ['huge'] }, file: 'Button.json' },
    ]);
    expect(result.errors[0]!.path).toBe('Button.json/sizes/0');
  });
});
