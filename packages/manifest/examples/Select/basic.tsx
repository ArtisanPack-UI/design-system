import { useState } from 'react';
import { Select } from '@artisanpack-ui/react';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
];

export default function BasicExample() {
  const [country, setCountry] = useState('');

  return <Select label="Country" options={countries} value={country} onValueChange={setCountry} />;
}
