import { Icon, Swap } from '@artisanpack-ui/react';

export default function CustomExample() {
  return (
    <>
      <Swap label="Menu" transition="rotate" onIcon="x" offIcon="list" size="lg" />
      <Swap
        label="Starred"
        transition="none"
        on={<Icon name="star" color="warning" />}
        off={<Icon name="star" />}
      />
    </>
  );
}
