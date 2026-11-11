import { Fieldset, Input } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Fieldset title="Contact" description="Who buyers and renters should reach.">
      <div data-scope="fieldset" data-part="row">
        <Input label="Full name" />
        <Input type="email" label="Email" leadingIcon="mail" />
      </div>
      <Input type="tel" label="Phone" />
    </Fieldset>
  );
}
