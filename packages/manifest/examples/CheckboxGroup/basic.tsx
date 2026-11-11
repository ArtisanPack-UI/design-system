import { useState } from 'react';
import { CheckboxGroup } from '@artisanpack-ui/react';

const topics = [
  { value: 'offers', label: 'New offers', description: 'Within an hour of submission' },
  { value: 'prices', label: 'Price changes in saved searches' },
  { value: 'digest', label: 'Weekly analytics digest' },
  { value: 'news', label: 'Product news' },
];

export default function BasicExample() {
  const [notifications, setNotifications] = useState<(string | number)[]>(['offers']);

  return (
    <CheckboxGroup
      label="Notify me about"
      options={topics}
      selectAll
      value={notifications}
      onValueChange={setNotifications}
    />
  );
}
