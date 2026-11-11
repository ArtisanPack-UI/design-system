import { Link } from '@artisanpack-ui/react';

export default function ExternalExample() {
  return (
    <Link
      href="https://docs.artisanpackui.dev"
      standalone
      external
      externalLabel="(opens in a new tab)"
    >
      Documentation
    </Link>
  );
}
