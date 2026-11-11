/**
 * The Vue fixture host's prop mapping.
 */
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import { vueProps } from '../src/hosts/vue';

const Bound = defineComponent({ props: { modelValue: Array, label: String } });
const Native = defineComponent({ props: { label: String } });
const Both = defineComponent({ props: ['value', 'modelValue'] });

describe('vueProps', () => {
  it('binds the manifest value as modelValue when the component declares it', () => {
    expect(vueProps(Bound, { label: 'Files', value: [{ name: 'a.jpg' }] })).toEqual({
      label: 'Files',
      modelValue: [{ name: 'a.jpg' }],
    });
  });

  it('leaves value alone when the component has no modelValue or declares value itself', () => {
    expect(vueProps(Native, { value: 'on' })).toEqual({ value: 'on' });
    expect(vueProps(Both, { value: 'x' })).toEqual({ value: 'x' });
  });

  it('returns props without a value unchanged', () => {
    const props = { label: 'Name' };
    expect(vueProps(Bound, props)).toBe(props);
  });
});
