import { Password } from '@artisanpack-ui/react';

export default function ValidationExample() {
  return (
    <>
      <Password
        label="Confirm password"
        autocomplete="new-password"
        error="Passwords don't match."
      />
      <Password label="Current password" error="That password is incorrect." />
    </>
  );
}
