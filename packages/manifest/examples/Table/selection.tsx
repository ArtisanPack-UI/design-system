import { useState } from 'react';
import { Table, type TableKey, type TableSort } from '@artisanpack-ui/react';

const headers = [
  { key: 'symbol', label: 'Product name', sortable: true },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date', sortable: true },
];

export default function SelectionExample({
  transactions,
}: {
  transactions: Record<string, unknown>[];
}) {
  const [selected, setSelected] = useState<TableKey[]>([]);
  const [sort, setSort] = useState<TableSort>({ column: 'date', direction: 'desc' });
  return (
    <Table
      title="Transaction history"
      headers={headers}
      rows={transactions}
      sortBy={sort}
      onSortChange={setSort}
      selectable
      value={selected}
      onValueChange={setSelected}
    />
  );
}
