import expectations from './reference/parity-expectations.json';
import { checkParity, normalizeMarkup, ParityError, sampleValue } from '../src/parity';
import { checkReactParity, expectReactParity } from '../src/react';
import { checkVueParity, declaredVueApi, expectVueParity } from '../src/vue';
import { manifestsDir, probe } from './helpers';
import { BrokenProbe as ReactBroken, Probe as ReactProbe } from './reference/react/Probe';
import { BrokenProbe as VueBroken, Probe as VueProbe } from './reference/vue/Probe';

const declared = (stack: string) =>
  expectations.declared.map((line) => line.replace('{stack}', stack));

describe('React', () => {
  it('passes the reference Probe', async () => {
    expect(await checkReactParity(ReactProbe, probe())).toEqual([]);
    await expectReactParity(ReactProbe, 'Probe', { manifests: manifestsDir });
  });

  it('reports every drift in BrokenProbe', async () => {
    expect(await checkReactParity(ReactBroken, probe())).toEqual(expectations.rendered);
  });

  it('checks declared props and events when given them', async () => {
    const problems = await checkReactParity(ReactBroken, probe(), {
      declared: {
        props: ['variant', 'color', 'size', 'disabled', 'tone'],
        events: ['onClick'],
      },
    });
    expect(problems).toEqual([
      ...expectations.rendered,
      'prop loading: not declared by the react component',
      'prop leadingIcon: not declared by the react component',
      'prop tone: declared but not in the manifest',
      'event onPress: not emitted by the react component',
      'event onClick: emitted but not in the manifest',
    ]);
  });

  it('throws a ParityError listing the problems', async () => {
    const error = await expectReactParity(ReactBroken, probe()).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ParityError);
    expect((error as ParityError).message).toContain('Probe (react) drifts from its manifest:');
    expect((error as ParityError).problems).toEqual(expectations.rendered);
  });

  it('skips a stack the component does not ship in (D-003)', async () => {
    const m = probe();
    m.stacks.react = false;
    expect(await checkReactParity(ReactBroken, m)).toEqual([]);
  });
});

describe('Vue', () => {
  it('passes the reference Probe, including its props and emits', async () => {
    expect(declaredVueApi(VueProbe)).toEqual({
      props: ['variant', 'color', 'size', 'disabled', 'loading', 'leadingIcon'],
      events: ['press'],
    });
    expect(await checkVueParity(VueProbe, probe())).toEqual([]);
    await expectVueParity(VueProbe, 'Probe', { manifests: manifestsDir });
  });

  it('reports every drift in BrokenProbe, the same as the other stacks', async () => {
    expect(await checkVueParity(VueBroken, probe())).toEqual([
      ...expectations.rendered,
      ...declared('vue'),
    ]);
  });

  it('ignores declared names that are internal', async () => {
    const problems = await checkVueParity(VueBroken, probe(), {
      ignoreDeclared: ['tone', 'click'],
    });
    expect(problems).not.toContain('prop tone: declared but not in the manifest');
    expect(problems).not.toContain('event click: emitted but not in the manifest');
  });
});

describe('checkParity', () => {
  const button = (html: string) => () => html;

  it('reports a missing root first and stops', async () => {
    expect(await checkParity(probe(), 'react', button('<div></div>'))).toEqual([
      'root: no element with class "apui-probe"',
    ]);
  });

  it('reports the wrong root element and a missing default', async () => {
    const problems = await checkParity(
      probe(),
      'react',
      (props) =>
        `<div class="apui-probe" data-variant="${props.variant ?? ''}" data-size="${props.size ?? 'md'}" data-color="${props.color ?? 'primary'}"></div>`,
    );
    expect(problems.slice(0, 2)).toEqual([
      'root: renders <div>, expected button',
      'prop variant: the default renders data-variant="", expected data-variant="solid"',
    ]);
  });

  it('exempts props from the effect check', async () => {
    const problems = await checkReactParity(ReactBroken, probe(), {
      ignoreEffects: ['leadingIcon'],
    });
    expect(problems).not.toContain('prop leadingIcon: has no effect on the markup');
  });

  it('samples from the fixture parts, then by type', () => {
    const m = probe();
    expect(sampleValue(m.props[5]!, m)).toBe('star');
    expect(sampleValue(m.props[0]!, m)).toBe('outline');
    expect(sampleValue(m.props[3]!, m)).toBe(true);
    expect(sampleValue({ name: 'classes', type: 'object', description: '' }, m)).toEqual({
      root: 'apui-parity-sample',
    });
  });
});

