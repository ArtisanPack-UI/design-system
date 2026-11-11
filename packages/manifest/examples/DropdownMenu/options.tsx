import { DropdownMenu } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function OptionsExample() {
  const [showGrid, setShowGrid] = useState(true);
  const [sort, setSort] = useState('newest');

  return (
    <DropdownMenu
      label="View"
      align="end"
      items={[
        { type: 'checkbox', value: 'grid', label: 'Show grid', checked: showGrid },
        { type: 'separator' },
        {
          type: 'group',
          label: 'Sort by',
          items: [
            { type: 'radio', value: 'newest', label: 'Newest', checked: sort === 'newest' },
            { type: 'radio', value: 'price', label: 'Price', checked: sort === 'price' },
          ],
        },
      ]}
      onCheckedChange={({ value, checked }) => {
        if (value === 'grid') setShowGrid(checked);
        else if (checked) setSort(value);
      }}
    />
  );
}
