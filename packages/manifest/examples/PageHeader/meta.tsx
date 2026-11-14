import { Badge, Button, PageHeader } from '@artisanpack-ui/react';

export default function MetaExample() {
  return (
    <PageHeader
      title="The Grove at Greenfield"
      meta={
        <>
          <Badge color="warning">Draft</Badge>
          Edited 20 min ago
        </>
      }
      actions={
        <>
          <Button variant="ghost" color="neutral" size="sm" leadingIcon="eye">
            Preview
          </Button>
          <Button size="sm">Publish</Button>
        </>
      }
    />
  );
}
