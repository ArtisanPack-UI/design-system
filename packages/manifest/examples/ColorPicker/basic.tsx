import { useState } from 'react';
import { ColorPicker } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [primary, setPrimary] = useState('#1f74bf');

  return <ColorPicker label="Primary color" value={primary} onValueChange={setPrimary} />;
}
