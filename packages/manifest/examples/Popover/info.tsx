import { Button, Popover } from '@artisanpack-ui/react';

export default function InfoExample() {
  return (
    <Popover
      placement="top"
      title="What counts as a visit?"
      trigger={
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          iconOnly
          leadingIcon="info"
          aria-label="About visits"
        />
      }
    >
      <p>A unique person who opened the listing for at least 5 seconds, counted once a day.</p>
    </Popover>
  );
}
