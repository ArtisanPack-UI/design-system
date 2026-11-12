import { Button, ErrorState } from '@artisanpack-ui/react';

export default function RequestExample({
  requestId,
  onRetry,
}: {
  requestId: string;
  onRetry: () => void;
}) {
  return (
    <>
      <ErrorState
        title="Couldn’t load transactions"
        description="The payments service didn’t respond. Your data is safe; try again in a moment."
        code={`Error 503 · ${requestId}`}
        actions={
          <>
            <Button leadingIcon="refresh-cw" onClick={onRetry}>
              Try again
            </Button>
            <Button
              variant="ghost"
              color="neutral"
              trailingIcon="external-link"
              href="https://status.example.com"
            >
              Status page
            </Button>
          </>
        }
      />
      <ErrorState
        variant="offline"
        title="You’re offline"
        description="Changes are saved on this device and will sync when you reconnect."
      />
    </>
  );
}
