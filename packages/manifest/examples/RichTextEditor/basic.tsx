import { useState } from 'react';
import { RichTextEditor } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [description, setDescription] = useState('<p>Twenty-four bright apartments.</p>');

  return (
    <RichTextEditor
      label="Description"
      hint="Shown on the listing page."
      counter
      value={description}
      onValueChange={setDescription}
    />
  );
}
