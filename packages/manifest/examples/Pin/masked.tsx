import { Pin } from '@artisanpack-ui/react';

export default function MaskedExample() {
  return (
    <>
      <Pin label="PIN" length={4} mask />
      <Pin label="Recovery code" length={8} type="alphanumeric" groupSize={4} />
    </>
  );
}
