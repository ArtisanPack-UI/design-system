import { Button, Divider, Stack } from '@artisanpack-ui/react';

export default function VerticalExample() {
  return (
    <Stack orientation="horizontal" gap="2">
      <Button variant="ghost" color="neutral" size="sm">
        Edit
      </Button>
      <Divider orientation="vertical" />
      <Button variant="ghost" color="neutral" size="sm">
        Duplicate
      </Button>
      <Divider orientation="vertical" />
      <Button variant="ghost" color="error" size="sm">
        Archive
      </Button>
    </Stack>
  );
}
