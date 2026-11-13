import { Kbd } from '@artisanpack-ui/react';

export default function ContextExample() {
  return (
    <>
      <p>
        Press <Kbd keys={['mod', 'k']} /> to search, or <Kbd keys={['?']} /> for all shortcuts.
      </p>
      <Kbd keys={['mod', 'd']} size="sm" />
    </>
  );
}
