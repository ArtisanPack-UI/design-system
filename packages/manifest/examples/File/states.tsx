import { File as FileUpload } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <FileUpload label="Documents" required error="Add at least one document." />
      <FileUpload label="Archived documents" disabled />
    </div>
  );
}
