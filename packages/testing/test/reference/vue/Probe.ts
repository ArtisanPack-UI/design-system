/** The reference Probe in Vue, plus a broken twin for the parity tests. */
import { defineComponent, h } from 'vue';

const icon = () =>
  h('span', { 'data-scope': 'probe', 'data-part': 'icon', 'aria-hidden': 'true' }, [
    h('svg', { viewBox: '0 0 16 16', width: '16', height: '16' }, [
      h('circle', { cx: '8', cy: '8', r: '5', fill: 'currentColor' }),
    ]),
  ]);

export const Probe = defineComponent({
  name: 'Probe',
  props: {
    variant: { type: String, default: 'solid' },
    color: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    leadingIcon: { type: String, default: undefined },
  },
  emits: ['press'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          class: 'apui-probe',
          'data-variant': props.variant,
          'data-color': props.color,
          'data-size': props.size,
          disabled: props.disabled || undefined,
          'data-disabled': props.disabled ? '' : undefined,
          'aria-busy': props.loading ? 'true' : undefined,
          onClick: () => emit('press'),
        },
        [
          props.leadingIcon ? icon() : null,
          h('span', { 'data-scope': 'probe', 'data-part': 'label' }, slots.default?.()),
          props.loading
            ? h('span', { 'data-scope': 'probe', 'data-part': 'spinner', 'aria-hidden': 'true' })
            : null,
        ],
      );
  },
});

/** Ignores size, loading and leadingIcon, declares `tone`, emits `click`, adds a part. */
export const BrokenProbe = defineComponent({
  name: 'BrokenProbe',
  props: {
    variant: { type: String, default: 'solid' },
    color: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    disabled: { type: Boolean, default: false },
    tone: { type: String, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          class: 'apui-probe',
          'data-variant': props.variant,
          'data-color': props.color,
          'data-size': 'md',
          disabled: props.disabled || undefined,
        },
        [
          h('span', { 'data-scope': 'probe', 'data-part': 'label' }, slots.default?.()),
          h('span', { 'data-scope': 'probe', 'data-part': 'badge' }),
        ],
      );
  },
});
