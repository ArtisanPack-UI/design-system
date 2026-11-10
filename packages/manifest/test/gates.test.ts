/**
 * What the quality gates read from a manifest: the accessibility rules (#40),
 * the fixture block and derived states (#39), the docs tables and the
 * examples next to the manifest (#43).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { docsTables } from '../src/docs';
import { checkExamples, examplesDir, loadExamples } from '../src/examples';
import { fixtureStates, isInteractive } from '../src/fixture';
import { loadManifests } from '../src/load';
import { validateManifest } from '../src/validate';
import { button } from './helpers';

const root = join(__dirname, '..');
const messages = (data: unknown) =>
  validateManifest(data).errors.map((e) => `${e.path}: ${e.message}`);

describe('a11y rules', () => {
  it('rejects criteria outside WCAG 2.2 A and AA', () => {
    const m = button();
    m.a11y.wcag = ['2.4.7', '1.4.6', '4.1.1'];
    expect(messages(m)).toEqual([
      '/a11y/wcag/1: "1.4.6" is not a WCAG 2.2 level A or AA success criterion',
      '/a11y/wcag/2: "4.1.1" is not a WCAG 2.2 level A or AA success criterion',
      '/a11y/wcag: an interactive component must cite 2.1.1',
    ]);
  });

  it('requires keyboard interactions, 2.1.1 and 2.4.7 for interactive components', () => {
    const m = button();
    delete m.a11y.keyboard;
    m.a11y.wcag = ['1.4.3'];
    expect(messages(m)).toEqual([
      '/a11y/keyboard: an interactive component must list its keyboard interactions',
      '/a11y/wcag: an interactive component must cite 2.1.1',
      '/a11y/wcag: an interactive component must cite 2.4.7',
    ]);
  });

  it('treats a widget role as interactive and a plain element as not', () => {
    const m = button();
    delete m.a11y.element;
    m.a11y.role = 'tab';
    expect(isInteractive(m)).toBe(true);
    m.a11y.role = 'status';
    expect(isInteractive(m)).toBe(false);
    delete m.a11y.keyboard;
    expect(validateManifest(m).valid).toBe(true);
  });

  it("requires a11y.element to be the root part's element", () => {
    const m = button();
    m.a11y.element = 'div';
    expect(messages(m)).toContain(
      '/a11y/element: "div" is not the root part\'s element (button | a)',
    );
  });

  it('requires an RTL requirement when ArrowLeft or ArrowRight do something', () => {
    const m = button();
    m.a11y.keyboard!.push({ keys: 'ArrowLeft / ArrowRight', action: 'Moves between buttons.' });
    expect(messages(m)).toEqual([
      '/a11y/requirements: ArrowLeft and ArrowRight must follow the text direction: add an RTL requirement (D-004)',
    ]);
    m.a11y.requirements.push('Arrow keys follow the text direction: reversed in RTL.');
    expect(validateManifest(m).valid).toBe(true);
  });
});

describe('fixture block', () => {
  it('accepts the Button fixture', () => {
    expect(button().fixture).toBeDefined();
    expect(validateManifest(button()).valid).toBe(true);
  });

  it('rejects unknown props, bad values and unknown states', () => {
    const m = button();
    m.fixture = {
      props: { tone: 'loud', variant: 'giant' },
      parts: { loading: 'yes' },
      states: ['hover', 'pressed'],
    };
    expect(messages(m)).toEqual([
      '/fixture/props/tone: "tone" is not a prop of Button',
      '/fixture/props/variant: "giant" is not one of the prop\'s values',
      '/fixture/parts/loading: a boolean prop needs a boolean',
      '/fixture/states/1: "pressed" is neither a pseudo-state (hover, focus-visible, active) nor a boolean prop',
    ]);
  });

  it('rejects unknown keys', () => {
    const m = button();
    (m.fixture as Record<string, unknown>).theme = 'dark';
    expect(messages(m)).toContain('/fixture: unknown property "theme"');
  });

  it('derives pseudo-states for interactive components and every state prop', () => {
    expect(fixtureStates(button())).toEqual([
      'hover',
      'focus-visible',
      'active',
      'disabled',
      'loading',
    ]);
    const quiet = button();
    quiet.a11y = { role: 'status', requirements: ['Announces politely.'] };
    expect(fixtureStates(quiet)).toEqual(['disabled', 'loading']);
  });

  it('uses the states the manifest lists instead', () => {
    const m = button();
    m.fixture = { states: ['focus-visible', 'disabled'] };
    expect(fixtureStates(m)).toEqual(['focus-visible', 'disabled']);
  });
});

describe('docsTables', () => {
  it('spells props and events per stack', () => {
    const m = button();
    m.events = [
      { name: 'value-change', description: 'Value changed.' },
      { name: 'row-click', description: 'A row was clicked.', payload: '{ row }' },
    ];
    const livewire = docsTables(m, 'livewire');
    expect(livewire.props.find((p) => p.name === 'icon-only')).toMatchObject({
      type: 'boolean',
      typeLabel: 'boolean',
      default: false,
    });
    expect(livewire.props[0]).toMatchObject({
      name: 'variant',
      typeLabel: "'solid' | 'soft' | 'outline' | 'ghost' | 'link'",
      default: 'solid',
      required: false,
    });
    expect(livewire.events.map((e) => e.name)).toEqual(['wire:model', 'row-click']);
    expect(docsTables(m, 'react').events.map((e) => e.name)).toEqual([
      'onValueChange',
      'onRowClick',
    ]);
    expect(docsTables(m, 'vue').events.map((e) => e.name)).toEqual([
      'update:modelValue',
      'row-click',
    ]);
    expect(docsTables(m, 'react').props.map((p) => p.name)).toContain('iconOnly');
  });

  it('leaves out props for other stacks and is empty where it does not ship', () => {
    const m = button();
    m.props[3]!.stacks = ['react'];
    expect(docsTables(m, 'vue').props.map((p) => p.name)).not.toContain('iconOnly');
    m.stacks.vue = false;
    expect(docsTables(m, 'vue')).toEqual({
      stack: 'vue',
      props: [],
      parts: [],
      slots: [],
      events: [],
    });
  });
});

describe('examples', () => {
  it('lists the Button examples with a source per stack', () => {
    const examples = loadExamples('Button');
    expect(examples.map((e) => e.id)).toEqual(['basic', 'variants', 'sizes', 'states']);
    for (const example of examples) {
      expect(Object.keys(example.files).sort()).toEqual(['livewire', 'react', 'vue']);
    }
    expect(loadExamples('Nope')).toEqual([]);
  });

  it('checks every manifest with examples, and every example folder has a manifest', () => {
    const manifests = loadManifests();
    for (const manifest of manifests) expect(checkExamples(manifest)).toEqual([]);
    const names = manifests.map((m) => m.name);
    for (const folder of readdirSync(examplesDir)) expect(names).toContain(folder);
  });

  it('rejects names and ids that could leave the examples folder', () => {
    expect(() => loadExamples('../manifest')).toThrow('"../manifest" is not a component name');
    const dir = mkdtempSync(join(tmpdir(), 'apui-examples-'));
    mkdirSync(join(dir, 'Button'));
    writeFileSync(
      join(dir, 'Button', 'examples.json'),
      JSON.stringify([{ id: '../x', title: 't', description: 'd' }]),
    );
    expect(() => loadExamples('Button', dir)).toThrow('must be kebab-case');
    writeFileSync(join(dir, 'Button', 'examples.json'), '{}');
    expect(() => loadExamples('Button', dir)).toThrow('must be a JSON array');
    for (const entry of [{ title: 't', description: 'd' }, { id: true }, null]) {
      writeFileSync(join(dir, 'Button', 'examples.json'), JSON.stringify([entry]));
      expect(() => loadExamples('Button', dir)).toThrow('must be kebab-case');
    }
    writeFileSync(
      join(dir, 'Button', 'examples.json'),
      JSON.stringify([{ id: 'basic', title: 't', description: 1 }]),
    );
    expect(() => loadExamples('Button', dir)).toThrow('needs a string description');
  });

  it('returns the same keys as the PHP reader', () => {
    const dir = mkdtempSync(join(tmpdir(), 'apui-examples-'));
    mkdirSync(join(dir, 'Button'));
    writeFileSync(
      join(dir, 'Button', 'examples.json'),
      JSON.stringify([{ id: 'a', title: 't', description: 'd', extra: 1 }]),
    );
    expect(Object.keys(loadExamples('Button', dir)[0]!)).toEqual([
      'id',
      'title',
      'description',
      'files',
    ]);
  });

  it('reports missing, extra and unlisted sources', () => {
    const dir = mkdtempSync(join(tmpdir(), 'apui-examples-'));
    mkdirSync(join(dir, 'Button'));
    writeFileSync(
      join(dir, 'Button', 'examples.json'),
      JSON.stringify([
        { id: 'basic', title: 'Basic', description: 'x' },
        { id: 'Bad', title: 'x', description: 'x' },
        { id: 'basic', title: '', description: 'x' },
      ]),
    );
    for (const file of ['basic.blade.php', 'basic.tsx', 'basic.vue', 'stray.vue']) {
      writeFileSync(join(dir, 'Button', file), '');
    }
    const m = button();
    m.stacks.vue = false;
    expect(checkExamples(m, dir)).toEqual([
      "Button: basic.vue exists but Button doesn't ship in vue (D-003)",
      'Button: example 1: id must be kebab-case',
      'Button: example 2: "basic" is listed more than once',
      'Button: example 2 (basic): title is required',
      "Button: basic.vue exists but Button doesn't ship in vue (D-003)",
      "Button: stray.vue isn't listed in examples.json",
    ]);
  });
});

const hasPhp = (() => {
  try {
    execFileSync('php', ['-v'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

describe('PHP twins', () => {
  it.skipIf(!hasPhp)('ManifestDocs, eventName and Examples match TypeScript', () => {
    const script = `
      foreach ( [ 'ComponentManifest', 'ManifestRepository', 'ManifestDocs', 'Examples' ] as $class ) {
        require ${JSON.stringify(join(root, 'php'))} . "/{$class}.php";
      }
      use ArtisanPackUI\\DesignSystem\\Manifest\\{ComponentManifest, ManifestDocs, ManifestRepository, Examples};
      $data = json_decode( stream_get_contents( STDIN ), true );
      $m = ComponentManifest::fromArray( $data );
      $examples = new Examples();
      echo json_encode( [
        'tables' => array_map( fn ( $s ) => ManifestDocs::tables( $m, $s ), ComponentManifest::STACKS ),
        'examples' => $examples->for( 'Button' ),
        'components' => $examples->components(),
        'kebab' => [ ComponentManifest::kebab( 'iconOnly' ), ComponentManifest::kebab( 'ButtonGroup' ) ],
      ] );
    `;
    const m = button();
    m.events = [
      { name: 'value-change', description: 'Value changed.' },
      { name: 'row-click', description: 'A row was clicked.', payload: '{ row }' },
    ];
    m.slots![0]!.scoped = true;
    m.stacks.vue = false;
    const output = JSON.parse(
      execFileSync('php', ['-r', script], { input: JSON.stringify(m), encoding: 'utf8' }),
    );
    expect(output.tables).toEqual(
      (['livewire', 'react', 'vue'] as const).map((stack) => docsTables(m, stack)),
    );
    expect(output.examples).toEqual(loadExamples('Button'));
    expect(output.components).toEqual(['Button']);
    expect(output.kebab).toEqual(['icon-only', 'button-group']);
  });
});
