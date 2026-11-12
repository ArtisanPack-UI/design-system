import { Avatar } from '@artisanpack-ui/react';

export default function InitialsExample({ avatarUrl }: { avatarUrl: string }) {
  return (
    <>
      <Avatar name="Olivia Rhye" />
      <Avatar name="Phoenix Baker" src={avatarUrl} size="lg" />
      <Avatar name="Apexify" shape="square" color="neutral" />
    </>
  );
}
