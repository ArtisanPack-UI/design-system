import { Button, EmptyState } from '@artisanpack-ui/react';

export default function VariantsExample({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <>
      <EmptyState
        title="No properties yet"
        description="Add your first property to start tracking visits, offers and revenue."
        actions={
          <>
            <Button leadingIcon="plus" href="/properties/create">
              Add property
            </Button>
            <Button variant="outline" color="neutral" leadingIcon="upload">
              Import CSV
            </Button>
          </>
        }
      />
      <EmptyState
        variant="no-results"
        title={`No results for “${search}”`}
        description="Check the spelling, or clear filters to see all properties."
        actions={
          <Button variant="outline" color="neutral" onClick={onClear}>
            Clear filters
          </Button>
        }
      />
      <EmptyState
        variant="cleared"
        size="sm"
        headingLevel={4}
        title="You’re all caught up"
        description="New offers will appear here."
      />
    </>
  );
}
