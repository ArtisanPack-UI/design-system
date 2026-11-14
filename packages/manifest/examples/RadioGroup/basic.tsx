import { useState } from 'react';
import { RadioGroup } from '@artisanpack-ui/react';

const options = [
  { value: 'public', label: 'Public', description: 'Anyone can find it in search.' },
  { value: 'unlisted', label: 'Unlisted', description: 'Only people with the link.' },
  { value: 'private', label: 'Private', description: 'Only you and co-owners.' },
];

export default function BasicExample() {
  const [visibility, setVisibility] = useState('public');

  return (
    <RadioGroup
      label="Listing visibility"
      options={options}
      value={visibility}
      onValueChange={(value) => setVisibility(String(value))}
    />
  );
}
