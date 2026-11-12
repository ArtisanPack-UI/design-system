/**
 * The theme helpers behind ThemeToggle (#65): choices, resolution against
 * the OS scheme, guarded storage, applying `data-theme`, the radio group's
 * keys (following the text direction, D-004) and the blocking head snippet.
 * Livewire UI Components' `ThemeScript` is tested against the same snippet.
 */
import {
  applyTheme,
  isThemeChoice,
  nextIconTheme,
  readThemeChoice,
  resolveTheme,
  storeThemeChoice,
  THEME_CHOICES,
  themeChoiceLabel,
  themeChoices,
  themeScript,
  themeToggleKey,
  themeToggleLabels,
  toThemeChoice,
} from '../src/theme';

const media = (dark: boolean) => () => ({ matches: dark });

class MemoryStorage {
  items = new Map<string, string>();
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

const blocked = {
  getItem(): string | null {
    throw new Error('SecurityError');
  },
  setItem(): void {
    throw new Error('QuotaExceededError');
  },
};

class FakeRoot {
  attributes = new Map<string, string>();
  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }
}

describe('theme choices', () => {
  it('knows the four choices, system last', () => {
    expect(THEME_CHOICES).toEqual(['light', 'dark', 'high-contrast', 'system']);
    expect(isThemeChoice('high-contrast')).toBe(true);
    expect(isThemeChoice('sepia')).toBe(false);
    expect(toThemeChoice('nope')).toBe('system');
    expect(toThemeChoice('nope', 'dark')).toBe('dark');
  });

  it('keeps offered choices in the canonical order, or offers all four', () => {
    expect(themeChoices(['system', 'light', 'bogus', 'dark'])).toEqual(['light', 'dark', 'system']);
    expect(themeChoices([])).toEqual(THEME_CHOICES);
    expect(themeChoices(undefined)).toEqual(THEME_CHOICES);
  });

  it('labels each choice, reading "Match system" in the menu', () => {
    const labels = themeToggleLabels({ systemLabel: 'Auto', nope: 'x' } as never);
    expect(themeChoiceLabel('system', labels)).toBe('Auto');
    expect(themeChoiceLabel('system', labels, true)).toBe('Match system');
    expect(themeChoiceLabel('high-contrast', labels)).toBe('High contrast');
  });
});

describe('resolving and applying', () => {
  it('resolves system against the OS scheme', () => {
    expect(resolveTheme('system', media(true))).toBe('dark');
    expect(resolveTheme('system', media(false))).toBe('light');
    expect(resolveTheme('system', undefined)).toBe('light');
    expect(resolveTheme('high-contrast', media(true))).toBe('high-contrast');
  });

  it('switches the icon toggle to light from dark, else to dark', () => {
    expect(nextIconTheme('dark')).toBe('light');
    expect(nextIconTheme('light')).toBe('dark');
    expect(nextIconTheme('high-contrast')).toBe('dark');
  });

  it('reads and stores the choice, ignoring unknown values', () => {
    const storage = new MemoryStorage();
    expect(readThemeChoice('apui-theme', storage)).toBeNull();
    expect(storeThemeChoice('dark', 'apui-theme', storage)).toBe(true);
    expect(readThemeChoice('apui-theme', storage)).toBe('dark');
    storage.setItem('apui-theme', '"dark"');
    expect(readThemeChoice('apui-theme', storage)).toBeNull();
  });

  it('survives blocked storage', () => {
    expect(readThemeChoice('apui-theme', blocked)).toBeNull();
    expect(storeThemeChoice('dark', 'apui-theme', blocked)).toBe(false);
    expect(readThemeChoice('apui-theme', undefined)).toBeNull();
  });

  it('sets data-theme to the resolved theme and stores the choice', () => {
    const root = new FakeRoot();
    const storage = new MemoryStorage();
    const theme = applyTheme('system', {
      root: root as unknown as Element,
      storage,
      matchMedia: media(true),
      storageKey: 'site-theme',
    });
    expect(theme).toBe('dark');
    expect(root.attributes.get('data-theme')).toBe('dark');
    expect(storage.getItem('site-theme')).toBe('system');

    applyTheme('high-contrast', { root: root as unknown as Element, storage, persist: false });
    expect(root.attributes.get('data-theme')).toBe('high-contrast');
    expect(storage.getItem('apui-theme')).toBeNull();
  });
});

describe('the segmented radio group keys', () => {
  const all = THEME_CHOICES;

  it('moves to the next and previous choice, wrapping', () => {
    expect(themeToggleKey('ArrowRight', 'light', all)).toBe('dark');
    expect(themeToggleKey('ArrowDown', 'light', all)).toBe('dark');
    expect(themeToggleKey('ArrowLeft', 'light', all)).toBe('system');
    expect(themeToggleKey('ArrowUp', 'system', all)).toBe('high-contrast');
    expect(themeToggleKey('ArrowRight', 'system', all)).toBe('light');
  });

  it('follows the text direction', () => {
    expect(themeToggleKey('ArrowLeft', 'light', all, 'rtl')).toBe('dark');
    expect(themeToggleKey('ArrowRight', 'light', all, 'rtl')).toBe('system');
    expect(themeToggleKey('ArrowDown', 'light', all, 'rtl')).toBe('dark');
  });

  it('jumps to the ends and ignores other keys', () => {
    expect(themeToggleKey('Home', 'system', all)).toBe('light');
    expect(themeToggleKey('End', 'light', all)).toBe('system');
    expect(themeToggleKey('Enter', 'light', all)).toBeNull();
    expect(themeToggleKey('ArrowRight', 'light', [])).toBeNull();
  });

  it('starts from the first offered choice when the current one is not offered', () => {
    expect(themeToggleKey('ArrowRight', 'high-contrast', ['light', 'dark', 'system'])).toBe('dark');
  });
});

describe('the head snippet', () => {
  /** Runs the snippet against a fake document, storage and media query. */
  function run(script: string, stored: string | null | Error, dark: boolean) {
    const root = new FakeRoot();
    const localStorage = {
      getItem() {
        if (stored instanceof Error) throw stored;
        return stored;
      },
    };
    const matchMedia = () => ({ matches: dark });
    new Function('document', 'localStorage', 'window', 'matchMedia', script)(
      { documentElement: root },
      localStorage,
      { matchMedia },
      matchMedia,
    );
    return root.attributes.get('data-theme');
  }

  it('is the exact snippet Livewire UI Components ships', () => {
    expect(themeScript()).toBe(
      '(function(){try{var c=null;try{c=localStorage.getItem("apui-theme")}catch(e){}' +
        'if(["light","dark","high-contrast","system"].indexOf(c)<0)c="system";' +
        'if(c==="system")c=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";' +
        'document.documentElement.setAttribute("data-theme",c)}catch(e){}})();',
    );
  });

  it('applies the stored choice, or the default resolved against the OS', () => {
    expect(run(themeScript(), 'high-contrast', true)).toBe('high-contrast');
    expect(run(themeScript(), 'system', true)).toBe('dark');
    expect(run(themeScript(), null, false)).toBe('light');
    expect(run(themeScript(), 'bogus', true)).toBe('dark');
    expect(run(themeScript({ defaultValue: 'dark' }), null, false)).toBe('dark');
  });

  it('falls back when storage is blocked', () => {
    expect(run(themeScript(), new Error('SecurityError'), true)).toBe('dark');
  });

  it('escapes the storage key for an inline script', () => {
    expect(themeScript({ storageKey: '</script>' })).toContain('"\\u003c/script>"');
  });
});
