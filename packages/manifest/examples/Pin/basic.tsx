import { useState } from 'react';
import { Pin } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [code, setCode] = useState('');

  return (
    <Pin
      label="Verification code"
      hint="Enter the 6-digit code we sent to your phone."
      groupSize={3}
      value={code}
      onValueChange={setCode}
      onComplete={(value) => console.log('verify', value)}
    />
  );
}
