import { useState } from 'react';
import { Combobox } from '@artisanpack-ui/react';

const properties = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: 'United States, Chicago' },
  { value: 'lakeside', label: 'Lakeside Commons', description: 'Canada, Toronto' },
  {
    value: 'silver-lake',
    label: 'Silver Lake Bungalows',
    description: 'United States, Los Angeles',
  },
];

export default function BasicExample() {
  const [property, setProperty] = useState<string | null>(null);

  return (
    <Combobox
      label="Property"
      leadingIcon="search"
      options={properties}
      value={property}
      onValueChange={(value) => setProperty(value as string | null)}
    />
  );
}
