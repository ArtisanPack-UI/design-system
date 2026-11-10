/**
 * The React adapter (#36). Each hook runs a widget definition's machine and
 * `connect()` through Zag's React adapter, so parts, ARIA, `data-scope` and
 * `data-part` match the Alpine adapter exactly. Spread a part's props onto its
 * element:
 *
 *   const dialog = useDialog({ open, onOpenChange: ({ open }) => setOpen(open) });
 *   <button {...dialog.getTriggerProps()}>Edit</button>
 *
 * State is controlled (`open`, `value` with `onOpenChange`, `onValueChange`)
 * or uncontrolled (`defaultOpen`, `defaultValue`), as React expects.
 */
import type { Api as ZagComboboxApi } from '@zag-js/combobox';
import type { Api as ZagDialogApi } from '@zag-js/dialog';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react';
import { useId, useMemo, useState } from 'react';

import {
  type ComboboxOptions,
  type DialogOptions,
  emptyProps,
  toComboboxProps,
  toDialogProps,
  visibleItems,
} from '../core/options';
import type { Attrs } from '../core/props';
import type { Normalize } from '../core/widget';
import { combobox, type ComboboxItem } from '../widgets/combobox';
import { dialog } from '../widgets/dialog';

export type { ComboboxOptions, ComboboxValue, DialogOptions } from '../core/options';
export type { ComboboxItem } from '../widgets/combobox';

/** The dialog's API with React props for each part. */
export type DialogApi = ZagDialogApi<PropTypes>;

/** The combobox's API with React props for each part, plus the items to render. */
export type ComboboxApi = ZagComboboxApi<PropTypes, ComboboxItem> & {
  /** The items to render: those matching the typed text, or every item when remote. */
  items: ComboboxItem[];
  /** Props for the `empty` part, shown when no item matches. */
  getEmptyProps(): Attrs;
};

/** Zag's React `normalizeProps`, typed as the definitions' `connect()` takes it. */
const normalize = normalizeProps as unknown as Normalize;

/** Dialog: focus trap, Escape and outside-click dismissal, scroll lock and focus return. */
export function useDialog(options: DialogOptions = {}): DialogApi {
  const fallback = useId();
  const service = useMachine(dialog.machine, toDialogProps(options, options.id ?? fallback));
  return dialog.connect(service, normalize) as unknown as DialogApi;
}

/**
 * Combobox: `role=combobox` with a filtered, positioned listbox. Render
 * `items` (not `options.items`) inside the content part, so local filtering
 * shows only the matches.
 */
export function useCombobox(options: ComboboxOptions): ComboboxApi {
  const fallback = useId();
  const [query, setQuery] = useState('');
  const { items: all, remote } = options;
  const items = useMemo(() => visibleItems({ items: all, remote }, query), [all, remote, query]);
  const service = useMachine(
    combobox.machine,
    toComboboxProps(options, options.id ?? fallback, items, setQuery),
  );
  const api = combobox.connect(service, normalize) as unknown as ZagComboboxApi<
    PropTypes,
    ComboboxItem
  >;
  return { ...api, items, getEmptyProps: () => emptyProps(items) };
}
