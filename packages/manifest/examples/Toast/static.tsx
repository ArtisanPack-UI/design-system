import { Button, Toast } from '@artisanpack-ui/react';

export default function StaticExample() {
  return (
    <>
      <Toast color="success" title="Listing saved" description="Cedarwood Estates is live now." />
      <Toast color="error" title="Upload failed" description="The file is larger than 10 MB." />
      <Toast
        variant="inverse"
        title="Listing archived"
        actions={
          <Button size="sm" variant="outline" color="neutral">
            Undo
          </Button>
        }
      />
    </>
  );
}
