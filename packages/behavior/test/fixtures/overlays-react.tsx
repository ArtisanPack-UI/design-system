/**
 * Drawer, Popover and Tooltip through the React adapter (#58, #59), with the
 * same ids as the Alpine tests. `window.overlaysFixture.mount({ mode })`.
 */
import { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { useDrawer, usePopover, useTooltip } from '../../src/react';
import {
  DRAWER_IDS,
  installOverlays,
  type OverlaysFixture,
  POPOVER_IDS,
  TOOLTIP_IDS,
} from './overlays-shared';

const setters: Record<string, (open: boolean) => void> = {};
const fixture = installOverlays({ mount, set: (widget, open) => setters[widget]?.(open) });
let root: Root | undefined;

function useOpen(name: string, options: OverlaysFixture) {
  const [open, setOpen] = useState(false);
  setters[name] = setOpen;
  return options.mode === 'controlled'
    ? {
        open,
        onOpenChange: ({ open: next }: { open: boolean }) => {
          fixture.events.push([`${name}:open-change`, next]);
          setOpen(next);
        },
      }
    : {
        onOpenChange: ({ open: next }: { open: boolean }) =>
          fixture.events.push([`${name}:open-change`, next]),
      };
}

function Overlays({ options }: { options: OverlaysFixture }) {
  const drawer = useDrawer({ ids: DRAWER_IDS, ...useOpen('drawer', options) });
  const popover = usePopover({
    ids: POPOVER_IDS,
    placement: options.placement,
    ...useOpen('popover', options),
  });
  const tooltip = useTooltip({
    ids: TOOLTIP_IDS,
    placement: options.placement ?? 'top',
    delay: 100,
    ...useOpen('tooltip', options),
  });
  return (
    <div style={{ padding: 160 }}>
      <button {...drawer.getTriggerProps()}>Filters</button>
      <div {...drawer.getBackdropProps()} />
      <div {...drawer.getPositionerProps()}>
        <aside {...drawer.getContentProps()}>
          <h2 {...drawer.getTitleProps()}>Filters</h2>
          <input id="d-field" />
          <button {...drawer.getCloseTriggerProps()}>Close</button>
        </aside>
      </div>
      <button {...popover.getTriggerProps()}>Share</button>
      <div {...popover.getPositionerProps()}>
        <div {...popover.getContentProps()}>
          <span {...popover.getArrowProps()} />
          <h3 {...popover.getTitleProps()}>Share report</h3>
          <button id="p-copy">Copy</button>
        </div>
      </div>
      <button {...tooltip.getTriggerProps()} aria-label="Archive">
        A
      </button>
      <div {...tooltip.getPositionerProps()}>
        <div {...tooltip.getContentProps()}>
          <span {...tooltip.getArrowProps()} />
          Archive
        </div>
      </div>
    </div>
  );
}

function mount(options: OverlaysFixture) {
  root?.unmount();
  root = createRoot(document.getElementById('root')!);
  root.render(<Overlays options={options} />);
}
