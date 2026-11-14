import { Card, Loading } from '@artisanpack-ui/react';

export default function OverlayExample({ loading }: { loading: boolean }) {
  return (
    <Card title="Weekly revenue" style={{ position: 'relative' }} aria-busy={loading}>
      {/* … */}
      {loading ? (
        <Loading overlay size="lg">
          Loading revenue…
        </Loading>
      ) : null}
    </Card>
  );
}
