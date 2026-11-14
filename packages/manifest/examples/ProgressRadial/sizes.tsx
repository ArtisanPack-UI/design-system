import { ProgressRadial } from '@artisanpack-ui/react';

export default function SizesExample() {
  return (
    <>
      <ProgressRadial value={68} size={40} thickness={4} hideValue label="Profile complete" />
      <ProgressRadial value={68} size={80} thickness={7} label="complete" />
      <ProgressRadial value={68} size={112} thickness={9} label="of goal" />
    </>
  );
}
