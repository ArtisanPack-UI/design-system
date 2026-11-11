import { Textarea } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <>
      <Textarea
        label="Summary"
        required
        defaultValue="Too short"
        error="Write at least 40 characters."
      />
      <Textarea label="Imported text" value="Imported from the March listing feed." readonly />
      <Textarea label="Internal notes" value="Locked while the listing is reviewed." disabled />
    </>
  );
}
