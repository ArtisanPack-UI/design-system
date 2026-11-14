import { Button, Drawer, Input, Toggle } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function BasicExample() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      trigger="Filters"
      title="Filters"
      description="218 properties match"
      footer={
        <>
          <Button variant="ghost" color="neutral">
            Reset
          </Button>
          <Button onClick={() => setOpen(false)}>Show 218 results</Button>
        </>
      }
    >
      <Input label="Location" leadingIcon="search" />
      <Toggle label="Only show pet friendly" />
    </Drawer>
  );
}
