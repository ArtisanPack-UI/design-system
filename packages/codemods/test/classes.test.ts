import { classifyClass, findClasses } from '../src';

describe('classifyClass', () => {
  it.each([
    ['btn', 'component'],
    ['btn-primary', 'component'],
    ['hover:badge-sm', 'component'],
    ['md:!card-body', 'component'],
    ['input', 'ambiguous'],
    ['table-sm', 'ambiguous'],
    ['table-auto', null],
    ['select-none', null],
    ['bg-base-200', 'themeBase'],
    ['text-base-content/60', 'themeBase'],
    ['text-primary-content', 'themeContent'],
    ['bg-primary', null],
    ['flex', null],
    ['apui-button', null],
    ['buttons', null],
    ['Btn', null],
    ['[&:hover]:btn', 'component'],
    ['[&>*]:md:badge-sm', 'component'],
    ['w-[120px]', null],
  ] as const)('%s is %s', (token, kind) => {
    expect(classifyClass(token)).toBe(kind);
  });
});

describe('findClasses', () => {
  it('reports classes where they are, in class attributes only', () => {
    const source = [
      '<p>Press the btn in the card.</p>',
      '<div className="card bg-base-100 p-4">',
      `  <a :class="active ? 'btn btn-primary' : 'link'">Go</a>`,
      "  <span className={cn('badge', small && 'badge-sm')} />",
      '</div>',
    ].join('\n');
    const findings = findClasses(source);
    expect(findings.map((finding) => `${finding.line}:${finding.member}`)).toEqual([
      '2:card',
      '2:bg-base-100',
      '3:btn',
      '3:btn-primary',
      '3:link',
      '4:badge',
      '4:badge-sm',
    ]);
    expect(findings[0]).toMatchObject({ kind: 'class', line: 2, column: 17 });
    expect(findings[0]!.message).toContain('DaisyUI class');
    expect(findings[4]!.message).toContain('may be');
  });

  it('reads the string literals of an expression, and only those', () => {
    const source = [
      "<div className={active ? 'btn' : 'card'} />",
      "<div className={cn(card, badge && 'badge')} />",
      `<a :class="[card, { 'btn-primary': on }]" class="[&:hover]:btn">Go</a>`,
      `<i class="{{ $on ? "btn" : "btn-outline" }}"></i>`,
    ].join('\n');
    expect(findClasses(source).map((finding) => `${finding.line}:${finding.member}`)).toEqual([
      '1:btn',
      '1:card',
      '2:badge',
      '3:btn-primary',
      '3:[&:hover]:btn',
      '4:btn',
      '4:btn-outline',
    ]);
  });

  it('reports theme variables and DaisyUI configuration', () => {
    const source =
      '@plugin "daisyui";\n.x { color: var(--color-base-content); border-radius: var(--radius-box); }\n';
    expect(findClasses(source).map((finding) => `${finding.line}:${finding.member}`)).toEqual([
      '1:@plugin "daisyui"',
      '2:--color-base-content',
      '2:--radius-box',
    ]);
  });

  it('finds nothing in clean markup', () => {
    expect(findClasses('<div class="apui-card flex gap-4 bg-primary">Hi</div>')).toEqual([]);
  });
});
