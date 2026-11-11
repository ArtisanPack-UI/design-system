import { Pagination } from '@artisanpack-ui/react';

interface Paginator {
  current_page: number;
  total: number;
  per_page: number;
}

export default function PaginatorExample({
  listings,
  onPageChange,
}: {
  listings: Paginator;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination
      page={listings.current_page}
      total={listings.total}
      perPage={listings.per_page}
      summary
      onPageChange={onPageChange}
    />
  );
}
