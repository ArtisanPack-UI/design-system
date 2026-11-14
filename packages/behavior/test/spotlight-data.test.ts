/**
 * Spotlight's data helpers (#57): untrusted results (a server's JSON,
 * stored recent choices) never keep an unsafe link, and labels are marked
 * for the query.
 */
import { highlightLabel, normalizeGroups, readRecents, recentKey } from '../src/widgets/spotlight';

describe('spotlight data', () => {
  it('drops javascript: and other unsafe links from results', () => {
    const [group] = normalizeGroups([
      { label: 'Evil', href: 'javascript:alert(1)' },
      { label: 'Spaced', href: '  java\tscript:alert(1)' },
      { label: 'Data', link: 'data:text/html,<script>alert(1)</script>' },
      { label: 'Page', href: '/reports' },
      { label: 'Mail', href: 'mailto:team@example.com' },
    ]);
    expect(group!.items.map((item) => item.href)).toEqual([
      undefined,
      undefined,
      undefined,
      '/reports',
      'mailto:team@example.com',
    ]);
    // Without a safe link, the value falls back to the label.
    expect(group!.items[0]!.value).toBe('Evil');
  });

  it('drops unsafe links from stored recent choices', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    };
    const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
    try {
      store.set(
        recentKey('s'),
        JSON.stringify([
          { value: 'x', label: 'Tampered', href: 'javascript:alert(document.cookie)' },
          { value: 'y', label: 'Fine', href: 'https://example.com' },
        ]),
      );
      expect(readRecents(recentKey('s')).map((item) => item.href)).toEqual([
        undefined,
        'https://example.com',
      ]);
    } finally {
      if (original) Object.defineProperty(globalThis, 'localStorage', original);
      else delete (globalThis as { localStorage?: unknown }).localStorage;
    }
  });

  it('marks every word of the query, ignoring case and accents', () => {
    expect(highlightLabel('Café Grove', 'cafe gro')).toEqual([
      { text: 'Café', match: true },
      { text: ' ', match: false },
      { text: 'Gro', match: true },
      { text: 've', match: false },
    ]);
    expect(highlightLabel('Reports', '')).toEqual([{ text: 'Reports', match: false }]);
  });
});
