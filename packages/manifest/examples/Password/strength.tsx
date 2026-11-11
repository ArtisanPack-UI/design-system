import { useState } from 'react';
import { Password } from '@artisanpack-ui/react';

export default function StrengthExample() {
  const [password, setPassword] = useState('');

  return (
    <Password
      label="New password"
      autocomplete="new-password"
      leadingIcon="lock"
      strengthMeter
      requirements={[
        { label: 'At least 12 characters', pattern: '.{12,}' },
        { label: 'One number', pattern: '\\d' },
        { label: 'One symbol', pattern: '[^A-Za-z0-9]' },
      ]}
      value={password}
      onValueChange={setPassword}
    />
  );
}
