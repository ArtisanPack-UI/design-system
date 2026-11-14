import { Kbd } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <>
      <Kbd keys={['mod', 'k']} />
      <Kbd keys={['ctrl', 'shift', 'p']} />
      <Kbd keys={['esc']} />
      <Kbd keys={['enter']} />
      <Kbd>Tab</Kbd>
    </>
  );
}
