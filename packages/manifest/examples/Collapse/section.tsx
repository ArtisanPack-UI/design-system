import { Collapse, Input, Toggle } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function SectionExample() {
  const [open, setOpen] = useState(false);

  return (
    <Collapse open={open} onOpenChange={setOpen} label="Advanced settings">
      <Input label="Custom URL" prefix="horizonhomes.com/l/" defaultValue="grove-greenfield" />
      <Toggle label="Hide from search engines" />
    </Collapse>
  );
}
