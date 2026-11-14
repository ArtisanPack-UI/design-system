import { Button, Tooltip } from '@artisanpack-ui/react';

export default function LongExample() {
  return (
    <Tooltip
      size="lg"
      placement="end"
      content="Conversion is completed deals divided by unique visits in the period."
    >
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="info"
        aria-label="About conversion"
      />
    </Tooltip>
  );
}
