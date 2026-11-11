import { useState } from 'react';
import { Password } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [password, setPassword] = useState('');

  return (
    <Password
      label="Password"
      leadingIcon="lock"
      required
      value={password}
      onValueChange={setPassword}
    />
  );
}
