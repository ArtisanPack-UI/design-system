import { Button, Card } from '@artisanpack-ui/react';

export default function LinkExample() {
  return (
    <Card
      href="/reports/q3"
      title="Q3 report"
      description="Revenue, churn and pipeline"
      actions={
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          iconOnly
          leadingIcon="download"
          aria-label="Download"
        />
      }
    />
  );
}
