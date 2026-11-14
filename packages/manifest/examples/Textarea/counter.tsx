import { useState } from 'react';
import { Textarea } from '@artisanpack-ui/react';

export default function CounterExample() {
  const [description, setDescription] = useState('');

  return (
    <Textarea
      label="Description"
      placeholder="Describe the property, nearby amenities and anything renters should know…"
      maxLength={500}
      autoResize
      value={description}
      onValueChange={setDescription}
    />
  );
}
