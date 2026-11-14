import { Pin } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <>
      <Pin
        label="Verification code"
        groupSize={3}
        defaultValue="991027"
        error="That code has expired. We sent a new one."
      />
      <Pin label="Small" size="sm" groupSize={3} />
      <Pin label="Disabled" value="503186" groupSize={3} disabled />
    </>
  );
}
