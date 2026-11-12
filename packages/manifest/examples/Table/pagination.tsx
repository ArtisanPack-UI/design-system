import { Table, type TableColumn } from '@artisanpack-ui/react';

interface Page {
  data: Record<string, unknown>[];
  current_page: number;
  total: number;
  per_page: number;
}

export default function PaginationExample({
  headers,
  transactions,
  onPageChange,
}: {
  headers: TableColumn[];
  transactions: Page;
  onPageChange: (page: number) => void;
}) {
  return (
    <Table
      title="Transaction history"
      headers={headers}
      rows={transactions.data}
      footer={`${transactions.total} transactions`}
      pagination={{
        page: transactions.current_page,
        total: transactions.total,
        perPage: transactions.per_page,
        onPageChange,
      }}
    />
  );
}
