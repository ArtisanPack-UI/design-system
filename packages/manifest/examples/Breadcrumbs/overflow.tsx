import { Breadcrumbs } from '@artisanpack-ui/react';

export default function OverflowExample() {
  return (
    <Breadcrumbs
      maxItems={4}
      overflowLabel="Show {count} more levels"
      items={[
        { label: 'Home', href: '/', icon: 'house', hideLabel: true },
        { label: 'Properties', href: '/properties' },
        { label: 'Lakeview Lofts', href: '/properties/lakeview-lofts' },
        { label: 'Analytics', href: '/properties/lakeview-lofts/analytics' },
        { label: 'Visitor' },
      ]}
    />
  );
}
