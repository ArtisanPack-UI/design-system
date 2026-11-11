import { useState } from 'react';
import { Signature } from '@artisanpack-ui/react';

export default function TypeFirstExample() {
  const [signature, setSignature] = useState('');

  return (
    <Signature
      mode="type"
      modes={['draw', 'type']}
      label="Signature"
      penColor="primary"
      value={signature}
      onValueChange={setSignature}
    />
  );
}
