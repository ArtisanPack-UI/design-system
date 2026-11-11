import { RadioGroup } from '@artisanpack-ui/react';

const plans = [
  { value: 'starter', label: 'Starter', description: 'Up to 5 listings', meta: '$0 / month' },
  {
    value: 'growth',
    label: 'Growth',
    description: 'Up to 50 listings and analytics',
    meta: '$39 / month',
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    description: 'Unlimited listings, team seats',
    meta: '$129 / month',
  },
];

export default function CardsExample() {
  return (
    <RadioGroup
      label="Plan"
      name="plan"
      variant="cards"
      orientation="horizontal"
      options={plans}
      defaultValue="growth"
    />
  );
}
