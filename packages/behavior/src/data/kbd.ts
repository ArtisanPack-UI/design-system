/**
 * Kbd (#65): the keys of a shortcut as each stack shows them. `mod` is ⌘ on
 * Apple platforms and Ctrl elsewhere, and the other modifiers follow the
 * platform the same way (⌥ / Alt, ⇧ / Shift, ⌃ / Ctrl). A key shown as a
 * symbol (⌘, ⇧, ↵, ↑) carries a text alternative, rendered as hidden text
 * beside the symbol. Livewire UI Components ports this table to PHP
 * (`Kbd::keyList()`); keep the two in step.
 */

/** The text alternatives for symbol keys. Translate them through `labels`. */
export const KBD_LABELS = {
  command: 'Command',
  control: 'Control',
  option: 'Option',
  shift: 'Shift',
  enter: 'Enter',
  tab: 'Tab',
  escape: 'Escape',
  backspace: 'Backspace',
  up: 'Up arrow',
  down: 'Down arrow',
  left: 'Left arrow',
  right: 'Right arrow',
} as const;

/** A symbol key's name. */
export type KbdLabelName = keyof typeof KBD_LABELS;

/** Replacement text alternatives, by name. */
export type KbdLabels = Partial<Record<KbdLabelName, string>>;

/** A key as shown: its text and, for a symbol, the name read instead. */
export interface KbdKey {
  /** What the key cap shows. */
  text: string;
  /** The text alternative, for a symbol. Hidden from sight, read instead of the symbol. */
  label?: string;
}

/** A named key's cap on Apple platforms and elsewhere. */
interface KbdKeyRule {
  apple: string;
  other: string;
  /** The text alternative's name on Apple platforms, and elsewhere. */
  appleLabel?: KbdLabelName;
  otherLabel?: KbdLabelName;
}

/** Named keys, lowercased. */
const NAMED: Record<string, KbdKeyRule> = {
  mod: { apple: '⌘', other: 'Ctrl', appleLabel: 'command' },
  cmd: { apple: '⌘', other: '⌘', appleLabel: 'command', otherLabel: 'command' },
  command: { apple: '⌘', other: '⌘', appleLabel: 'command', otherLabel: 'command' },
  meta: { apple: '⌘', other: 'Meta', appleLabel: 'command' },
  ctrl: { apple: '⌃', other: 'Ctrl', appleLabel: 'control' },
  control: { apple: '⌃', other: 'Ctrl', appleLabel: 'control' },
  alt: { apple: '⌥', other: 'Alt', appleLabel: 'option' },
  option: { apple: '⌥', other: 'Alt', appleLabel: 'option' },
  opt: { apple: '⌥', other: 'Alt', appleLabel: 'option' },
  shift: { apple: '⇧', other: 'Shift', appleLabel: 'shift' },
  enter: { apple: '↵', other: '↵', appleLabel: 'enter', otherLabel: 'enter' },
  return: { apple: '↵', other: '↵', appleLabel: 'enter', otherLabel: 'enter' },
  esc: { apple: 'Esc', other: 'Esc' },
  escape: { apple: 'Esc', other: 'Esc' },
  tab: { apple: 'Tab', other: 'Tab' },
  space: { apple: 'Space', other: 'Space' },
  backspace: { apple: '⌫', other: 'Backspace', appleLabel: 'backspace' },
  delete: { apple: 'Del', other: 'Del' },
  del: { apple: 'Del', other: 'Del' },
  up: { apple: '↑', other: '↑', appleLabel: 'up', otherLabel: 'up' },
  arrowup: { apple: '↑', other: '↑', appleLabel: 'up', otherLabel: 'up' },
  down: { apple: '↓', other: '↓', appleLabel: 'down', otherLabel: 'down' },
  arrowdown: { apple: '↓', other: '↓', appleLabel: 'down', otherLabel: 'down' },
  left: { apple: '←', other: '←', appleLabel: 'left', otherLabel: 'left' },
  arrowleft: { apple: '←', other: '←', appleLabel: 'left', otherLabel: 'left' },
  right: { apple: '→', other: '→', appleLabel: 'right', otherLabel: 'right' },
  arrowright: { apple: '→', other: '→', appleLabel: 'right', otherLabel: 'right' },
};

/** Symbols given as they are, and the name each one is read as. */
const SYMBOLS: Record<string, KbdLabelName> = {
  '⌘': 'command',
  '⌃': 'control',
  '⌥': 'option',
  '⇧': 'shift',
  '↵': 'enter',
  '⏎': 'enter',
  '⇥': 'tab',
  '⎋': 'escape',
  '⌫': 'backspace',
  '↑': 'up',
  '↓': 'down',
  '←': 'left',
  '→': 'right',
};

/** Whether a key list shows differently on Apple platforms, so the client must check. */
export function kbdDependsOnPlatform(keys: readonly unknown[] | null | undefined): boolean {
  return (keys ?? []).some((key) => {
    const rule = NAMED[String(key).trim().toLowerCase()];
    return rule !== undefined && rule.apple !== rule.other;
  });
}

/**
 * The keys to show. Named keys (`mod`, `shift`, `enter`, `up`…) become the
 * platform's cap; a single character is uppercased; anything else (`F5`,
 * `PgUp`) shows as given. Empty entries are dropped.
 */
export function kbdKeys(
  keys: readonly unknown[] | null | undefined,
  apple = false,
  labels: KbdLabels = {},
): KbdKey[] {
  const name = (label: KbdLabelName | undefined) =>
    label === undefined ? undefined : (labels[label] ?? KBD_LABELS[label]);
  const shown: KbdKey[] = [];
  for (const raw of keys ?? []) {
    if (raw === null || raw === undefined) continue;
    const key = String(raw).trim();
    if (key === '') continue;
    const rule = NAMED[key.toLowerCase()];
    if (rule) {
      const text = apple ? rule.apple : rule.other;
      const label = name(apple ? rule.appleLabel : rule.otherLabel);
      shown.push(label === undefined ? { text } : { text, label });
      continue;
    }
    const symbol = SYMBOLS[key];
    if (symbol) {
      shown.push({ text: key, label: name(symbol) });
      continue;
    }
    shown.push({ text: [...key].length === 1 ? key.toUpperCase() : key });
  }
  return shown;
}
