import { Badge, Button, Table } from '@artisanpack-ui/react';

interface Transaction {
  id: number;
  symbol: string;
  status: string;
  color: 'success' | 'error' | 'info';
  notes: string;
}

const headers = [
  { key: 'symbol', label: 'Product name' },
  { key: 'status', label: 'Status' },
];

export default function CellsExample({ transactions }: { transactions: Transaction[] }) {
  return (
    <Table<Transaction>
      label="Transactions"
      headers={headers}
      rows={transactions}
      expandable
      renderCell={(row, column) =>
        column.key === 'status' ? <Badge color={row.color} value={row.status} /> : undefined
      }
      renderActions={(row) => (
        <Button variant="ghost" size="sm" href={`/transactions/${row.id}`}>
          View
        </Button>
      )}
      renderExpansion={(row) => row.notes}
    />
  );
}
