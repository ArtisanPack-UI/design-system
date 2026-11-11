import { ValidationSummary } from '@artisanpack-ui/react';

export default function BasicExample() {
  // From your form library or server response: field id or name → message(s).
  const errors = {
    'postal-code': 'Spanish postal codes have 5 digits.',
    photos: ['Add at least 2 more photos.'],
  };

  return <ValidationSummary errors={errors} title="Fix these before publishing" />;
}
