import { Steps } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function DataExample() {
  const [step, setStep] = useState(3);

  return (
    <Steps
      value={step}
      onValueChange={setStep}
      clickable
      label="Checkout progress"
      steps={[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }, { title: 'Confirm' }]}
    />
  );
}
