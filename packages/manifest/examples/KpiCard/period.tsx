import { KpiCard, Select } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function PeriodExample() {
  const [period, setPeriod] = useState('month');

  return (
    <KpiCard
      stat={{
        label: 'Total income',
        value: '$348,261',
        change: 10.9,
        description: 'vs last month',
      }}
      sparkline={[1, 3, 2, 7, 6, 10, 12, 11, 16]}
      period={
        <Select
          label="Period"
          size="sm"
          value={period}
          onValueChange={(value) => setPeriod(String(value))}
          options={[
            { value: 'month', label: 'This month' },
            { value: 'quarter', label: 'This quarter' },
          ]}
        />
      }
    />
  );
}
