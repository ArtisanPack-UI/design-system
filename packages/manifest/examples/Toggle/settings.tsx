import { useState } from 'react';
import { Toggle } from '@artisanpack-ui/react';

export default function SettingsExample() {
  const [digest, setDigest] = useState(true);

  return (
    <>
      <Toggle
        label="Weekly revenue digest"
        description="Every Monday at 9:00."
        checked={digest}
        onCheckedChange={setDigest}
      />
      <Toggle
        label="Two-factor authentication"
        description="Required by your workspace admin."
        checked
        disabled
      />
    </>
  );
}
