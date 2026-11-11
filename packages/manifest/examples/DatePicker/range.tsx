import { useState } from 'react';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/react';

export default function RangeExample({ blackoutDates }: { blackoutDates: string[] }) {
  const [stay, setStay] = useState<DatePickerValue>([]);

  return (
    <DatePicker
      mode="range"
      label="Stay"
      min={new Date().toISOString().slice(0, 10)}
      disabledDates={blackoutDates}
      value={stay}
      onValueChange={setStay}
    />
  );
}
