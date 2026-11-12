import { Card, Grid } from '@artisanpack-ui/react';

const stats = ['Revenue', 'Orders', 'Visitors', 'Refunds'];

export default function ResponsiveExample() {
  return (
    <Grid columns={4} minItemWidth="16rem">
      {stats.map((label) => (
        <Card key={label} title={label} />
      ))}
    </Grid>
  );
}
