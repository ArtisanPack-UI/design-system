import { diffManifests, formatChanges } from '../src/diff';
import { button } from './helpers';

describe('diffManifests', () => {
  it('finds nothing between identical manifests', () => {
    expect(diffManifests(button(), button())).toEqual([]);
  });

  it('diffs named items by name, not position', () => {
    const after = button();
    after.props.reverse();
    after.parts.reverse();
    expect(diffManifests(button(), after)).toEqual([]);
  });

  it('marks removals and changed defaults as breaking', () => {
    const after = button();
    after.props = after.props.filter((p) => p.name !== 'href');
    after.props[0]!.default = 'soft';
    after.props[2]!.values = ['sm', 'md', 'lg'];
    after.parts = after.parts.filter((p) => p.name !== 'spinner');
    after.stacks.vue = false;
    const changes = diffManifests(button(), after);
    const byPath = Object.fromEntries(changes.map((c) => [`${c.kind} ${c.path}`, c.breaking]));
    expect(byPath).toMatchObject({
      'removed props.href': true,
      'changed props.variant.default': true,
      'removed props.size.values': true,
      'removed parts.spinner': true,
      'removed stacks.vue': true,
    });
    expect(changes.filter((c) => c.path === 'props.size.values').map((c) => c.before)).toEqual([
      'xs',
      'xl',
    ]);
  });

  it('marks additions as non-breaking, except a required prop', () => {
    const after = button();
    after.props.push({ name: 'tooltip', type: 'string', description: 'x' });
    after.props.push({ name: 'label', type: 'string', description: 'x', required: true });
    after.events = [{ name: 'press', description: 'x' }];
    const changes = diffManifests(button(), after);
    expect(changes.map((c) => [c.path, c.breaking])).toEqual([
      ['props.tooltip', false],
      ['props.label', true],
      ['events.press', false],
    ]);
  });

  it('records renames, deprecations and description updates', () => {
    const after = button();
    after.stacks.livewire = { name: 'btn' };
    after.props[6]!.deprecated = 'Use the anchor slot.';
    after.props[5]!.description = 'Turns the button off.';
    const changes = diffManifests(button(), after);
    expect(changes.map((c) => [c.path, c.breaking, c.message])).toEqual([
      ['stacks.livewire.name', true, 'Renamed in livewire from `button` to `btn`.'],
      ['props.disabled.description', false, 'Updated the description of prop `disabled`.'],
      ['props.href.deprecated', false, 'Deprecated prop `href`: Use the anchor slot.'],
    ]);
  });
});

describe('formatChanges', () => {
  it('groups breaking and other changes as Markdown', () => {
    const after = button();
    after.props = after.props.filter((p) => p.name !== 'href');
    after.slots!.push({ name: 'label', description: 'x' });
    expect(formatChanges(diffManifests(button(), after), { component: 'Button' })).toBe(
      [
        '## Button',
        '',
        '### Breaking changes',
        '',
        '- Removed prop `href`.',
        '',
        '### Other changes',
        '',
        '- Added slot `label`.',
        '',
      ].join('\n'),
    );
  });

  it('says when nothing changed', () => {
    expect(formatChanges([], { component: 'Button' })).toBe('## Button\n\nNo API changes.\n');
  });
});
