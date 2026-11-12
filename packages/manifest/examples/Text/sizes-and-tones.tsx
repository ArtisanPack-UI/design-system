import { Text } from '@artisanpack-ui/react';

export default function SizesAndTonesExample() {
  return (
    <>
      <Text size="lead">Twenty-four bright apartments around a garden courtyard.</Text>
      <Text size="sm" tone="muted">
        Updated 2 hours ago
      </Text>
      <Text as="span" tone="success" weight="medium">
        +10.9% vs last month
      </Text>
    </>
  );
}
