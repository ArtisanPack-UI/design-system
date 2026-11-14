import { Card, Grid } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Grid columns={3} gap="6">
      <Card title="Revenue" />
      <Card title="Orders" />
      <Card title="Visitors" />
    </Grid>
  );
}
