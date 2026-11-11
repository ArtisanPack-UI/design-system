import { Checkbox } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <>
      <Checkbox label="I agree to the listing terms" error="Required to publish." required />
      <Checkbox label="Managed by your organization" checked disabled />
    </>
  );
}
