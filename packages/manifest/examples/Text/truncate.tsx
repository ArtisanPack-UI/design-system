import { Text } from '@artisanpack-ui/react';

export default function TruncateExample({
  description,
  summary,
}: {
  description: string;
  summary: string;
}) {
  return (
    <>
      <Text truncate>{description}</Text>
      <Text clamp={2}>{summary}</Text>
    </>
  );
}
