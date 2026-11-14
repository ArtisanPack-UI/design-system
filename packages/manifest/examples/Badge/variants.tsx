import { Badge } from '@artisanpack-ui/react';

export default function VariantsExample() {
  return (
    <>
      <Badge color="success">Paid</Badge>
      <Badge color="info" variant="solid">
        New
      </Badge>
      <Badge color="warning" variant="outline">
        Pending
      </Badge>
      <Badge color="error" variant="ghost" dot>
        Overdue
      </Badge>
    </>
  );
}
