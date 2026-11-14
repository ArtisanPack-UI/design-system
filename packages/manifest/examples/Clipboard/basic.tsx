import { Clipboard } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <>
      <Clipboard value="https://horizonhomes.com/l/grove-greenfield" />
      <Clipboard value="LST-4127" variant="icon" label="Copy reference" />
    </>
  );
}
