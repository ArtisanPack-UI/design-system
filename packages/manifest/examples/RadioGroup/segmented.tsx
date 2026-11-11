import { useState } from 'react';
import { RadioGroup } from '@artisanpack-ui/react';

const periods = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function SegmentedExample() {
  const [period, setPeriod] = useState('monthly');

  return (
    <RadioGroup
      label="Billing period"
      variant="segmented"
      orientation="horizontal"
      options={periods}
      value={period}
      onValueChange={(value) => setPeriod(String(value))}
    />
  );
}
