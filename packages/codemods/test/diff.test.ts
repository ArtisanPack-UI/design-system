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

  it('counts lines without the final newline as a line', () => {
    expect(unifiedDiff('a', 'a\n', 'b\n')).toBe('--- a/a\n+++ b/a\n@@ -1,1 +1,1 @@\n-a\n+b\n');
    expect(unifiedDiff('a', '', 'b\n')).toBe('--- a/a\n+++ b/a\n@@ -0,0 +1,1 @@\n+b\n');
  });

  it('marks a missing final newline', () => {
    expect(unifiedDiff('a', 'x\na', 'x\nb')).toBe(
      '--- a/a\n+++ b/a\n@@ -1,2 +1,2 @@\n x\n-a\n\\ No newline at end of file\n+b\n\\ No newline at end of file\n',
    );
    expect(unifiedDiff('a', 'a', 'a\n')).toBe(
      '--- a/a\n+++ b/a\n@@ -1,1 +1,1 @@\n-a\n\\ No newline at end of file\n+a\n',
    );
  });

  it('stays within memory on a huge change', () => {
    const before = Array.from({ length: 6000 }, (_, index) => `old ${index}`).join('\n');
    const after = Array.from({ length: 6000 }, (_, index) => `new ${index}`).join('\n');
    const diff = unifiedDiff('a', before, after);
    expect(diff).toContain('@@ -1,6000 +1,6000 @@');
    expect(diff).toContain('-old 5999');
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
