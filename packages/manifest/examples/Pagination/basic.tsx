import { Pagination } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function BasicExample() {
  const [page, setPage] = useState(3);

  return <Pagination page={page} total={318} perPage={10} onPageChange={setPage} />;
}
