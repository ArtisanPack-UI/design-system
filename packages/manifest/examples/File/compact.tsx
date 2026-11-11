import { File as FileUpload } from '@artisanpack-ui/react';

export default function CompactExample() {
  return (
    <FileUpload
      variant="compact"
      name="contract"
      accept="application/pdf"
      title="Upload a contract"
      hint="PDF up to 10 MB"
      maxSize={10 * 1024 * 1024}
    />
  );
}
