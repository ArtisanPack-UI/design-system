// @vitest-environment happy-dom
/**
 * The Utility wave's shared helpers (#65): the copy controller Clipboard and
 * Code use in every stack, Kbd's platform keys and text alternatives, and
 * Code's lines. The PHP ports in Livewire UI Components (`Kbd::keyList()`,
 * `Code::lines()`) are tested against the same expectations.
 */
import { codeHighlights, codeLabel, codeLines, codeText } from '../src/data/code';
import { KBD_LABELS, kbdDependsOnPlatform, kbdKeys } from '../src/data/kbd';
import {
  CLIPBOARD_LABELS,
  CLIPBOARD_TIMEOUT,
  clipboardLabel,
  clipboardMessage,
  clipboardTimeout,
  createClipboard,
  writeClipboard,
  type ClipboardStatus,
} from '../src/widgets/clipboard';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('createClipboard', () => {
  it('copies, shows copied for the timeout, then goes back to idle', async () => {
    vi.useFakeTimers();
    const seen: ClipboardStatus[] = [];
    const write = vi.fn(async () => true);
    const clipboard = createClipboard({ timeout: 500, write, onStatusChange: (s) => seen.push(s) });
    expect(await clipboard.copy('abc')).toBe(true);
    expect(write).toHaveBeenCalledWith('abc');
    expect(clipboard.status).toBe('copied');
    vi.advanceTimersByTime(499);
    expect(clipboard.status).toBe('copied');
    vi.advanceTimersByTime(1);
    expect(clipboard.status).toBe('idle');
    expect(seen).toEqual(['copied', 'idle']);
  });

  it('reports a failure, never silently', async () => {
    vi.useFakeTimers();
    const clipboard = createClipboard({ write: async () => false });
    expect(await clipboard.copy('abc')).toBe(false);
    expect(clipboard.status).toBe('failed');
    vi.advanceTimersByTime(CLIPBOARD_TIMEOUT);
    expect(clipboard.status).toBe('idle');

    const throwing = createClipboard({
      write: async () => {
        throw new Error('denied');
      },
    });
    expect(await throwing.copy('abc')).toBe(false);
    expect(throwing.status).toBe('failed');
  });

  it('goes back to idle before each copy, so a repeat is announced again', async () => {
    const seen: ClipboardStatus[] = [];
    const clipboard = createClipboard({
      write: async () => true,
      onStatusChange: (s) => seen.push(s),
    });
    await clipboard.copy('a');
    await clipboard.copy('a');
    expect(seen).toEqual(['copied', 'idle', 'copied']);
    clipboard.destroy();
  });

  it('lets the newest copy own the status, and stops on destroy', async () => {
    vi.useFakeTimers();
    let release: (value: boolean) => void = () => {};
    const slow = new Promise<boolean>((resolve) => (release = resolve));
    const clipboard = createClipboard({
      write: vi.fn().mockReturnValueOnce(slow).mockResolvedValueOnce(false),
    });
    const first = clipboard.copy('one');
    await clipboard.copy('two');
    expect(clipboard.status).toBe('failed');
    release(true);
    expect(await first).toBe(true);
    expect(clipboard.status).toBe('failed');
    clipboard.destroy();
    vi.advanceTimersByTime(CLIPBOARD_TIMEOUT);
    expect(clipboard.status).toBe('failed');
    clipboard.reset();
    expect(clipboard.status).toBe('idle');
  });

  it('copies null and undefined as empty text', async () => {
    const write = vi.fn(async () => true);
    await createClipboard({ write }).copy(undefined);
    expect(write).toHaveBeenCalledWith('');
  });
});

describe('writeClipboard', () => {
  it('uses navigator.clipboard when it works', async () => {
    const writeText = vi.fn(async () => undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    expect(await writeClipboard('hello')).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to a hidden textarea, then returns focus', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: async () => {
          throw new Error('blocked');
        },
      },
    });
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    let copied = '';
    const exec = vi.fn(() => {
      copied = document.querySelector('textarea')!.value;
      return true;
    });
    (document as unknown as { execCommand: unknown }).execCommand = exec;
    expect(await writeClipboard('fallback')).toBe(true);
    expect(exec).toHaveBeenCalledWith('copy');
    expect(copied).toBe('fallback');
    expect(document.querySelector('textarea')).toBeNull();
    expect(document.activeElement).toBe(button);

    (document as unknown as { execCommand: unknown }).execCommand = () => false;
    expect(await writeClipboard('again')).toBe(false);
    button.remove();
  });
});

