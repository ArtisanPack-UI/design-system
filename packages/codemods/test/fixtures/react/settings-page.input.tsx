import { useState } from 'react';
import {
  Avatar,
  Button,
  Modal,
  Pagination,
  Stat,
  StatGroup,
  Tabs,
  Tooltip,
  type ModalProps,
} from '@artisanpack-ui/react';
import { ErrorDisplay } from '@artisanpack-ui/react/feedback';

type ConfirmProps = Pick<ModalProps, 'open'> & { onDone: () => void };

function Confirm({ open, onDone }: ConfirmProps) {
  return (
    <Modal
      open={open}
      onClose={onDone}
      subtitle="This cannot be undone."
      actions={<Button onClick={onDone}>Delete</Button>}
      glass
    >
      Delete the workspace?
    </Modal>
  );
}

export function SettingsPage({ user, error }: { user: User; error?: string }) {
  const [tab, setTab] = useState('profile');
  const [page, setPage] = useState(1);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="card bg-base-100 p-6">
      {error && <ErrorDisplay message={error} />}
      <Tooltip tip={user.email} position="right">
        <Avatar image={user.avatar} placeholder={user.name} online />
      </Tooltip>
      <StatGroup>
        <Stat title="Projects" value={12} changeLabel="this month" />
        <Stat title="Members" value={4} />
      </StatGroup>
      <Tabs
        activeTab={tab}
        onChange={setTab}
        vertical
        tabListClassName="w-48"
        tabs={[{ name: 'profile', label: 'Profile' }]}
      />
      <Pagination currentPage={page} totalPages={9} onChange={setPage} />
      <button className="btn btn-error" onClick={() => setConfirming(true)}>
        Delete workspace
      </button>
      <Confirm open={confirming} onDone={() => setConfirming(false)} />
    </div>
  );
}
