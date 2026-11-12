/**
 * Accordion and Collapse through the React adapter (#58), with the same ids
 * as the Alpine tests. `window.disclosureFixture.mount({ widget, mode, … })`.
 */
import { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { useAccordion, useCollapse } from '../../src/react';
import {
  ACCORDION_IDS,
  COLLAPSE_IDS,
  type DisclosureFixture,
  installDisclosure,
  ITEMS,
} from './disclosure-shared';

const parent: { set?: (value: string[] | boolean) => void } = {};
const fixture = installDisclosure({ mount, set: (value) => parent.set?.(value) });
let root: Root | undefined;

function Accordion({ options }: { options: DisclosureFixture }) {
  const [value, setValue] = useState<string[]>(options.initial ?? []);
  parent.set = (next) => setValue(next as string[]);
  const accordion = useAccordion({
    ids: ACCORDION_IDS,
    multiple: options.multiple,
    ...(options.mode === 'uncontrolled' ? { defaultValue: options.initial } : { value }),
    onValueChange: (details) => {
      fixture.events.push(['value-change', details]);
      if (options.mode === 'controlled') setValue(details.value);
    },
  });
  fixture.value = options.mode === 'uncontrolled' ? accordion.value : value;

  return (
    <div {...accordion.getRootProps()}>
      {ITEMS.map(([v, title, disabled]) => (
        <div key={v} {...accordion.getItemProps({ value: v, disabled })}>
          <h3>
            <button {...accordion.getItemTriggerProps({ value: v, disabled })}>
              {title}
              <span {...accordion.getItemIndicatorProps({ value: v })} />
            </button>
          </h3>
          <div {...accordion.getItemContentProps({ value: v })}>{title} answer</div>
        </div>
      ))}
    </div>
  );
}

function Collapse({ options }: { options: DisclosureFixture }) {
  const [open, setOpen] = useState(options.open ?? false);
  parent.set = (next) => setOpen(next as boolean);
  const collapse = useCollapse({
    ids: COLLAPSE_IDS,
    variant: options.variant,
    ...(options.mode === 'uncontrolled' ? { defaultOpen: options.open } : { open }),
    onOpenChange: (details) => {
      fixture.events.push(['open-change', details]);
      if (options.mode === 'controlled') setOpen(details.open);
    },
  });
  fixture.value = options.mode === 'uncontrolled' ? collapse.open : open;

  return (
    <div {...collapse.getRootProps()}>
      <button {...collapse.getTriggerProps()}>
        Advanced settings
        <span {...collapse.getIndicatorProps()} />
      </button>
      <div {...collapse.getContentProps()}>Custom URL and search visibility.</div>
    </div>
  );
}

function mount(options: DisclosureFixture) {
  root?.unmount();
  fixture.events = [];
  root = createRoot(document.getElementById('root')!);
  root.render(
    options.widget === 'accordion' ? (
      <Accordion options={options} />
    ) : (
      <Collapse options={options} />
    ),
  );
}
