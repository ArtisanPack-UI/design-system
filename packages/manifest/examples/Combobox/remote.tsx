import { useEffect, useState } from 'react';
import { Combobox, type ComboboxOption } from '@artisanpack-ui/react';

export default function RemoteExample({
  searchPeople,
}: {
  searchPeople: (query: string) => Promise<ComboboxOption[]>;
}) {
  const [owner, setOwner] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let current = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      const results = await searchPeople(query);
      if (current) {
        setOptions(results);
        setLoading(false);
      }
    }, 300);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query, searchPeople]);

  return (
    <Combobox
      label="Owner"
      placeholder="Search people…"
      remote
      loading={loading}
      options={options}
      value={owner}
      onValueChange={(value) => setOwner(value as string | null)}
      onSearchChange={setQuery}
    />
  );
}
