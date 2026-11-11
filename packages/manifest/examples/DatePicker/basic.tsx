import { useState } from 'react';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [moveIn, setMoveIn] = useState<DatePickerValue>(null);

  return (
    <DatePicker
      label="Move-in date"
      hint="MM/DD/YYYY"
      required
      value={moveIn}
      onValueChange={setMoveIn}
    />
  );
}
