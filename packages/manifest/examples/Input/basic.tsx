import { useState } from 'react';
import { Input } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [email, setEmail] = useState('');

  return (
    <Input
      type="email"
      label="Email"
      hint="We never share it."
      placeholder="you@example.com"
      required
      value={email}
      onValueChange={setEmail}
    />
  );
}
