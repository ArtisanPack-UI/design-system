import { Link } from '@artisanpack-ui/react';

export default function StandaloneExample() {
  return (
    <>
      <Link href="/properties" standalone trailingIcon="arrow-right">
        View all properties
      </Link>
      <Link href="/brochure.pdf" standalone leadingIcon="download">
        Download PDF
      </Link>
    </>
  );
}
