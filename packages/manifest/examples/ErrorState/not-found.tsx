import { Button, ErrorState } from '@artisanpack-ui/react';

export default function NotFoundExample() {
  return (
    <ErrorState
      variant="not-found"
      headingLevel={1}
      focusTitle
      title="This page doesn’t exist"
      description="The listing may have been archived, or the link is mistyped."
      actions={
        <>
          <Button href="/dashboard">Go to dashboard</Button>
          <Button variant="outline" color="neutral" leadingIcon="search" href="/properties">
            Search properties
          </Button>
        </>
      }
    />
  );
}
