import { useState } from 'react';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/react';

export default function DateTimeExample() {
  const [viewingAt, setViewingAt] = useState<DatePickerValue>(null);

  return (
    <DatePicker
      time
      step={30}
      timeZone="Europe/Madrid"
      label="Viewing"
      value={viewingAt}
      onValueChange={setViewingAt}
    />
  );
}
