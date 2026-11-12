import { ProgressRadial } from '@artisanpack-ui/react';

export default function ColorsExample() {
  return (
    <>
      <ProgressRadial value={85} color="success" size={76} aria-label="Main debt repaid" />
      <ProgressRadial value={60} color="info" size={76} aria-label="Fines returned" />
      <ProgressRadial indeterminate size={48} thickness={5} aria-label="Calculating" />
    </>
  );
}
