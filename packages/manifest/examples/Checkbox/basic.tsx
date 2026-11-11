import { useState } from 'react';
import { Checkbox } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Checkbox
      label="Send me the monthly newsletter"
      checked={newsletter}
      onCheckedChange={setNewsletter}
    />
  );
}
