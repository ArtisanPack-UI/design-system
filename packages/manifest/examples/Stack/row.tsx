import { Button, Stack } from '@artisanpack-ui/react';

export default function RowExample() {
  return (
    <Stack orientation="horizontal" justify="between" align="center" wrap>
      <h2>Team</h2>
      <Button size="sm" leadingIcon="plus">
        Invite
      </Button>
    </Stack>
  );
}
