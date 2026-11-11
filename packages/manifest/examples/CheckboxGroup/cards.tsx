import { CheckboxGroup } from '@artisanpack-ui/react';

const channels = [
  { value: 'email', label: 'Email', description: 'olivia@company.com' },
  { value: 'sms', label: 'SMS', description: '•••• 4821' },
  { value: 'push', label: 'Push', description: '2 devices' },
];

export default function CardsExample() {
  return (
    <CheckboxGroup
      label="Channels"
      variant="cards"
      columns={3}
      options={channels}
      error="Choose at least one channel."
    />
  );
}
