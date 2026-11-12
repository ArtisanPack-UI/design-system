import { Table } from '@artisanpack-ui/react';

const headers = [
  { key: 'symbol', label: 'Product name', secondary: 'company' },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date' },
  { key: 'owner.name', label: 'Executed by' },
];

export default function BasicExample({
  transactions,
}: {
  transactions: Record<string, unknown>[];
}) {
  return (
    <Table title="Transaction history" headers={headers} rows={transactions} density="compact" />
  );
}
