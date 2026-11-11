import { useState } from 'react';
import { File as FileUpload } from '@artisanpack-ui/react';

export default function DropzoneExample() {
  const [photos, setPhotos] = useState<File[]>([]);

  return (
    <FileUpload
      label="Listing photos"
      title="Drop photos here or browse"
      hint="JPG or PNG, up to 20 MB each, 12 files max"
      multiple
      accept="image/jpeg,image/png"
      maxSize={20 * 1024 * 1024}
      value={photos}
      onValueChange={setPhotos}
    />
  );
}
