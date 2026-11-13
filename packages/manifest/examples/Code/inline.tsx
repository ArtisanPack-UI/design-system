import { Code } from '@artisanpack-ui/react';

export default function InlineExample() {
  return (
    <>
      <Code
        code="composer require artisanpack-ui/livewire-ui-components"
        fileName="Terminal"
        language="Shell"
      />
      <p>
        Set <Code inline code='data-theme="dark"' /> on any element to switch that region.
      </p>
    </>
  );
}
