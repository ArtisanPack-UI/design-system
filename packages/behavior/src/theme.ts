/**
 * Theme choice (#65): the helpers behind ThemeToggle in every stack. A choice
 * is one of the token themes (`light`, `dark`, `high-contrast`) or `system`,
 * which follows `prefers-color-scheme` live. Applying a choice sets
 * `data-theme` on the root element, the same attribute the tokens switch on
 * (docs/tokens, Modes); the reset sets the native `color-scheme` from it.
 *
 * The choice persists in `localStorage` (guarded: private windows and blocked
 * storage fall back to the default) and is applied before first paint by the
 * blocking snippet {@link themeScript} returns, so there's no flash. Livewire
 * UI Components ships the same snippet (`ThemeScript`); keep the two in step.
 */

/** A theme the tokens define, set as `data-theme`. */
export type Theme = 'light' | 'dark' | 'high-contrast';

/** What a person can choose: a theme, or `system` to follow the OS. */
export type ThemeChoice = Theme | 'system';

/** Every choice, in the order the toggles offer them. */
export const THEME_CHOICES: readonly ThemeChoice[] = ['light', 'dark', 'high-contrast', 'system'];

/** The default choice. */
export const DEFAULT_THEME_CHOICE: ThemeChoice = 'system';

/** The `localStorage` key the choice persists under. */
export const THEME_STORAGE_KEY = 'apui-theme';

/** The attribute the tokens switch themes on. */
export const THEME_ATTRIBUTE = 'data-theme';

/**
 * The attribute that records the choice behind `data-theme` (so `system`, not
 * the `light` or `dark` it resolved to). The head snippet and
 * {@link applyTheme} set it; a toggle with nothing stored starts on it.
 */
export const THEME_CHOICE_ATTRIBUTE = 'data-theme-choice';

/** The window event every toggle on the page hears when a choice is applied. */
export const THEME_CHANGE_EVENT = 'apui-theme-change';

/** The media query `system` follows. */
export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** The registry icon of each choice. */
export const THEME_ICONS: Readonly<Record<ThemeChoice, string>> = {
  light: 'sun',
  dark: 'moon',
  'high-contrast': 'contrast',
  system: 'monitor',
};

/** The built-in strings, by key; the components expose one `*Label` prop each. */
export const THEME_TOGGLE_LABELS = {
  label: 'Theme',
  lightLabel: 'Light',
  darkLabel: 'Dark',
  highContrastLabel: 'High contrast',
  systemLabel: 'System',
  matchSystemLabel: 'Match system',
  switchToLightLabel: 'Switch to light theme',
  switchToDarkLabel: 'Switch to dark theme',
} as const;

/** The strings a toggle shows. */
export type ThemeToggleLabels = Record<keyof typeof THEME_TOGGLE_LABELS, string>;

/** Whether a value is a choice. */
export function isThemeChoice(value: unknown): value is ThemeChoice {
  return typeof value === 'string' && (THEME_CHOICES as readonly string[]).includes(value);
}

/** A choice from a value, or the fallback when it isn't one. */
export function toThemeChoice(
  value: unknown,
  fallback: ThemeChoice = DEFAULT_THEME_CHOICE,
): ThemeChoice {
  return isThemeChoice(value) ? value : fallback;
}

/**
 * The choices a toggle offers: `choices` filtered to known ones, in the
 * canonical order, or all four when none are left.
 */
export function themeChoices(choices?: readonly unknown[] | null): ThemeChoice[] {
  const picked = THEME_CHOICES.filter((choice) => choices?.includes(choice));
  return picked.length ? picked : [...THEME_CHOICES];
}

/** The menu's label for a choice: `system` reads "Match system" there, as in the spec. */
export function themeChoiceLabel(
  choice: ThemeChoice,
  labels: ThemeToggleLabels,
  inMenu = false,
): string {
  switch (choice) {
    case 'light':
      return labels.lightLabel;
    case 'dark':
      return labels.darkLabel;
    case 'high-contrast':
      return labels.highContrastLabel;
    default:
      return inMenu ? labels.matchSystemLabel : labels.systemLabel;
  }
}

/** The built-in strings with the set ones over them. */
export function themeToggleLabels(labels: Partial<ThemeToggleLabels> = {}): ThemeToggleLabels {
  const merged = { ...THEME_TOGGLE_LABELS } as ThemeToggleLabels;
  for (const [key, value] of Object.entries(labels)) {
    if (typeof value === 'string' && key in merged) merged[key as keyof ThemeToggleLabels] = value;
  }
  return merged;
}

type MatchMedia = (
  query: string,
) => Pick<MediaQueryList, 'matches'> &
  Partial<Pick<MediaQueryList, 'addEventListener' | 'removeEventListener'>>;