describe('review fixes', () => {
  const probeMarkup = (props: Record<string, unknown>) =>
    `<button class="apui-probe" data-variant="${props.variant ?? 'solid'}" data-color="${props.color ?? 'primary'}" data-size="${props.size ?? 'md'}"${props.disabled ? ' disabled' : ''}${props.loading ? ' aria-busy="true"' : ''}>` +
    `${props.leadingIcon ? '<span data-scope="probe" data-part="icon"></span>' : ''}<span data-scope="probe" data-part="label">Probe</span>${props.loading ? '<span data-scope="probe" data-part="spinner"></span>' : ''}</button>`;

  it('reports a root that disappears with the parts props', async () => {
    const problems = await checkParity(probe(), 'react', (props) =>
      props.loading && props.leadingIcon ? '<p>crashed</p>' : probeMarkup(props),
    );
    expect(problems).toContain(
      'root: no element with class "apui-probe" with the fixture\'s parts props',
    );
  });

  it("matches Zag's kebab-case part names to the manifest's camelCase ones (D-019)", async () => {
    const manifest = probe();
    manifest.parts = manifest.parts.map((part) =>
      part.name === 'label' ? { ...part, name: 'itemText' } : part,
    );
    const as = (name: string) => (props: Record<string, unknown>) =>
      probeMarkup(props).replace('data-part="label"', `data-part="${name}"`);
    expect(await checkParity(manifest, 'react', as('item-text'))).toEqual([]);
    expect(await checkParity(manifest, 'react', as('itemText'))).toEqual([]);
    expect(await checkParity(manifest, 'react', as('item-label'))).toEqual([
      'part itemText: missing [data-scope="probe"][data-part="itemText"]',
      'part item-label: rendered but not in the manifest',
    ]);
  });

  it("finds parts outside the root, such as an overlay's trigger (D-019)", async () => {
    const problems = await checkParity(probe(), 'react', (props) => {
      const markup = probeMarkup(props);
      const icon = '<span data-scope="probe" data-part="icon"></span>';
      // The icon moves out of the root, as a dialog's trigger sits outside its panel.
      return markup.includes(icon) ? `${icon}${markup.replace(icon, '')}` : markup;
    });
    expect(problems).toEqual([]);
  });

  it('ignores a root with data-scope but no data-part', async () => {
    const problems = await checkParity(probe(), 'react', (props) =>
      probeMarkup(props).replace('class="apui-probe"', 'class="apui-probe" data-scope="probe"'),
    );
    expect(problems).toEqual([]);
  });

  it('counts a same-named attribute on an inner element as an effect, but not root fallthrough', async () => {
    const withInner = await checkParity(probe(), 'react', (props) =>
      probeMarkup(props)
        .replace(
          '<span data-scope="probe" data-part="label">',
          `<span data-scope="probe" data-part="label"${props.leadingIcon ? ` leadingicon="${props.leadingIcon}"` : ''}>`,
        )
        .replace(/<span data-scope="probe" data-part="icon"><\/span>/, ''),
    );
    expect(withInner).not.toContain('prop leadingIcon: has no effect on the markup');

    const fallthrough = await checkParity(probe(), 'react', (props) =>
      probeMarkup({ ...props, leadingIcon: undefined }).replace(
        'class="apui-probe"',
        `class="apui-probe"${props.leadingIcon ? ` leadingicon="${props.leadingIcon}"` : ''}`,
      ),
    );
    expect(fallthrough).toContain('prop leadingIcon: has no effect on the markup');
  });
});

describe('normalizeMarkup', () => {
  it('ignores attribute order, whitespace and generated ids', () => {
    expect(normalizeMarkup('<b  id="«r1»" class="x" aria-controls="«r2»">a\n  b</b>')).toBe(
      normalizeMarkup('<b class="x" aria-controls="v-3" id="v-9">a b</b>'),
    );
    expect(normalizeMarkup('<b class="x"></b>')).not.toBe(normalizeMarkup('<b class="y"></b>'));
  });
});