describe('clipboard labels', () => {
  it('swaps the label and fills the live region by status', () => {
    expect(clipboardLabel('idle')).toBe('Copy');
    expect(clipboardLabel('failed')).toBe('Copy');
    expect(clipboardLabel('copied')).toBe('Copied');
    expect(clipboardLabel('copied', { copied: 'Copié' })).toBe('Copié');
    expect(clipboardMessage('idle')).toBe('');
    expect(clipboardMessage('copied')).toBe(CLIPBOARD_LABELS.copiedMessage);
    expect(clipboardMessage('failed', { errorMessage: 'Nope' })).toBe('Nope');
  });

  it('reads the timeout as whole, non-negative milliseconds', () => {
    expect(clipboardTimeout(undefined)).toBe(2000);
    expect(clipboardTimeout(-1)).toBe(2000);
    expect(clipboardTimeout('1500')).toBe(1500);
    expect(clipboardTimeout(0)).toBe(0);
    expect(clipboardTimeout(Number.NaN)).toBe(2000);
  });
});

describe('kbdKeys', () => {
  it('shows mod as Ctrl elsewhere and ⌘ on Apple platforms', () => {
    expect(kbdKeys(['mod', 'k'])).toEqual([{ text: 'Ctrl' }, { text: 'K' }]);
    expect(kbdKeys(['mod', 'k'], true)).toEqual([{ text: '⌘', label: 'Command' }, { text: 'K' }]);
  });

  it('follows the platform for every modifier', () => {
    expect(kbdKeys(['ctrl', 'alt', 'shift', 'p']).map((key) => key.text)).toEqual([
      'Ctrl',
      'Alt',
      'Shift',
      'P',
    ]);
    expect(kbdKeys(['ctrl', 'option', 'shift', 'p'], true)).toEqual([
      { text: '⌃', label: 'Control' },
      { text: '⌥', label: 'Option' },
      { text: '⇧', label: 'Shift' },
      { text: 'P' },
    ]);
  });

  it('gives symbols a text alternative, translatable through labels', () => {
    expect(kbdKeys(['enter', 'up', '⌘', 'Esc', 'tab'])).toEqual([
      { text: '↵', label: 'Enter' },
      { text: '↑', label: 'Up arrow' },
      { text: '⌘', label: 'Command' },
      { text: 'Esc' },
      { text: 'Tab' },
    ]);
    expect(kbdKeys(['enter'], false, { enter: 'Entrée' })).toEqual([
      { text: '↵', label: 'Entrée' },
    ]);
    expect(Object.keys(KBD_LABELS)).toContain('backspace');
  });

  it('uppercases single characters, keeps other keys and drops empty ones', () => {
    expect(kbdKeys(['?', 'F5', ' ', '', null, 'é'])).toEqual([
      { text: '?' },
      { text: 'F5' },
      { text: 'É' },
    ]);
    expect(kbdKeys(undefined)).toEqual([]);
  });

  it('knows when the client must check the platform', () => {
    expect(kbdDependsOnPlatform(['mod', 'k'])).toBe(true);
    expect(kbdDependsOnPlatform(['Shift'])).toBe(true);
    expect(kbdDependsOnPlatform(['enter', 'k', '⌘'])).toBe(false);
    expect(kbdDependsOnPlatform(null)).toBe(false);
  });
});

describe('code helpers', () => {
  it('splits on any line ending and drops one final empty line', () => {
    expect(codeLines('a\r\nb\rc\nd\n')).toEqual(['a', 'b', 'c', 'd']);
    expect(codeLines('a\n\n')).toEqual(['a', '']);
    expect(codeLines('\tindented  ')).toEqual(['\tindented  ']);
    expect(codeLines('\n')).toEqual(['']);
    expect(codeLines('')).toEqual([]);
    expect(codeLines(null)).toEqual([]);
  });

  it('keeps whole, positive highlighted lines', () => {
    expect([...codeHighlights([3, '5', 0, -1, 2.5, 'x', 3])]).toEqual([3, 5]);
    expect(codeHighlights(undefined).size).toBe(0);
  });

  it('names the region by label, file name, language, then "Code"', () => {
    expect(codeLabel('Example', 'a.ts', 'TypeScript')).toBe('Example');
    expect(codeLabel(undefined, 'a.ts', 'TypeScript')).toBe('a.ts');
    expect(codeLabel('', ' ', 'TypeScript')).toBe('TypeScript');
    expect(codeLabel(null, null, null)).toBe('Code');
    expect(codeLabel(null, null, null, 'Código')).toBe('Código');
  });

  it('reads the rendered lines back as text', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<pre><code><span data-scope="code" data-part="line" data-n="1">one</span><span data-scope="code" data-part="line" data-n="2"></span><span data-scope="code" data-part="line" data-n="3">  three</span></code></pre>';
    expect(codeText(root)).toBe('one\n\n  three');
  });
});

