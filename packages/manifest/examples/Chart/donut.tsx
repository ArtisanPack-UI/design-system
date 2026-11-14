import { Chart } from '@artisanpack-ui/react';

export default function DonutExample() {
  return (
    <Chart
      type="donut"
      title="Active listings"
      description="By country"
      labels={['United States', 'Mexico', 'Canada', 'Other']}
      series={[1240, 990, 723, 260]}
      tabular
    />
  );
}
