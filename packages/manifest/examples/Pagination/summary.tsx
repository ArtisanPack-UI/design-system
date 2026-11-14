import { Pagination } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function SummaryExample() {
  const [page, setPage] = useState(3);

  return (
    <Pagination
      page={page}
      total={318}
      perPage={10}
      summary
      summaryLabel="Showing {from}–{to} of {total} properties"
      onPageChange={setPage}
    />
  );
}
