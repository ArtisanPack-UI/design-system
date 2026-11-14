import { Button, Tooltip } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Tooltip content="Edit" shortcut="E">
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="pencil"
        aria-label="Edit"
      />
    </Tooltip>
  );
}
