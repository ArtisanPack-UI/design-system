import { Input } from '@artisanpack-ui/react';

export default function AddonsExample() {
  return (
    <>
      <Input type="search" label="Search" leadingIcon="search" />
      <Input type="number" label="Price" prefix="USD" suffix="/mo" />
      <Input type="url" label="Website" prefix="https://" trailingIcon="arrow-right" />
    </>
  );
}
