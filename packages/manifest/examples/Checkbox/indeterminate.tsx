import { useState } from 'react';
import { Checkbox } from '@artisanpack-ui/react';

const rows = ['Invoices', 'Receipts', 'Contracts'];

export default function IndeterminateExample() {
  const [selected, setSelected] = useState<string[]>(['Invoices']);
  const all = selected.length === rows.length;

  return (
    <>
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? rows : [])}
      />
      {rows.map((row) => (
        <Checkbox
          key={row}
          label={row}
          checked={selected.includes(row)}
          onCheckedChange={(checked) =>
            setSelected(checked ? [...selected, row] : selected.filter((item) => item !== row))
          }
        />
      ))}
    </>
  );
}
