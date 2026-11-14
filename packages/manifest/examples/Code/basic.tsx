import { Code } from '@artisanpack-ui/react';

const snippet = `export function formatPrice(amount: number, currency = 'USD') {
  // Tabular figures line up in tables
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}`;

export default function BasicExample() {
  return (
    <Code
      code={snippet}
      fileName="format-price.ts"
      language="TypeScript"
      numbered
      highlight={[3]}
    />
  );
}
