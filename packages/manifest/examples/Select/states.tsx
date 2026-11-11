import { Select } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <>
      <Select
        label="Time zone"
        hint="Used for reports and reminders."
        error="Choose a time zone."
        options={['UTC', 'America/New_York', 'Europe/Paris']}
        required
      />
      <Select label="Region" options={['North America']} disabled />
    </>
  );
}
