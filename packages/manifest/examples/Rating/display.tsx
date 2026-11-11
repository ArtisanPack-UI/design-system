import { Rating } from '@artisanpack-ui/react';

export default function DisplayExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Rating readonly value={4.2} count={17} />
      <Rating readonly value={3.5} count={128} />
    </div>
  );
}
