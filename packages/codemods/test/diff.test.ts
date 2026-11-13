import { unifiedDiff } from '../src';

describe('unifiedDiff', () => {
  it('is empty when nothing changed', () => {
    expect(unifiedDiff('a.tsx', 'x\n', 'x\n')).toBe('');
  });

  it('shows a changed line with its context', () => {
    const before = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].join(
      '\n',
    );
    const after = before.replace('five', 'FIVE');
    expect(unifiedDiff('src/a.tsx', before, after, 2)).toBe(
      [
        '--- a/src/a.tsx',
        '+++ b/src/a.tsx',
        '@@ -3,5 +3,5 @@',
        ' three',
        ' four',
        '-five',
        '+FIVE',
        ' six',
        ' seven',
        '',
      ].join('\n'),
    );
  });

  it('splits distant changes into hunks and counts added and removed lines', () => {
    const lines = Array.from({ length: 30 }, (_, index) => `line ${index + 1}`);
    const after = [...lines];
    after[1] = 'changed 2';
    after.splice(24, 1);
    after.push('added');
    const diff = unifiedDiff('a', lines.join('\n'), after.join('\n'), 1);
    expect(diff).toContain('@@ -1,3 +1,3 @@');
    expect(diff).toContain('@@ -24,3 +24,2 @@');
    expect(diff).toContain('-line 25');
    expect(diff).toContain('+added');
    expect(diff.match(/^@@/gm)).toHaveLength(3);
  });
});