function defaultMatchMedia(): MatchMedia | undefined {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? (query) => window.matchMedia(query)
    : undefined;
}

/** The OS theme: `dark` when it prefers a dark scheme, else `light` (and on the server). */
export function systemTheme(matchMedia: MatchMedia | undefined = defaultMatchMedia()): Theme {
  try {
    return matchMedia?.(DARK_SCHEME_QUERY).matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** The theme a choice shows: itself, or the OS theme for `system`. */
export function resolveTheme(
  choice: ThemeChoice,
  matchMedia: MatchMedia | undefined = defaultMatchMedia(),
): Theme {
  return choice === 'system' ? systemTheme(matchMedia) : choice;
}

/**
 * What the icon toggle switches to: light from dark, dark from anything else
 * (high contrast is a light theme).
 */
export function nextIconTheme(resolved: Theme): Theme {
  return resolved === 'dark' ? 'light' : 'dark';
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function defaultStorage(): StorageLike | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

/** The stored choice, or `null` when there's none, it's unknown or storage is blocked. */
export function readThemeChoice(
  key: string = THEME_STORAGE_KEY,
  storage: StorageLike | undefined = defaultStorage(),
): ThemeChoice | null {
  try {
    const stored = storage?.getItem(key);
    return isThemeChoice(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Stores a choice. Returns false when storage is blocked or full. */
export function storeThemeChoice(
  choice: ThemeChoice,
  key: string = THEME_STORAGE_KEY,
  storage: StorageLike | undefined = defaultStorage(),
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(key, choice);
    return true;
  } catch {
    return false;
  }
}

export interface ApplyThemeOptions {
  /** The element that carries `data-theme`. Default the document element. */
  root?: Element | null;
  /** Stores the choice. Default true. */
  persist?: boolean;
  /** The storage key. Default {@link THEME_STORAGE_KEY}. */
  storageKey?: string;
  /** Tells the other toggles on the page. Default true. */
  broadcast?: boolean;
  /** For tests: the storage and media query to use. */
  storage?: StorageLike;
  matchMedia?: MatchMedia;
}

function documentRoot(root: Element | null | undefined): Element | null {
  if (root !== undefined) return root;
  return typeof document !== 'undefined' ? document.documentElement : null;
}

/**
 * Applies a choice: sets `data-theme` on the root to the theme it resolves
 * to (and {@link THEME_CHOICE_ATTRIBUTE} to the choice), stores it, and
 * dispatches {@link THEME_CHANGE_EVENT} on the window with
 * `{ value, theme, storageKey }`. Returns the theme it set.
 */
export function applyTheme(choice: ThemeChoice, options: ApplyThemeOptions = {}): Theme {
  const theme = resolveTheme(choice, options.matchMedia ?? defaultMatchMedia());
  const root = documentRoot(options.root);
  root?.setAttribute(THEME_ATTRIBUTE, theme);
  root?.setAttribute(THEME_CHOICE_ATTRIBUTE, choice);
  const storageKey = options.storageKey ?? THEME_STORAGE_KEY;
  if (options.persist ?? true) {
    storeThemeChoice(choice, storageKey, options.storage ?? defaultStorage());
  }
  if ((options.broadcast ?? true) && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, { detail: { value: choice, theme, storageKey } }),
    );
  }
  return theme;
}

/**
 * The choice the page shows, as the head snippet or {@link applyTheme}
 * recorded it in {@link THEME_CHOICE_ATTRIBUTE}. `null` when there's none, or
 * when `data-theme` no longer matches it (the app set its own theme).
 */
export function pageThemeChoice(root?: Element | null): ThemeChoice | null {
  const element = documentRoot(root);
  const choice = element?.getAttribute(THEME_CHOICE_ATTRIBUTE);
  const theme = element?.getAttribute(THEME_ATTRIBUTE);
  if (!isThemeChoice(choice) || !theme) return null;
  return choice === 'system' || choice === theme ? choice : null;
}

/**
 * The choice an uncontrolled toggle starts on when nothing is stored: the one
 * the page shows ({@link pageThemeChoice}, so the head snippet's `default`
 * carries over), else `fallback`. The fallback is applied (not stored, not
 * broadcast) only while the root has no `data-theme`, so it never overrides
 * the head snippet or a theme the app set.
 */
export function startThemeChoice(
  fallback: ThemeChoice,
  options: Pick<ApplyThemeOptions, 'root' | 'matchMedia'> = {},
): ThemeChoice {
  const root = documentRoot(options.root);
  const shown = pageThemeChoice(root);
  if (shown) return shown;
  if (root && !root.hasAttribute(THEME_ATTRIBUTE)) {
    applyTheme(fallback, { ...options, root, persist: false, broadcast: false });
  }
  return fallback;
}

export interface WatchThemeOptions {
  /** Only hear changes for this storage key. Default {@link THEME_STORAGE_KEY}. */
  storageKey?: string;
  /** For tests. */
  matchMedia?: MatchMedia;
}

/**
 * Listens for what changes the choice or the theme it shows: another toggle
 * on the page applying one, another tab storing one, and the OS scheme
 * changing (reported with the choice `null`, so a `system` toggle can
 * re-apply). Returns the cleanup.
 */
export function watchTheme(
  listener: (change: { value: ThemeChoice | null; source: 'page' | 'storage' | 'system' }) => void,
  options: WatchThemeOptions = {},
): () => void {
  if (typeof window === 'undefined') return () => {};
  const storageKey = options.storageKey ?? THEME_STORAGE_KEY;
  const onPage = (event: Event) => {
    const detail = (event as CustomEvent<{ value?: unknown; storageKey?: string }>).detail;
    if (detail?.storageKey === storageKey && isThemeChoice(detail.value)) {
      listener({ value: detail.value, source: 'page' });
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey && isThemeChoice(event.newValue)) {
      listener({ value: event.newValue, source: 'storage' });
    }
  };
  const onScheme = () => listener({ value: null, source: 'system' });
  window.addEventListener(THEME_CHANGE_EVENT, onPage);
  window.addEventListener('storage', onStorage);
  let query: ReturnType<MatchMedia> | undefined;
  try {
    query = (options.matchMedia ?? defaultMatchMedia())?.(DARK_SCHEME_QUERY);
    query?.addEventListener?.('change', onScheme);
  } catch {
    query = undefined;
  }
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onPage);
    window.removeEventListener('storage', onStorage);
    query?.removeEventListener?.('change', onScheme);
  };
}

export interface ThemeScriptOptions {
  /** The storage key. Default {@link THEME_STORAGE_KEY}. */
  storageKey?: string;
  /** The choice without a stored one. Default `system`. */
  defaultValue?: ThemeChoice;
}

/**
 * The blocking snippet that applies the stored choice before first paint.
 * Put it in `<head>`, before the stylesheets, as an inline classic script:
 * `<script>${themeScript()}</script>`. It only reads storage and the OS
 * scheme and sets `data-theme` on `<html>`, and {@link THEME_CHOICE_ATTRIBUTE}
 * to the choice behind it (so toggles start on the snippet's default when
 * nothing is stored); it never throws.
 */
export function themeScript(options: ThemeScriptOptions = {}): string {
  const key = JSON.stringify(options.storageKey ?? THEME_STORAGE_KEY).replace(/</g, '\\u003c');
  const fallback = JSON.stringify(toThemeChoice(options.defaultValue));
  return (
    `(function(){try{var c=null;try{c=localStorage.getItem(${key})}catch(e){}` +
    `if(["light","dark","high-contrast","system"].indexOf(c)<0)c=${fallback};` +
    `var d=document.documentElement;d.setAttribute("${THEME_CHOICE_ATTRIBUTE}",c);` +
    `if(c==="system")c=window.matchMedia&&matchMedia("${DARK_SCHEME_QUERY}").matches?"dark":"light";` +
    `d.setAttribute("${THEME_ATTRIBUTE}",c)}catch(e){}})();`
  );
}

/** The keys a segmented toggle handles: arrows (following the text direction), Home and End. */
export const THEME_TOGGLE_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];

/**
 * The choice a key moves a segmented toggle to, as a radio group does:
 * ArrowRight and ArrowDown go to the next one, ArrowLeft and ArrowUp to the
 * previous one (ArrowLeft and ArrowRight swap under RTL, D-004), wrapping;
 * Home and End go to the first and last. `null` for any other key.
 */
export function themeToggleKey(
  key: string,
  current: ThemeChoice,
  choices: readonly ThemeChoice[],
  direction: 'ltr' | 'rtl' = 'ltr',
): ThemeChoice | null {
  if (!choices.length) return null;
  const index = Math.max(0, choices.indexOf(current));
  const rtl = direction === 'rtl';
  let next: number;
  switch (key) {
    case 'ArrowRight':
      next = index + (rtl ? -1 : 1);
      break;
    case 'ArrowLeft':
      next = index + (rtl ? 1 : -1);
      break;
    case 'ArrowDown':
      next = index + 1;
      break;
    case 'ArrowUp':
      next = index - 1;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = choices.length - 1;
      break;
    default:
      return null;
  }
  return choices[(next + choices.length) % choices.length]!;
}
