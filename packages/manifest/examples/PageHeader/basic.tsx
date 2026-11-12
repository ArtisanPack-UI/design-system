import { Breadcrumbs, Button, PageHeader, Tabs } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <PageHeader
      title="Dashboard"
      description="Income, profit and transactions across all stores."
      breadcrumbs={
        <Breadcrumbs items={[{ label: 'Apexify', href: '/' }, { label: 'Dashboard' }]} />
      }
      actions={
        <>
          <Button variant="outline" color="neutral" size="sm" leadingIcon="calendar">
            Last 30 days
          </Button>
          <Button size="sm">Share</Button>
        </>
      }
      tabs={
        <Tabs
          variant="underline"
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'history', label: 'Trade history' },
          ]}
        />
      }
    />
  );
}
