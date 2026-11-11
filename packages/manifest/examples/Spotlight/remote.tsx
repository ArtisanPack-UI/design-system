import { Spotlight, type SpotlightGroup } from '@artisanpack-ui/react';
import { useEffect, useState } from 'react';

export default function RemoteExample() {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<SpotlightGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setGroups([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/spotlight?search=${encodeURIComponent(search)}`, {
          signal: controller.signal,
        });
        setGroups(await response.json());
        setLoading(false);
      } catch {
        // Aborted by the next keystroke.
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  return (
    <Spotlight
      groups={groups}
      search={search}
      onSearchChange={setSearch}
      remote
      loading={loading}
      placeholder="Search listings…"
      emptyLabel="No listings match."
    />
  );
}
