import { Avatar } from '@artisanpack-ui/react';

export default function StatusExample() {
  return (
    <>
      <Avatar name="Olivia Rhye" status="online" statusLabel="Online" />
      <Avatar name="Lana Steiner" status="away" statusLabel="Away" />
      <Avatar name="Demi Wilkinson" status="offline" statusLabel="Offline" />
    </>
  );
}
