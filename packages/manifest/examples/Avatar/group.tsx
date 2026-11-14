import { AvatarGroup } from '@artisanpack-ui/react';

export default function GroupExample({ members }: { members: { name: string; src?: string }[] }) {
  return <AvatarGroup avatars={members} max={4} size="sm" label="Project members" />;
}
