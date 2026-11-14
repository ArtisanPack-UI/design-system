import { KpiCard } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <KpiCard
      stat={{
        label: 'Profit',
        value: '$15,708.98',
        icon: 'trending-up',
        color: 'success',
        change: 8.1,
        description: 'vs last month',
      }}
      sparkline={[2, 4, 2, 6, 8, 6, 10, 12, 14]}
      target={{ value: 15708.98, max: 25000, label: 'Goal $25,000' }}
    />
  );
}
