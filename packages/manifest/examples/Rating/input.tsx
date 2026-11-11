import { useState } from 'react';
import { Rating } from '@artisanpack-ui/react';

export default function InputExample() {
  const [score, setScore] = useState(4);

  return <Rating size="lg" label="Rate the viewing" value={score} onValueChange={setScore} />;
}
