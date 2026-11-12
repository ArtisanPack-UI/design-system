import { Skeleton } from '@artisanpack-ui/react';

export default function ListExample() {
  return (
    <div aria-busy="true" style={{ display: 'grid', gap: 14 }}>
      {[1, 2, 3].map((row) => (
        <div key={row} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton shape="circle" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton shape="text" width="50%" />
            <Skeleton shape="text" width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}
