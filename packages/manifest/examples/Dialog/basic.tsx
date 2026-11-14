import { Button, Dialog, Input } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function BasicExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger="Invite member"
      title="Invite member"
      description="They'll get an email with a link to join the project."
      footer={
        <>
          <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Send invite</Button>
        </>
      }
    >
      <Input type="email" label="Email" />
    </Dialog>
  );
}
