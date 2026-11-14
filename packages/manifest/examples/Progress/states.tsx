import { Progress } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <>
      <Progress indeterminate label="Preparing export" valueText="Estimating…" />
      <Progress segmented value={3} max={5} label="Listing setup" valueText="3 of 5" />
    </>
  );
}
