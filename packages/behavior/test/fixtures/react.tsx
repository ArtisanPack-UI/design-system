/**
 * Dialog and Combobox through the React adapter, with the same markup and ids
 * as the Alpine tests. Built with esbuild and loaded into Chromium.
 */
import { type ReactNode, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import type { ComboboxValue } from '../../src/core/options';
import {
  createToaster,
  type Toaster as CoreToaster,
  type ToasterApi,
  type ToastEntry,
  useCombobox,
  useDialog,
  useDropdownMenu,
  useToast,
  useToaster,
} from '../../src/react';
import {
  COMBOBOX_IDS,
  COUNTRIES,
  type ComboboxFixture,
  DIALOG_IDS,
  type DialogFixture,
  install,
  MENU_IDS,
  MENU_ITEMS,
  type MenuFixture,
  toItems,
  type ToasterFixture,
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

function Menu({ options }: { options: MenuFixture }) {
  const [open, setOpen] = useState(options.initial ?? false);
  const [grid, setGrid] = useState(false);
  parent.setOpen = setOpen;
  const menu = useDropdownMenu({
    id: options.id,
    ids: MENU_IDS,
    ...(options.mode === 'uncontrolled' ? { defaultOpen: options.initial } : { open }),
    onOpenChange: (details) => {
      fixture.events.push(['open-change', details]);
      if (options.mode === 'controlled') setOpen(details.open);
    },
    onSelect: (details) => fixture.events.push(['select', details]),
  });
  parent.open = options.mode === 'uncontrolled' ? menu.open : open;
  const option = {
    type: 'checkbox' as const,
    value: 'grid',
    checked: grid,
    onCheckedChange: (checked: boolean) => {
      fixture.events.push(['checked-change', { value: 'grid', checked }]);
      setGrid(checked);
    },
  };

  return (
    <div id="menu">
      <button {...menu.getTriggerProps()}>Options</button>
      <div {...menu.getPositionerProps()}>
        <div {...menu.getContentProps()}>
          <div {...menu.getItemGroupProps({ id: 'edit' })}>
            <div {...menu.getItemGroupLabelProps({ htmlFor: 'edit' })}>Edit</div>
            {MENU_ITEMS.map(([value, label, disabled]) => (
              <div key={value} {...menu.getItemProps({ value, disabled })}>
                <span {...menu.getItemTextProps({ value })}>{label}</span>
              </div>
            ))}
          </div>
          <hr {...menu.getSeparatorProps()} />
          <div {...menu.getOptionItemProps(option)}>
            <span {...menu.getItemIndicatorProps(option)}>✓</span>
            <span {...menu.getItemTextProps(option)}>Show grid</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToastItem({
  entry,
  parentService,
  index,
}: {
  entry: ToastEntry;
  parentService: ToasterApi['service'];
  index: number;
}) {
  const toast = useToast(entry, parentService, index);
  return (
    <div {...toast.getRootProps()}>
      <span {...toast.getIconProps()} />
      <p {...toast.getTitleProps()}>{toast.title}</p>
      <p {...toast.getDescriptionProps()}>{toast.description}</p>
      <button {...toast.getCloseTriggerProps()}>×</button>
    </div>
  );
}

let toaster: CoreToaster | undefined;

function Toaster({ options }: { options: ToasterFixture }) {
  const instance = useMemo(() => (toaster = createToaster({ duration: 0 })), []);
  const region = useToaster({ toaster: instance, id: options.id });
  return (
    <div id="toaster">
      <div {...region.getGroupProps({ label: 'Notifications' })}>
        {region.toasts.map((entry, index) => (
          <ToastItem key={entry.id} entry={entry} parentService={region.service} index={index} />
        ))}
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
  menu: (options) => render(<Menu options={options} />),
  toaster: (options) => render(<Toaster options={options} />),
  toast: (options) => flushSync(() => void toaster?.create(options)),
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
