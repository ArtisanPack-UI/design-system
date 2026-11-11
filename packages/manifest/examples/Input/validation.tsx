import { Input } from '@artisanpack-ui/react';

export default function ValidationExample() {
  return (
    <>
      <Input
        label="Username"
        hint="Letters and numbers only."
        error="That username is taken."
        defaultValue="jacob"
      />
      <Input label="Account ID" value="AP-20931" readonly />
      <Input label="Team" value="Design" disabled />
    </>
  );
}
