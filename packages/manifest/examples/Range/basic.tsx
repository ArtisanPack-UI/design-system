import { useState } from 'react';
import { Range, type RangeValue } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [radius, setRadius] = useState<RangeValue>(20);

  return (
    <Range
      label="Search radius"
      max={50}
      format="{value} km"
      marks={[
        { value: 0, label: '0 km' },
        { value: 25, label: '25 km' },
        { value: 50, label: '50 km' },
      ]}
      value={radius}
      onValueChange={setRadius}
    />
  );
}
