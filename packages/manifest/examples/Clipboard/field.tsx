import { Clipboard } from '@artisanpack-ui/react';

export default function FieldExample({ onShare }: { onShare: (url: string) => void }) {
  return (
    <Clipboard
      value="https://horizonhomes.com/l/grove-greenfield"
      variant="field"
      size="md"
      label="Copy share link"
      onCopy={onShare}
    />
  );
}
