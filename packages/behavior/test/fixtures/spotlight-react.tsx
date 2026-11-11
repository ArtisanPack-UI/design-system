/**
 * Spotlight through the React adapter, with the same ids as the Alpine
 * tests. Built with esbuild and loaded into Chromium.
 */
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

import { useSpotlight } from '../../src/react';
import {
  install,
  SPOTLIGHT_GROUPS,
  SPOTLIGHT_IDS,
  type SpotlightFixture,
} from './spotlight-shared';

const parent: {
  setOpen?: (open: boolean) => void;
  setSearch?: (search: string) => void;
  open?: boolean;
  search?: string;
} = {};

function Palette({ options }: { options: SpotlightFixture }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  parent.setOpen = setOpen;
  parent.setSearch = setSearch;
  const spotlight = useSpotlight({
    id: 's',
    ids: SPOTLIGHT_IDS,
    groups: SPOTLIGHT_GROUPS,
    remote: options.remote,
    loading: options.loading,
    shortcut: options.shortcut,
    recent: true,
    ...(options.mode === 'controlled' ? { open } : { defaultOpen: false }),
    ...(options.controlledSearch ? { search } : {}),
    onOpenChange: (next) => {
      fixture.events.push(['open-change', { open: next }]);
      if (options.mode === 'controlled') setOpen(next);
    },
    onSearchChange: (next) => {
      fixture.events.push(['search-change', { search: next }]);
      if (options.controlledSearch) setSearch(next);
    },
    onSelect: (item) => fixture.events.push(['select', { value: item.value, item }]),
  });
  parent.open = spotlight.open;
  parent.search = spotlight.query;

  return (
    <div id="host">
      <button {...spotlight.getTriggerProps()}>Search</button>
      <div {...spotlight.getBackdropProps()} />
      <div {...spotlight.getPositionerProps()}>
        <div {...spotlight.getContentProps()} className="apui-spotlight">
          <div {...spotlight.getSearchProps()}>
            <input {...spotlight.getQueryProps()} aria-label="Search" />
            <button {...spotlight.getCloseTriggerProps()} aria-label="Close">
              Esc
            </button>
          </div>
          <div {...spotlight.getResultsProps()} aria-label="Search">
            {spotlight.groups.map((group) => (
              <div key={group.id} {...spotlight.getItemGroupProps({ id: group.id })}>
                <div {...spotlight.getItemGroupLabelProps({ htmlFor: group.id })}>
                  {group.label}
                </div>
                {group.items.map((item) =>
                  item.href ? (
                    <a key={item.value} href={item.href} {...spotlight.getItemProps({ item })}>
                      <span {...spotlight.getItemTextProps({ item })}>{item.label}</span>
                    </a>
                  ) : (
                    <div key={item.value} {...spotlight.getItemProps({ item })}>
                      <span {...spotlight.getItemTextProps({ item })}>{item.label}</span>
                    </div>
                  ),
                )}
              </div>
            ))}
            <div id="s-empty" {...spotlight.getEmptyProps()}>
              No results.
            </div>
            <div id="s-loading" {...spotlight.getLoadingProps()}>
              Searching…
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

let root: Root | undefined;

const fixture = install({
  mount(options) {
    root = createRoot(document.getElementById('root')!);
    flushSync(() => root!.render(<Palette options={options} />));
  },
  unmount() {
    root?.unmount();
    root = undefined;
  },
  set(key, value) {
    flushSync(() =>
      key === 'open' ? parent.setOpen?.(Boolean(value)) : parent.setSearch?.(String(value)),
    );
  },
  get(key) {
    return parent[key];
  },
});
