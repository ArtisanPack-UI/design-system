import { Button, Input, Popover } from '@artisanpack-ui/react';

export default function BasicExample({ shareUrl }: { shareUrl: string }) {
  return (
    <Popover
      trigger="Share"
      title="Share report"
      actions={
        <Button
          size="sm"
          leadingIcon="copy"
          onClick={() => navigator.clipboard.writeText(shareUrl)}
        >
          Copy link
        </Button>
      }
    >
      <Input label="Link" readOnly value={shareUrl} />
    </Popover>
  );
}
