import { useState } from 'react';
import { RichTextEditor } from '@artisanpack-ui/react';

export default function CompactExample() {
  const [note, setNote] = useState('');

  return (
    <RichTextEditor
      toolbar="compact"
      label="Note to buyer"
      placeholder="Write a note for the buyer…"
      value={note}
      onValueChange={setNote}
    />
  );
}
