import { Progress } from '@artisanpack-ui/react';

export default function LabeledExample({ uploaded }: { uploaded: number }) {
  return (
    <>
      <Progress
        value={(uploaded / 12) * 100}
        label="Uploading 12 photos"
        valueText={`${uploaded} of 12`}
      />
      <Progress
        value={92}
        color="warning"
        label="Monthly visits used"
        valueText="46,120 / 50,000"
      />
      <Progress value={40} size="sm" aria-label="Profile completeness" />
    </>
  );
}
