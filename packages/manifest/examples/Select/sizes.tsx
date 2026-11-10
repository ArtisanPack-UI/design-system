import { Select } from '@artisanpack-ui/react';

export default function SizesExample() {
  return (
    <>
      <Select size="sm" label="Small" options={['One', 'Two']} />
      <Select size="md" label="Medium" options={['One', 'Two']} />
      <Select size="lg" label="Large" options={['One', 'Two']} />
    </>
  );
}
