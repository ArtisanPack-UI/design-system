import { Button, Input, Stack } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Stack gap="4">
      <Input label="Name" />
      <Input label="Email" type="email" />
      <Button>Save</Button>
    </Stack>
  );
}
