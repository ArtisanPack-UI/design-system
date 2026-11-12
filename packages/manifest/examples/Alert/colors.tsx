import { Alert, Button } from '@artisanpack-ui/react';

export default function ColorsExample() {
  return (
    <>
      <Alert
        color="info"
        title="New reporting period"
        description="Q4 numbers are now available in Analytics."
      />
      <Alert
        color="warning"
        title="Your monthly traffic is close to the limit"
        description="You’ve used 92% of 50,000 visits. Upgrade to avoid throttling."
        actions={
          <>
            <Button size="xs" color="warning">
              Upgrade
            </Button>
            <Button size="xs" variant="ghost" color="neutral">
              Learn more
            </Button>
          </>
        }
      />
      <Alert color="error" title="Payment failed">
        We couldn’t charge the card ending in 4242. Update it to keep your listings active.
      </Alert>
    </>
  );
}
