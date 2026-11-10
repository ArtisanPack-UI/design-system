import lucide from '../icons/lucide.json';
import * as entry from '../src/index';
import {
  defaultIcons,
  iconNames,
  iconSvg,
  registerIcons,
  resetIcons,
  resolveIcon,
  UnsafeIconError,
} from '../src/icons';

afterEach(() => resetIcons());

describe('icon registry (D-017)', () => {
  it('ships the Lucide subset the components and fixtures use', () => {
    for (const name of ['plus', 'arrow-right', 'check', 'minus', 'chevron-down', 'circle-alert']) {
      expect(resolveIcon(name)).toMatch(/^<(path|circle|rect|line|polyline)/);
    }
    expect(Object.keys(defaultIcons)).not.toContain('$comment');
    expect(Object.keys(defaultIcons).sort()).toEqual(
      Object.keys(lucide)
        .filter((name) => !name.startsWith('$'))
        .sort(),
    );
  });

  it('keeps names in kebab-case so Blade, React and Vue spell them the same', () => {
    for (const name of iconNames()) expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('registers new icons and replaces existing ones', () => {
    registerIcons({ star: '<circle cx="12" cy="12" r="4" />', plus: '<path d="M1 1" />' });
    expect(resolveIcon('star')).toBe('<circle cx="12" cy="12" r="4" />');
    expect(resolveIcon('plus')).toBe('<path d="M1 1" />');
    resetIcons();
    expect(resolveIcon('star')).toBeUndefined();
    expect(resolveIcon('plus')).toBe(defaultIcons.plus);
  });

  it('renders a decorative 24x24 currentColor svg, or nothing for an unknown name', () => {
    const svg = iconSvg('check');
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('stroke-width="1.5"');
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).toContain(defaultIcons.check);
    expect(iconSvg('no-such-icon')).toBe('');
  });

  it.each([
    ['script', '<script>alert(1)</script>'],
    ['event handler', '<path d="M1 1" onload="alert(1)" />'],
    ['foreignObject', '<foreignObject><div>x</div></foreignObject>'],
    ['external use', '<use href="https://example.com/sprite.svg#x" />'],
    ['image', '<image href="x" />'],
    ['javascript url', '<path d="javascript:alert(1)" />'],
    ['style', '<style>*{}</style>'],
  ])('rejects unsafe markup: %s', (_label, body) => {
    expect(() => registerIcons({ bad: body })).toThrow(UnsafeIconError);
    expect(resolveIcon('bad')).toBeUndefined();
  });

  it('registers nothing when any body in the set is unsafe', () => {
    expect(() =>
      registerIcons({ good: '<circle cx="1" cy="1" r="1" />', bad: '<script></script>' }),
    ).toThrow(UnsafeIconError);
    expect(resolveIcon('good')).toBeUndefined();
  });

  it('shares one registry between the package entry and the icons entry', () => {
    entry.registerIcons({ shared: '<circle cx="2" cy="2" r="2" />' });
    expect(resolveIcon('shared')).toBe('<circle cx="2" cy="2" r="2" />');
  });
});
