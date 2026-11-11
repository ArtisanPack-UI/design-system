import { Link } from '@artisanpack-ui/react';

export default function InlineExample() {
  return (
    <p>
      Read the <Link href="/terms">listing terms</Link> or{' '}
      <Link href="/privacy" tone="muted">
        privacy policy
      </Link>
      .
    </p>
  );
}
