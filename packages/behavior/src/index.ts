/**
 * @artisanpack-ui/behavior
 *
 * The shared interaction engine (#32): Zag state machines for the hard
 * widgets, Floating UI for positioning, and adapters per stack. The Alpine
 * adapter is `@artisanpack-ui/behavior/alpine`; React and Vue follow in #36.
 */

/** The npm package name. */
export const packageName = '@artisanpack-ui/behavior';

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
  combobox,
  createCollection,
  filterItems,
  type ComboboxApi,
  type ComboboxItem,
  type ComboboxProps,
} from './widgets/combobox';
