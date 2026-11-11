import { useState } from 'react';
import { Textarea } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [notes, setNotes] = useState('');

  return (
    <Textarea
      label="Notes"
      hint="Only your team sees these."
      rows={3}
      value={notes}
      onValueChange={setNotes}
    />
  );
}
