/**
 * Dialog and Combobox through the React adapter, with the same markup and ids
 * as the Alpine tests. Built with esbuild and loaded into Chromium.
 */
import { type ReactNode, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import type { ComboboxValue } from '../../src/core/options';
import { useCombobox, useDialog } from '../../src/react';
import {
  COMBOBOX_IDS,
  COUNTRIES,
  type ComboboxFixture,
  DIALOG_IDS,
  type DialogFixture,
  install,
  toItems,
} from './shared';

/** The parent's setters and the latest state, for `fixture.set` and `fixture.get`. */
const parent: {
  setOpen?: (open: boolean) => void;
  setValue?: (value: ComboboxValue) => void;
  setItems?: (items: [string, string][]) => void;
  open?: boolean;
  value?: ComboboxValue;
} = {};

function Dialog({ options }: { options: DialogFixture }) {
  const [open, setOpen] = useState(options.initial ?? false);
  parent.setOpen = setOpen;
  const dialog = useDialog({
    id: options.id,
    ids: DIALOG_IDS,
    ...(options.mode === 'uncontrolled' ? { defaultOpen: options.initial } : { open }),
    onOpenChange: (details) => {
      fixture.events.push(['open-change', details]);
      if (options.mode === 'controlled') setOpen(details.open);
    },
  });
  parent.open = options.mode === 'uncontrolled' ? dialog.open : open;

  return (
    <div id="dialog">
      <button {...dialog.getTriggerProps()}>Edit profile</button>
      <div {...dialog.getBackdropProps()} />
      <div {...dialog.getPositionerProps()}>
        <div {...dialog.getContentProps()}>
          <h2 {...dialog.getTitleProps()}>Edit profile</h2>
          <p {...dialog.getDescriptionProps()}>Saved 0 times.</p>
          <input id="name" defaultValue="Jordan" />
          <button id="save">Save</button>
          <button {...dialog.getCloseTriggerProps()}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Combobox({ options }: { options: ComboboxFixture }) {
  const [value, setValue] = useState<ComboboxValue>(
    options.initial ?? (options.multiple ? [] : null),
  );
  const [pairs, setPairs] = useState(options.items ?? COUNTRIES);
  parent.setValue = setValue;
  parent.setItems = setPairs;
  const items = useMemo(() => toItems(pairs), [pairs]);

  const cb = useCombobox({
    id: options.id,
    ids: COMBOBOX_IDS,
    items,
    multiple: options.multiple,
    remote: options.remote,
    ...(options.mode === 'uncontrolled' ? { defaultValue: options.initial } : { value }),
    onValueChange: (details) => {
      fixture.events.push(['value-change', details]);
      if (options.mode === 'controlled') setValue(details.value);
    },
    onInputValueChange: (details) => fixture.events.push(['input-value-change', details]),
    onOpenChange: (details) => fixture.events.push(['open-change', details]),
  });
  parent.value =
    options.mode === 'uncontrolled' ? (options.multiple ? cb.value : (cb.value[0] ?? null)) : value;

  return (
    <div id="cb">
      <label {...cb.getLabelProps()}>Country</label>
      <div {...cb.getControlProps()}>
        <input {...cb.getInputProps()} />
        <button {...cb.getTriggerProps()}>▾</button>
      </div>
      <div {...cb.getPositionerProps()}>
        <ul {...cb.getContentProps()}>
          {cb.items.map((item) => (
            <li key={item.value} {...cb.getItemProps({ item })}>
              {item.label}
            </li>
          ))}
          <li id="cb-empty" {...cb.getEmptyProps()}>
            No matches
          </li>
        </ul>
      </div>
    </div>
  );
}

let root: Root | undefined;

function render(node: ReactNode) {
  fixture.unmount();
  const host = document.querySelector('#root')!;
  root = createRoot(host);
  flushSync(() => root!.render(node));
}

const fixture = install({
  dialog: (options) => render(<Dialog options={options} />),
  combobox: (options) => render(<Combobox options={options} />),
  unmount() {
    if (!root) return;
    const current = root;
    root = undefined;
    flushSync(() => current.unmount());
  },
  set(key, value) {
    flushSync(() => {
      if (key === 'open') parent.setOpen?.(value as boolean);
      if (key === 'value') parent.setValue?.(value as ComboboxValue);
      if (key === 'items') parent.setItems?.(value as [string, string][]);
    });
  },
  get: (key) => parent[key],
});
