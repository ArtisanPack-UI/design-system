import { Breadcrumbs } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Breadcrumbs
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Properties', href: '/properties' },
        { label: 'Lakeview Lofts' },
      ]}
    />
  );
}
