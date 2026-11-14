import { Spotlight, type SpotlightGroup } from '@artisanpack-ui/react';

const groups: SpotlightGroup[] = [
  {
    label: 'Pages',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'house' },
      { label: 'Reports', href: '/reports', icon: 'file-text', keywords: ['analytics'] },
      { label: 'Settings', href: '/settings', icon: 'settings' },
    ],
  },
  {
    label: 'Actions',
    items: [
      {
        value: 'add-property',
        label: 'Add property',
        icon: 'plus',
        color: 'success',
        shortcut: '⌘ N',
      },
      { value: 'import', label: 'Import listings from CSV', icon: 'upload' },
    ],
  },
];

export default function BasicExample() {
  return (
    <Spotlight
      trigger="Search"
      groups={groups}
      recent
      onSelect={(item) => {
        if (!item.href) console.log('Run', item.value);
      }}
    />
  );
}
