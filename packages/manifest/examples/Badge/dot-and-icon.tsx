import { Badge } from '@artisanpack-ui/react';

export default function DotAndIconExample() {
  return (
    <>
      <Badge color="success" dot>
        Active
      </Badge>
      <Badge color="success" leadingIcon="arrow-right" size="sm">
        +11.01%
      </Badge>
      <Badge color="primary" size="lg">
        Pro
      </Badge>
    </>
  );
}
