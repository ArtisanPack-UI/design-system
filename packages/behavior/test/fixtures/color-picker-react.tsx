/**
 * ColorPicker through the React adapter (#53): a controlled parent (value in
 * state, onValueChange setting it) or an uncontrolled one. Built with esbuild
 * by color-picker-frameworks.test.ts.
 */
import { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { type ColorPickerOptions, useColorPicker } from '../../src/react';

interface Fixture {
  mount(options: { controlled?: boolean; initial?: string; picker?: ColorPickerOptions }): void;
  unmount(): void;
  value: string | null;
  events: [string, unknown][];
}

const fixture: Fixture = {
  mount(options) {
    root?.unmount();
    root = createRoot(document.getElementById('root')!);
    root.render(<Picker {...options} />);
  },
  unmount() {
    root?.unmount();
    root = undefined;
  },
  value: null,
  events: [],
};

let root: Root | undefined;

function Picker({
  controlled = true,
  initial = '#1f74bf',
  picker = {},
}: {
  controlled?: boolean;
  initial?: string;
  picker?: ColorPickerOptions;
}) {
  const [value, setValue] = useState(initial);
  fixture.value = controlled ? value : null;
  const api = useColorPicker({
    id: 'cp',
    ...picker,
    ...(controlled ? { value } : { defaultValue: initial }),
    defaultOpen: true,
    onValueChange: (details) => {
      fixture.events.push(['value-change', details.value]);
      if (controlled) setValue(details.value);
    },
  });

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        <button {...api.getTriggerProps()}>
          <span {...api.getSwatchProps({ value: api.value })} />
        </button>
        <input {...api.getValueInputProps({ id: 'cp-input' })} />
      </div>
      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <div
            {...api.getAreaProps()}
            style={{ ...(api.getAreaProps().style as object), width: 200, height: 100 }}
          >
            <div
              {...api.getAreaBackgroundProps()}
              style={{ ...(api.getAreaBackgroundProps().style as object), height: '100%' }}
            />
            <div
              {...api.getAreaThumbProps()}
              style={{ ...(api.getAreaThumbProps().style as object), width: 10, height: 10 }}
            />
          </div>
          <div {...api.getChannelSliderProps({ channel: 'hue' })}>
            <div
              {...api.getChannelSliderTrackProps({ channel: 'hue' })}
              style={{
                ...(api.getChannelSliderTrackProps({ channel: 'hue' }).style as object),
                width: 200,
                height: 10,
              }}
            >
              <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} />
            </div>
          </div>
          <div {...api.getSwatchGroupProps()}>
            <button {...api.getSwatchTriggerProps({ value: '#0b9488' })} id="cp-swatch-teal">
              <span {...api.getSwatchProps({ value: '#0b9488' })} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

(window as unknown as { colorFixture: Fixture }).colorFixture = fixture;
