/**
 * The combobox helpers every stack shares (#54): matching, the create
 * option, marks, labels, and how React and Vue options become items.
 */
import { reviewValueChange, visibleItems } from '../src/core/options';
import {
  createItem,
  filterItems,
  formatLabel,
  highlight,
  type ComboboxItem,
} from '../src/widgets/combobox';

const ITEMS: ComboboxItem[] = [
  { value: 'lakeview', label: 'Lakeview Lofts' },
  { value: 'ci', label: "Côte d'Ivoire" },
  { value: 'harbor', label: 'Harbor Point' },
];

describe('combobox helpers', () => {
  it('filters by label, ignoring case and accents', () => {
    expect(filterItems(ITEMS, 'COTE').map((item) => item.value)).toEqual(['ci']);
    expect(filterItems(ITEMS, '  ')).toEqual(ITEMS);
  });

  it('creates only text that names nothing yet', () => {
    expect(createItem('Rooftop', ITEMS)).toEqual({
      value: 'Rooftop',
      label: 'Rooftop',
      create: true,
    });
    expect(createItem('  ', ITEMS)).toBeNull();
    expect(createItem('harbor point', ITEMS)).toBeNull();
    expect(createItem('cote d’ivoire'.replace('’', "'"), ITEMS)).toBeNull();
    expect(createItem('rooftop', ITEMS, ['Rooftop'])).toBeNull();
  });

  it('marks the first match, mapping folded text back to the label', () => {
    expect(highlight('Silver Lake Bungalows', 'lake')).toEqual([
      { text: 'Silver ', match: false },
      { text: 'Lake', match: true },
      { text: ' Bungalows', match: false },
    ]);
    expect(highlight("Côte d'Ivoire", 'cote')).toEqual([
      { text: 'Côte', match: true },
      { text: " d'Ivoire", match: false },
    ]);
    expect(highlight('Harbor', 'zz')).toEqual([{ text: 'Harbor', match: false }]);
    expect(highlight('Harbor', '')).toEqual([{ text: 'Harbor', match: false }]);
  });

  it('fills label placeholders', () => {
    expect(formatLabel('Remove {label}', { label: 'Rooftop' })).toBe('Remove Rooftop');
    expect(formatLabel('Keep {other}', {})).toBe('Keep {other}');
  });

  it('lists the visible items with the create option and max', () => {
    const options = { items: ITEMS, allowCreate: true };
    expect(visibleItems(options, 'lake').map((item) => item.value)).toEqual(['lakeview', 'lake']);
    expect(visibleItems({ ...options, remote: true }, 'zz').map((item) => item.value)).toEqual([
      'lakeview',
      'ci',
      'harbor',
      'zz',
    ]);
    const capped = visibleItems({ items: ITEMS, multiple: true, max: 1 }, '', ['harbor']);
    expect(capped.map((item) => Boolean(item.disabled))).toEqual([true, true, false]);
  });

  it('refuses a choice past max and reports a created value', () => {
    expect(reviewValueChange({ multiple: true, max: 1 }, ['a'], ['a', 'b'], [])).toEqual({
      allowed: false,
      created: null,
    });
    expect(reviewValueChange({ multiple: true, max: 2 }, ['a'], [], [])).toEqual({
      allowed: true,
      created: null,
    });
    const items = [{ value: 'New', label: 'New', create: true }];
    expect(reviewValueChange({ multiple: true }, [], ['New'], items)).toEqual({
      allowed: true,
      created: 'New',
    });
  });
});
