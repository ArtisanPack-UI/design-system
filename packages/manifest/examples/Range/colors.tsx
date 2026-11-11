import { Range } from '@artisanpack-ui/react';

export default function ColorsExample() {
  return (
    <>
      <Range label="Volume" defaultValue={80} color="success" />
      <Range label="Opacity" defaultValue={30} size="sm" />
      <Range label="Locked" defaultValue={50} disabled />
    </>
  );
}
