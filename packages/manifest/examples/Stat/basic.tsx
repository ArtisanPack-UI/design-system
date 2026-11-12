import { Stat } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Stat
      label="Total revenue"
      value="7,415,644"
      icon="wallet"
      color="info"
      change={-5.4}
      description="vs last month"
    />
  );
}
