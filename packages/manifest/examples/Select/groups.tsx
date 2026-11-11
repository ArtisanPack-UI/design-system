import { useState } from 'react';
import { Select } from '@artisanpack-ui/react';

const types = [
  {
    label: 'Apartments',
    options: [
      { value: 'studio', label: 'Studio' },
      { value: 'loft', label: 'Loft' },
    ],
  },
  {
    label: 'Houses',
    options: [
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'detached', label: 'Detached house' },
    ],
  },
];

export default function GroupsExample() {
  const [type, setType] = useState('');

  return (
    <Select
      label="Property type"
      options={types}
      value={type}
      onValueChange={(value) => setType(String(value))}
    />
  );
}
