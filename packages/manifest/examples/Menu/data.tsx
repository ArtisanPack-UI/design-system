import { Menu, type MenuItemData } from '@artisanpack-ui/react';

const items: MenuItemData[] = [
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '/settings/profile', current: true },
      { label: 'Security', href: '/settings/security' },
    ],
  },
  { type: 'separator' },
  { label: 'Billing', href: '/settings/billing', icon: 'lock' },
];

export default function DataExample() {
  return <Menu label="Settings" collapsible={false} items={items} />;
}
