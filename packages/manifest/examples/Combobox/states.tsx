import { useState } from 'react';
import { Combobox } from '@artisanpack-ui/react';

const people = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
];

export default function StatesExample() {
  const [owner, setOwner] = useState<string | null>(null);

  return (
    <>
      <Combobox
        label="Owner"
        placeholder="Search people…"
        required
        clearable
        error={owner ? undefined : 'Choose an owner from the list.'}
        options={people}
        value={owner}
        onValueChange={(value) => setOwner(value as string | null)}
      />
      <Combobox size="sm" label="Small" options={people} />
      <Combobox size="lg" label="Large" options={people} disabled />
    </>
  );
}
