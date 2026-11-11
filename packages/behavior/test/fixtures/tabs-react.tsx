/**
 * Tabs through the React adapter (#56), with the same ids as the Alpine
 * tests. `window.tabsFixture.mount({ mode, initial, activationMode })`.
 */
import { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { useTabs } from '../../src/react';
import { TABS, TABS_IDS, type TabsFixture, installTabs } from './tabs-shared';

const fixture = installTabs({
  mount,
  set: (value) => parent.set?.(value),
  load: () => parent.load?.(),
});
const parent: { set?: (value: string) => void; load?: () => void } = {};
let root: Root | undefined;

function Tabs({ options }: { options: TabsFixture }) {
  const [value, setValue] = useState(options.initial ?? 'overview');
  parent.set = setValue;
  const [shown, setShown] = useState(options.late ? [] : TABS);
  parent.load = () => setShown(TABS);
  const tabs = useTabs({
    ids: TABS_IDS,
    activationMode: options.activationMode,
    label: 'Sections',
    ...(options.mode === 'uncontrolled' ? { defaultValue: options.initial } : { value }),
    onValueChange: (details) => {
      fixture.events.push(['value-change', details]);
      if (options.mode === 'controlled') setValue(details.value);
    },
  });
  fixture.value = options.mode === 'uncontrolled' ? tabs.value : value;

  return (
    <div id="tabs" {...tabs.getRootProps()}>
      <div {...tabs.getListProps()}>
        {shown.map(([v, label, disabled]) => (
          <button key={v} {...tabs.getTriggerProps({ value: v, disabled })}>
            {label}
          </button>
        ))}
      </div>
      {shown.map(([v, label]) => (
        <div key={v} {...tabs.getContentProps({ value: v })}>
          {label} panel
        </div>
      ))}
    </div>
  );
}

function mount(options: TabsFixture) {
  root?.unmount();
  const host = document.getElementById('root')!;
  root = createRoot(host);
  root.render(<Tabs options={options} />);
}
