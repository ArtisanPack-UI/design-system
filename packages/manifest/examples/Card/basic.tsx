import { Button, Card } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Card
      title="Quarterly report"
      description="Updated 2 hours ago"
      actions={
        <Button variant="ghost" color="neutral" size="sm">
          Share
        </Button>
      }
      footer={
        <>
          <Button variant="outline" color="neutral">
            Dismiss
          </Button>
          <Button>Open report</Button>
        </>
      }
    >
      Revenue grew 12% this quarter, led by renewals.
    </Card>
  );
}
