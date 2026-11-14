import { useState } from 'react';
import { Combobox, type ComboboxOption } from '@artisanpack-ui/react';

export default function TagsExample() {
  const [tags, setTags] = useState<string[]>(['Downtown']);
  const [options, setOptions] = useState<ComboboxOption[]>([
    { value: 'Downtown', label: 'Downtown' },
    { value: 'Garden', label: 'Garden', color: 'success' },
    { value: 'Gated community', label: 'Gated community', color: 'info' },
  ]);

  return (
    <Combobox
      label="Listing tags"
      placeholder="Add a tag…"
      hint="Press Enter to add, Backspace to remove the last tag."
      multiple
      allowCreate
      max={8}
      options={options}
      value={tags}
      onValueChange={(value) => setTags(value as string[])}
      onCreate={(value) => setOptions((current) => [...current, { value, label: value }])}
    />
  );
}
