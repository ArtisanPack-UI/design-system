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
import type { Api as ZagMenuApi } from '@zag-js/menu';
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react';
import type { GroupService, Props as ZagToastProps } from '@zag-js/toast';
import { useId, useMemo, useState } from 'react';

import {
  type ComboboxOptions,
  type DialogOptions,
  type DropdownMenuOptions,
  emptyProps,
  toComboboxProps,
  toDialogProps,
  toDropdownMenuProps,
  type ToastGroupOptions,
  toToastGroupProps,
  visibleItems,
} from '../core/options';
import type { Attrs } from '../core/props';
import type { Normalize } from '../core/widget';
import { combobox, type ComboboxItem } from '../widgets/combobox';
import { dialog } from '../widgets/dialog';
import { dropdownMenu } from '../widgets/dropdown-menu';
import { toast, type ToastApi as CoreToastApi, toastGroup } from '../widgets/toast';

export type {
  ComboboxOptions,
  ComboboxValue,
  DialogOptions,
  DropdownMenuOptions,
  MenuAlign,
  ToastGroupOptions,
} from '../core/options';
export type { ComboboxItem } from '../widgets/combobox';
export {
  createToaster,
  staticToastParts,
  TOAST_ICONS,
  type Toaster,
  type ToasterOptions,
  type ToastOptions,
} from '../widgets/toast';

/** The dialog's API with React props for each part. */
export type DialogApi = ZagDialogApi<PropTypes>;

/** The combobox's API with React props for each part, plus the items to render. */
export type ComboboxApi = ZagComboboxApi<PropTypes, ComboboxItem> & {
  /** The items to render: those matching the typed text, or every item when remote. */
  items: ComboboxItem[];
  /** Props for the `empty` part, shown when no item matches. */
  getEmptyProps(): Attrs;
};

/** The dropdown menu's API with React props for each part. */
export type DropdownMenuApi = ZagMenuApi<PropTypes>;

/** One toast's API with React props for each part. */
export type ToastApi = CoreToastApi;

/** A toast as the region lists it: the props to pass to `useToast`. */
export type ToastEntry = Partial<ZagToastProps<string>>;

/** The region's API, plus the service each toast in it runs under. */
export interface ToasterApi {
  /** The toasts to render, newest first. */
  toasts: ToastEntry[];
  /** Props for the region (Zag's `group` part). */
  getGroupProps(options?: { label?: string }): Record<string, unknown>;
  /** Pass to `useToast` for each toast. */
  service: GroupService;
}

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

/**
 * DropdownMenu: `role=menu` with arrow keys, typeahead and dismissal. Items
 * are `getItemProps({ value })`; checkbox and radio items are
 * `getOptionItemProps({ type, value, checked, onCheckedChange })`.
 */
export function useDropdownMenu(options: DropdownMenuOptions = {}): DropdownMenuApi {
  const fallback = useId();
  const service = useMachine(
    dropdownMenu.machine,
    toDropdownMenuProps(options, options.id ?? fallback),
  );
  return dropdownMenu.connect(service, normalize) as unknown as DropdownMenuApi;
}

/**
 * The toast region: renders a toaster's toasts. Spread `getGroupProps()` on
 * the region and render each of `toasts` with `useToast(toast, service, index)`.
 */
export function useToaster(options: ToastGroupOptions): ToasterApi {
  const fallback = useId();
  const service = useMachine(
    toastGroup.machine,
    toToastGroupProps(options, options.id ?? fallback),
  );
  const api = toastGroup.connect(service, normalize);
  return {
    toasts: api.getToasts() as ToastEntry[],
    getGroupProps: (groupOptions) => api.getGroupProps(groupOptions) as Record<string, unknown>,
    service: service as unknown as GroupService,
  };
}

/** One toast in a region: its timer, Escape, and the action and close triggers. */
export function useToast(entry: ToastEntry, parent: GroupService, index: number): ToastApi {
  const service = useMachine(toast.machine, { ...entry, parent, index } as never);
  return toast.connect(service, normalize) as unknown as ToastApi;
}
