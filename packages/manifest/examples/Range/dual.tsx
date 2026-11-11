import { useState } from 'react';
import { Range, type RangeValue } from '@artisanpack-ui/react';

export default function DualExample() {
  const [price, setPrice] = useState<RangeValue>([200, 450]);

  return (
    <Range
      label="Price"
      dual
      min={100}
      max={700}
      step={10}
      format="${value}k"
      showValue="always"
      value={price}
      onValueChange={setPrice}
    />
  );
}
