import { Toggle } from '@artisanpack-ui/react';

export default function SizesExample() {
  return (
    <>
      <Toggle label="Small" size="sm" defaultChecked />
      <Toggle label="Medium" defaultChecked />
      <Toggle label="Large" size="lg" color="success" defaultChecked />
    </>
  );
}