describe('Alpine components', () => {
  it('apuiClipboard binds status, label, icon and message, and copies the code lines', async () => {
    const { clipboardComponent } = await import('../src/alpine/clipboard');
    const writeText = vi.fn(async () => undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const root = document.createElement('div');
    root.innerHTML =
      '<span data-scope="code" data-part="line">a</span><span data-scope="code" data-part="line">b</span>';
    const component = Object.assign(
      clipboardComponent({ timeout: 50, labels: { copied: 'Copié' } }),
      { $root: root },
    );
    component.init();
    expect([component.label, component.message, component.copied]).toEqual(['Copy', '', false]);
    expect(component.icon).toContain('<svg');
    expect(await component.copyCode()).toBe(true);
    expect(writeText).toHaveBeenCalledWith('a\nb');
    expect(component.status).toBe('copied');
    expect([component.label, component.message, component.copied]).toEqual([
      'Copié',
      'Copied to clipboard',
      true,
    ]);
    expect(component.icon).toContain('M20 6 9 17l-5-5');
    component.destroy();
  });

  it('apuiClipboard clears a stale "Copied" when Livewire morphs a new value, even mid-copy', async () => {
    const { clipboardComponent } = await import('../src/alpine/clipboard');
    let release: () => void = () => {};
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(new Promise<void>((resolve) => (release = resolve)));
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const root = document.createElement('span');
    root.innerHTML = '<button value="A"></button>';
    const button = root.querySelector('button')!;
    const component = Object.assign(clipboardComponent({ timeout: 5000 }), { $root: root });
    component.init();

    expect(await component.copy('A')).toBe(true);
    expect(component.status).toBe('copied');
    button.setAttribute('value', 'B');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(component.status).toBe('idle');

    const pending = component.copy('B');
    button.setAttribute('value', 'C');
    await new Promise((resolve) => setTimeout(resolve, 0));
    release();
    expect(await pending).toBe(true);
    expect(component.status).toBe('idle');
    component.destroy();
  });

  it('apuiClipboard keeps a failed value for copying by hand and selects it', async () => {
    const { clipboardComponent } = await import('../src/alpine/clipboard');
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValueOnce(new Error('denied')) },
    });
    document.execCommand = vi.fn(() => false);
    const root = document.createElement('span');
    root.innerHTML =
      '<span data-scope="clipboard" data-part="field"><span data-scope="clipboard" data-part="value">KEY-1</span></span>';
    document.body.append(root);
    const component = Object.assign(clipboardComponent(), { $root: root });
    component.init();

    expect(await component.copy('KEY-1')).toBe(false);
    expect(component.status).toBe('failed');
    expect(component.manual).toBe('KEY-1');
    expect(window.getSelection()?.toString()).toBe('KEY-1');

    component.reset();
    expect([component.status, component.manual]).toEqual(['idle', null]);
    component.destroy();
    root.remove();
  });

  it('apuiKbd swaps in Apple keys on Apple platforms', async () => {
    const { kbdComponent } = await import('../src/alpine/clipboard');
    vi.stubGlobal('navigator', { platform: 'Win32' });
    const other = kbdComponent({ keys: ['mod', 'k'] });
    other.init();
    expect(other.keys.map((key) => key.text)).toEqual(['Ctrl', 'K']);
    vi.stubGlobal('navigator', { platform: 'MacIntel' });
    const apple = kbdComponent({ keys: ['mod', 'k'], labels: { command: 'Commande' } });
    apple.init();
    expect(apple.keys[0]).toEqual({ text: '⌘', label: 'Commande' });
  });
});
