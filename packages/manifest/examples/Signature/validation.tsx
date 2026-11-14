import { useState } from 'react';
import { Signature } from '@artisanpack-ui/react';

export default function ValidationExample() {
  const [signature, setSignature] = useState('');

  return (
    <Signature
      label="Signature"
      hint="Olivia Rhye · Nov 7, 2026"
      required
      error={signature === '' ? 'Sign to accept the lease.' : undefined}
      value={signature}
      onValueChange={setSignature}
    />
  );
}
