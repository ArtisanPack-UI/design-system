import { Select } from '@artisanpack-ui/react';

export default function OptionsExample() {
  return (
    <Select label="Plan" leadingIcon="user">
      <option value="starter">Starter</option>
      <option value="team">Team</option>
      <option value="enterprise" disabled>
        Enterprise (contact us)
      </option>
    </Select>
  );
}
