import { useState, type FormEvent } from 'react';
import {
  Button,
  Checkbox,
  Fieldset,
  Form,
  Input,
  ValidationSummary,
  type ValidationSummaryError,
} from '@artisanpack-ui/react';

export default function SectionsExample() {
  const [errors, setErrors] = useState<ValidationSummaryError[]>([]);

  const publish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([{ field: 'postal-code', message: 'Spanish postal codes have 5 digits.' }]);
  };

  return (
    <Form
      aria-label="Listing"
      divided
      noValidate
      onSubmit={publish}
      actions={<Button type="submit">Publish listing</Button>}
    >
      <ValidationSummary errors={errors} />

      <Fieldset variant="divided" title="Location">
        <Input id="postal-code" label="Postal code" error={errors[0]?.message} />
      </Fieldset>
      <Fieldset variant="plain" title="Agreements">
        <Checkbox name="terms" label="I accept the listing terms" />
      </Fieldset>
    </Form>
  );
}
