import { Rating } from '@artisanpack-ui/react';

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Rating readonly size="sm" value={5} count={4} />
      <Rating readonly value={5} count={4} />
      <Rating readonly size="lg" value={5} count={4} />
    </div>
  );
}
