import { useState } from 'react';
import { Signature } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [signature, setSignature] = useState('');

  return (
    <Signature
      label="Signature"
      hint="Olivia Rhye · Nov 7, 2026"
      value={signature}
      onValueChange={setSignature}
    />
  );
}
