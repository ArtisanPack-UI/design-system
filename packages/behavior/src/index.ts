/**
 * @artisanpack-ui/behavior
 *
 * The shared interaction engine (#32): Zag state machines for the hard
 * widgets, Floating UI for positioning, and adapters per stack. The Alpine
 * adapter is `@artisanpack-ui/behavior/alpine`; React and Vue are
 * `@artisanpack-ui/behavior/react` and `@artisanpack-ui/behavior/vue` (#36).
 */

/** The npm package name. */
export const packageName = '@artisanpack-ui/behavior';

export { keepClientState, keepClientStateInLivewire } from './core/morph';
export { applyProps, hasProps, removeProps, type Attrs } from './core/props';
export { createWidget, type Normalize, type Widget, type WidgetDefinition } from './core/widget';
export {
  directionOf,
  position,
  toPlacement,
  zagPositioning,
  type Direction,
  type LogicalPlacement,
  type PositionOptions,
  type Side,
} from './positioning';
export { dialog, type DialogApi, type DialogProps } from './widgets/dialog';
export {
  DROPDOWN_MENU_SCOPE,
  dropdownMenu,
  rescope,
  type DropdownMenuApi,
  type DropdownMenuProps,
} from './widgets/dropdown-menu';
export { menuPlacement, type MenuAlign } from './core/options';
export {
  createToaster,
  staticToastParts,
  TOAST_ICONS,
  toast,
  toastGroup,
  toastMeta,
  toZagToast,
  toZagToastPatch,
  type StaticToastIds,
  type ToastApi,
  type ToastColor,
  type Toaster,
  type ToasterOptions,
  type ToastGroupApi,
  type ToastGroupProps,
  type ToastMeta,
  type ToastOptions,
  type ToastPlacement,
  type ToastProps,
  type ToastStore,
} from './widgets/toast';
export {
  combobox,
  createCollection,
  filterItems,
  type ComboboxApi,
  type ComboboxItem,
  type ComboboxProps,
} from './widgets/combobox';
export {
  defaultIcons,
  ICON_SHAPE_TAGS,
  ICON_SVG_ATTRIBUTES,
  isSafeIconBody,
  iconNames,
  iconSvg,
  registerIcons,
  resetIcons,
  resolveIcon,
  type IconSet,
  UnsafeIconError,
} from './icons';
