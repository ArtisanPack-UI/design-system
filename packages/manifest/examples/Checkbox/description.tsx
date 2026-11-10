import { Checkbox } from '@artisanpack-ui/react';

export default function DescriptionExample() {
  return (
    <Checkbox
      label="Email me when a property gets a new offer"
      description="Sent at most once a day, as a summary."
      defaultChecked
    />
  );
}
