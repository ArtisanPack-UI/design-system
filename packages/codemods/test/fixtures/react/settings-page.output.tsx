import { useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  Pagination,
  Stat,
  Grid,
  Tabs,
  Tooltip,
  type DialogProps,
} from '@artisanpack-ui/react';
import { ErrorState } from '@artisanpack-ui/react/feedback';

type ConfirmProps = Pick<DialogProps, 'open'> & { onDone: () => void };

function Confirm({ open, onDone }: ConfirmProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onDone}
      description="This cannot be undone."
      footer={<Button onClick={onDone}>Delete</Button>}
      surface="glass"
    >
      Delete the workspace?
    </Dialog>
  );
}

export function SettingsPage({ user, error }: { user: User; error?: string }) {
  const [tab, setTab] = useState('profile');
  const [page, setPage] = useState(1);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="card bg-base-100 p-6">
      {error && <ErrorState description={error} />}
      <Tooltip content={user.email} placement="end">
        <Avatar src={user.avatar} name={user.name} status="online" />
      </Tooltip>
      <Grid>
        <Stat label="Projects" value={12} description="this month" />
        <Stat label="Members" value={4} />
      </Grid>
      <Tabs
        value={tab}
        onValueChange={setTab}
        orientation="vertical"
        classes={{ tabList: 'w-48' }}
        tabs={[{ name: 'profile', label: 'Profile' }]}
      />
      <Pagination page={page} pageCount={9} onChange={setPage} />
      <button className="btn btn-error" onClick={() => setConfirming(true)}>
        Delete workspace
      </button>
      <Confirm open={confirming} onDone={() => setConfirming(false)} />
    </div>
  );
}
