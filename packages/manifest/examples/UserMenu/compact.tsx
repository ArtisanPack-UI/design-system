import { UserMenu } from '@artisanpack-ui/react';

export default function CompactExample({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <UserMenu
      user={{ name: 'Olivia Rhye', email: 'olivia@company.com' }}
      compact
      align="end"
      hideTheme
      onSelect={onSelect}
    />
  );
}
