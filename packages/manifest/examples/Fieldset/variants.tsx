import { Checkbox, Fieldset, Input } from '@artisanpack-ui/react';

export default function VariantsExample() {
  return (
    <>
      <Fieldset variant="divided" title="Billing address">
        <Checkbox label="Same as property address" />
      </Fieldset>
      <Fieldset
        variant="plain"
        title="Payout account"
        description="Locked while a payout is processing."
        disabled
      >
        <Input label="IBAN" defaultValue="ES91 •••• •••• 1332" />
      </Fieldset>
    </>
  );
}
