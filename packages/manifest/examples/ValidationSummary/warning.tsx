import { ValidationSummary } from '@artisanpack-ui/react';

export default function WarningExample() {
  return (
    <ValidationSummary
      color="warning"
      errors={[
        { field: 'description', message: 'Description is shorter than 80 characters.' },
        { field: 'floor-plan', message: 'No floor plan uploaded.' },
      ]}
    />
  );
}
