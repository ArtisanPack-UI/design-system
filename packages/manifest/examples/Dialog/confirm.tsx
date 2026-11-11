import { Button, Dialog } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function ConfirmExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="error" variant="soft" onClick={() => setOpen(true)}>
        Delete listing
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        size="sm"
        color="error"
        icon="trash"
        title="Delete Cedarwood Estates?"
        description="The listing and its 3 open offers will be removed. This can't be undone."
        footer={
          <>
            <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={() => setOpen(false)}>
              Delete listing
            </Button>
          </>
        }
      />
    </>
  );
}
