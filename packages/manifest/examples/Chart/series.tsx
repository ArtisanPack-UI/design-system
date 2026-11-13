import { Button, Chart } from '@artisanpack-ui/react';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'];

export default function SeriesExample() {
  return (
    <Chart
      type="area"
      title="Analytic"
      description="Sales estimation vs target"
      labels={quarters}
      series={[
        {
          name: 'Sales',
          data: [600000, 1800000, 2600000, 3200000, 3600000, 4400000, 6100000, 7400000],
        },
        {
          name: 'Target',
          data: [3200000, 4400000, 3800000, 5200000, 6100000, 6600000, 7000000, 6400000],
        },
      ]}
      prefix="$"
      notation="compact"
      width={1000}
      height={260}
      actions={
        <Button size="xs" variant="ghost" color="neutral">
          Export
        </Button>
      }
    />
  );
}
