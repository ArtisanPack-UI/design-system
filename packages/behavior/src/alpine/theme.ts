/**
 * The `apuiThemeToggle` Alpine component (#65), on the theme helpers in
 * `../theme`. Not a Zag machine: a radio group of theme choices (or one icon
 * button, or a DropdownMenu's radio items) whose choice applies `data-theme`
 * to the document, persists, and follows the OS while it's `system`.
 *
 *   <div x-data="apuiThemeToggle({ value: $wire.entangle('theme') })" class="apui-theme-toggle apui-tabs" …>
 *     <div data-scope="tabs" data-part="list" role="radiogroup" aria-label="Theme" x-on:keydown="keydown($event)">
 *       <button role="radio" data-value="light"
 *         x-bind:aria-checked="checked('light')" x-bind:tabindex="tabStop('light')"
 *         x-on:click="choose('light')">Light</button>
 *       …
 *     </div>
 *   </div>
 *
 * `value` is plain Alpine state, so `$wire.entangle()` binds it to Livewire.
 * Without a value, the stored choice shows, else the one the head script
 * applied (`data-theme-choice`), else `system`, which is applied only while
 * `<html>` has no `data-theme`. A choice the toggle makes dispatches
 * `value-change` from the root; every toggle on the page follows it, and so
 * do toggles in other tabs that read storage (not `bound` ones, and not with
 * `persist: false`). When the value changes from outside the toggle
 * (Livewire setting the entangled property), the toggle applies it too; a
 * plain starting value isn't applied, the head script did that.
 */
import { directionOf } from '../positioning';
import {
  applyTheme,
  isThemeChoice,
  nextIconTheme,
  readThemeChoice,
  resolveTheme,
  startThemeChoice,
  type Theme,
  type ThemeChoice,
  themeChoices,
  themeToggleKey,
  THEME_STORAGE_KEY,
  watchTheme,
} from '../theme';

export interface ThemeToggleAlpineOptions {
  /** Initial or entangled choice. Without one, the stored choice, else the page's, else `system`. */
  value?: ThemeChoice | null;
  /** The choices offered, in order. Default all four. */
  choices?: ThemeChoice[];
  /** Stores the choice. Default true. */
  persist?: boolean;
  /** The storage key. Default `apui-theme`. */
  storageKey?: string;
  /**
   * `value` is the server's (`wire:model`), say a profile setting: applied and
   * stored once on init when it differs from the stored choice. Default false.
   */
  bound?: boolean;
}

interface Magics {
  $el: HTMLElement;
  $watch?: (property: string, callback: (value: unknown) => void) => void;
}

interface State {
  value: ThemeChoice | null;
  resolved: Theme;
}

function dispatch(el: Element, name: string, detail: unknown) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/** The `apuiThemeToggle` Alpine component. */
export function themeToggleComponent(options: ThemeToggleAlpineOptions = {}) {
  const storageKey = options.storageKey ?? THEME_STORAGE_KEY;
  const persist = options.persist ?? true;
  const choices = themeChoices(options.choices);
  let stop: (() => void) | undefined;
  // The choice this toggle last applied or heard, so `$watch` only acts on outside changes.
  let known: ThemeChoice | null = null;

  return {
    value: (options.value ?? null) as ThemeChoice | null,
    resolved: 'light' as Theme,

    init(this: Magics & State) {
      const stored = persist ? readThemeChoice(storageKey) : null;
      if (!isThemeChoice(this.value)) {
        this.value = stored ?? startThemeChoice('system');
        this.resolved = resolveTheme(this.value as ThemeChoice);
      } else if (options.bound && this.value !== stored) {
        // A bound value the head script didn't apply (say, a profile setting from
        // `wire:model`): apply and store it once, so the page and the toggle agree.
        this.resolved = applyTheme(this.value, { persist, storageKey });
      } else {
        this.resolved = resolveTheme(this.value);
      }
      known = this.value;
      this.$watch?.('value', (value) => {
        if (!isThemeChoice(value) || value === known) return;
        known = value;
        this.resolved = applyTheme(value, { persist, storageKey });
      });
      // A bound toggle shows the server's value and an unpersisted one ignores
      // storage, so neither follows (or applies) a choice another tab stored.
      const followsStorage = persist && !options.bound;
      stop = watchTheme(
        ({ value, source }) => {
          if (source === 'storage' && !followsStorage) return;
          if (value) {
            known = value;
            this.value = value;
            this.resolved = resolveTheme(value);
            // Another tab stored it; this page applies it too.
            if (source === 'storage') applyTheme(value, { persist: false, broadcast: false });
          } else if (this.value === 'system') {
            this.resolved = applyTheme('system', { persist: false, broadcast: false });
          }
        },
        { storageKey },
      );
    },

    destroy() {
      stop?.();
      stop = undefined;
    },

    /** The current choice, `system` until init. */
    current(this: State): ThemeChoice {
      return isThemeChoice(this.value) ? this.value : 'system';
    },

    /** `'true'` or `'false'` for a choice's `aria-checked`. */
    checked(this: State & { current(): ThemeChoice }, choice: ThemeChoice): 'true' | 'false' {
      return this.current() === choice ? 'true' : 'false';
    },

    /** A choice's tabindex: only the checked one is in the Tab order. */
    tabStop(this: State & { current(): ThemeChoice }, choice: ThemeChoice): 0 | -1 {
      const current = choices.includes(this.current()) ? this.current() : choices[0];
      return current === choice ? 0 : -1;
    },

    /** Applies a choice, stores it and dispatches `value-change` when it changed. */
    choose(this: Magics & State, choice: unknown) {
      if (!isThemeChoice(choice)) return;
      const changed = choice !== this.value;
      known = choice;
      this.value = choice;
      this.resolved = applyTheme(choice, { persist, storageKey });
      if (changed) dispatch(this.$el, 'value-change', { value: choice });
    },

    /** The icon variant: switches to light from dark, else to dark. */
    toggle(this: State & { choose(choice: unknown): void }) {
      this.choose(nextIconTheme(this.resolved));
    },

    /** The theme the icon button switches to. */
    nextTheme(this: State): Theme {
      return nextIconTheme(this.resolved);
    },

    /** Arrow keys, Home and End on the segmented radio group: move, check and focus. */
    keydown(
      this: Magics & State & { current(): ThemeChoice; choose(choice: unknown): void },
      event: KeyboardEvent,
    ) {
      const focused = (event.target as Element | null)
        ?.closest?.('[role="radio"]')
        ?.getAttribute('data-value');
      const from = isThemeChoice(focused) ? focused : this.current();
      const next = themeToggleKey(event.key, from, choices, directionOf(this.$el));
      if (!next) return;
      event.preventDefault();
      this.choose(next);
      const group = (event.currentTarget as Element | null) ?? this.$el;
      group.querySelector<HTMLElement>(`[role="radio"][data-value="${next}"]`)?.focus();
    },
  };
}
